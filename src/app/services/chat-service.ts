import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat, Message, ChatSummary, ComponentInfo, CompatibilityResult } from '../models/chat';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  public chats$ = this.chatsSubject.asObservable();

  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  public currentChat$ = this.currentChatSubject.asObservable();

  private readonly CHATS_STORAGE_KEY = 'zero_ai_chats';

  // Base de conocimientos simulada de componentes
  private componentsDB: ComponentInfo[] = [
    {
      name: 'RTX 4070',
      type: 'gpu',
      brand: 'NVIDIA',
      model: 'GeForce RTX 4070',
      specs: { 
        vram: '12GB GDDR6X', 
        powerConsumption: 200, 
        pciSlot: 'PCIe 4.0 x16',
        minPSU: 650
      }
    },
    {
      name: 'RTX 4060',
      type: 'gpu',
      brand: 'NVIDIA', 
      model: 'GeForce RTX 4060',
      specs: { 
        vram: '8GB GDDR6', 
        powerConsumption: 115, 
        pciSlot: 'PCIe 4.0 x16',
        minPSU: 550
      }
    },
    // Agregar más componentes según necesidad
  ];

  constructor(private authService: AuthService) {
    this.loadChats();
  }

  /**
   * RF-Usu-04: Crear nueva conversación
   */
  createNewChat(): Chat {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const newChat: Chat = {
      id: this.generateChatId(),
      userId: user.id,
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const chats = this.chatsSubject.value;
    chats.push(newChat);
    this.chatsSubject.next(chats);
    this.saveChats(chats);
    this.currentChatSubject.next(newChat);

    return newChat;
  }

  /**
   * RF-Usu-03: Obtener chats del usuario para la barra lateral
   */
  getUserChats(): ChatSummary[] {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return [];
    }

    return this.chatsSubject.value
      .filter(chat => chat.userId === user.id && chat.isActive)
      .map(chat => ({
        id: chat.id,
        title: chat.title,
        lastMessage: chat.messages.length > 0 
          ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + '...'
          : 'Sin mensajes',
        timestamp: chat.updatedAt,
        messageCount: chat.messages.length
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Seleccionar chat actual
   */
  selectChat(chatId: string): void {
    const chat = this.chatsSubject.value.find(c => c.id === chatId);
    if (chat) {
      this.currentChatSubject.next(chat);
    }
  }

  /**
   * Obtener chat actual
   */
  getCurrentChat(): Chat | null {
    return this.currentChatSubject.value;
  }

  /**
   * RF-Usu-05: Enviar mensaje sobre compatibilidad
   * RF-Usu-06: Enviar mensaje sobre comparación
   */
  async sendMessage(content: string, type: 'text' | 'image' = 'text'): Promise<void> {
    const currentChat = this.currentChatSubject.value;
    if (!currentChat) {
      throw new Error('No hay chat activo');
    }

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: this.generateMessageId(),
      content: content,
      timestamp: new Date(),
      sender: 'user',
      type: type
    };

    currentChat.messages.push(userMessage);
    
    // Actualizar título del chat si es el primer mensaje
    if (currentChat.messages.length === 1) {
      currentChat.title = content.length > 30 
        ? content.substring(0, 30) + '...' 
        : content;
    }

    // Simular procesamiento del asistente
    const assistantResponse = await this.processUserMessage(content);
    
    currentChat.messages.push(assistantResponse);
    currentChat.updatedAt = new Date();

    // Actualizar subjects
    this.currentChatSubject.next(currentChat);
    this.updateChatInList(currentChat);
  }

  /**
   * RF-ADM-02: Obtener todas las conversaciones (solo admin)
   */
  getAllChats(): Chat[] {
    if (!this.authService.isAdmin()) {
      return [];
    }
    return this.chatsSubject.value;
  }

  /**
   * Eliminar chat
   */
  deleteChat(chatId: string): void {
    const chats = this.chatsSubject.value;
    const chatIndex = chats.findIndex(c => c.id === chatId);
    
    if (chatIndex !== -1) {
      chats[chatIndex].isActive = false;
      this.chatsSubject.next(chats);
      this.saveChats(chats);
      
      // Si era el chat actual, limpiarlo
      if (this.currentChatSubject.value?.id === chatId) {
        this.currentChatSubject.next(null);
      }
    }
  }

  // Métodos privados

  /**
   * Procesar mensaje del usuario y generar respuesta del asistente
   * RF-Usu-05, RF-Usu-06, RF-Usu-07, RF-Usu-08
   */
  private async processUserMessage(content: string): Promise<Message> {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerContent = content.toLowerCase();
    let response: Message;

    // Determinar tipo de consulta y generar respuesta apropiada
    if (this.isCompatibilityQuery(lowerContent)) {
      response = await this.generateCompatibilityResponse(content);
    } else if (this.isComparisonQuery(lowerContent)) {
      response = await this.generateComparisonResponse(content);
    } else if (this.isGeneralInfoQuery(lowerContent)) {
      response = await this.generateInfoResponse(content);
    } else {
      response = this.generateDefaultResponse(content);
    }

    return response;
  }

  /**
   * Detectar si es consulta de compatibilidad
   */
  private isCompatibilityQuery(content: string): boolean {
    const compatibilityKeywords = [
      'compatible', 'compatibilidad', 'funciona con', 'sirve para',
      'va con', 'puedo usar', 'se puede', 'motherboard', 'placa madre'
    ];
    return compatibilityKeywords.some(keyword => content.includes(keyword));
  }

  /**
   * Detectar si es consulta de comparación
   */
  private isComparisonQuery(content: string): boolean {
    const comparisonKeywords = [
      'diferencia', 'comparar', 'mejor', 'vs', 'entre', 'cual es',
      'cuál es', 'ventaja', 'desventaja'
    ];
    return comparisonKeywords.some(keyword => content.includes(keyword));
  }

  /**
   * Detectar si es consulta general de información
   */
  private isGeneralInfoQuery(content: string): boolean {
    const infoKeywords = [
      'que es', 'qué es', 'como funciona', 'cómo funciona', 'especificaciones',
      'precio', 'costo', 'donde comprar', 'dónde comprar'
    ];
    return infoKeywords.some(keyword => content.includes(keyword));
  }

  /**
   * RF-Usu-05: Generar respuesta de compatibilidad
   */
  private async generateCompatibilityResponse(query: string): Promise<Message> {
    // Extraer componentes de la consulta
    const components = this.extractComponents(query);
    
    if (components.length >= 2) {
      const [component1, component2] = components;
      const compatibility = this.checkCompatibility(component1, component2);
      
      const responseContent = `
<h4>Compatibilidad entre ${component1} y ${component2}</h4>

${compatibility.compatible ? '✅ Sí son compatibles!' : '❌ No son completamente compatibles'}

• GPU: ${component1} (PCIe 4.0 x16)
• Motherboard: ${component2} (Slot PCIe 4.0 x16)

${compatibility.compatible ? 
  'Recomendación: Asegúrate de que tu fuente de poder tenga al menos 650W y los conectores de PCIe necesarios.' :
  'Recomendación: Verifica las especificaciones del socket y la compatibilidad del chipset.'
}`;

      return {
        id: this.generateMessageId(),
        content: responseContent,
        timestamp: new Date(),
        sender: 'assistant',
        type: 'text',
        metadata: {
          analysisType: 'compatibility',
          componentType: 'gpu'
        }
      };
    }

    return this.generateDefaultResponse(query);
  }

  /**
   * RF-Usu-06: Generar respuesta de comparación
   */
  private async generateComparisonResponse(query: string): Promise<Message> {
    const components = this.extractComponents(query);
    
    if (components.length >= 2) {
      const [component1, component2] = components;
      
      const responseContent = `
<h4>Comparación entre ${component1} vs ${component2}</h4>

<strong>${component1}:</strong>
• VRAM: 12GB GDDR6X
• Consumo: 200W
• Rendimiento: Excelente para 1440p
• Precio aproximado: $599 USD

<strong>${component2}:</strong>
• VRAM: 8GB GDDR6
• Consumo: 115W
• Rendimiento: Ideal para 1080p
• Precio aproximado: $299 USD

<strong>Recomendación:</strong>
${component1} es mejor para gaming en 1440p y resoluciones altas, mientras que ${component2} es más eficiente para 1080p y presupuestos ajustados.`;

      return {
        id: this.generateMessageId(),
        content: responseContent,
        timestamp: new Date(),
        sender: 'assistant',
        type: 'text',
        metadata: {
          analysisType: 'comparison',
          componentType: 'gpu',
          productUrl: 'https://www.example.com/gpu-comparison'
        }
      };
    }

    return this.generateDefaultResponse(query);
  }

  /**
   * RF-Usu-07: Generar respuesta de información general
   */
  private async generateInfoResponse(query: string): Promise<Message> {
    const responseContent = `
<h4>Información sobre componentes PC</h4>

Te puedo ayudar con información sobre:

• <strong>Tarjetas gráficas (GPU):</strong> RTX 40 series, RX 7000 series
• <strong>Procesadores (CPU):</strong> Intel 13th gen, AMD Ryzen 7000
• <strong>Motherboards:</strong> Chipsets compatibles y características
• <strong>Memoria RAM:</strong> DDR4 vs DDR5, velocidades y capacidades
• <strong>Fuentes de poder:</strong> Cálculo de vataje y certificaciones

¿Sobre qué componente específico te gustaría saber más?`;

    return {
      id: this.generateMessageId(),
      content: responseContent,
      timestamp: new Date(),
      sender: 'assistant',
      type: 'text',
      metadata: {
        analysisType: 'info'
      }
    };
  }

  /**
   * Generar respuesta por defecto
   */
  private generateDefaultResponse(query: string): Message {
    const responses = [
      `¡Hola! Soy ZERO, tu asistente especializado en PC gaming. 

Puedo ayudarte con:
• Verificar compatibilidad entre componentes
• Comparar diferentes productos
• Recomendaciones de builds

¿En qué te puedo ayudar específicamente?`,
      
      `No estoy seguro de entender tu consulta. 

Intenta preguntarme algo como:
• "¿Es compatible RTX 4070 con motherboard B550?"
• "¿Cuál es la diferencia entre RTX 4060 y RTX 4070?"
• "¿Qué fuente de poder necesito para RTX 4080?"`,
    ];

    return {
      id: this.generateMessageId(),
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      sender: 'assistant',
      type: 'text'
    };
  }

  /**
   * Extraer componentes de la consulta usando palabras clave
   */
  private extractComponents(query: string): string[] {
    const components: string[] = [];
    const lowerQuery = query.toLowerCase();

    // GPUs
    const gpuPatterns = [
      /rtx\s?40(60|70|80|90)/gi,
      /gtx\s?(1650|1660|1070|1080)/gi,
      /rx\s?(6600|6700|6800|6900|7600|7700|7800|7900)/gi
    ];

    // Motherboards
    const mbPatterns = [
      /b(450|550|650)/gi,
      /x(470|570|670)/gi,
      /z(490|590|690)/gi,
      /(asus|gigabyte|msi|asrock)/gi
    ];

    // Buscar GPUs
    gpuPatterns.forEach(pattern => {
      const matches = query.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!components.includes(match.toUpperCase())) {
            components.push(match.toUpperCase().replace(/\s+/g, ' '));
          }
        });
      }
    });

    // Buscar Motherboards
    mbPatterns.forEach(pattern => {
      const matches = query.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!components.includes(match.toUpperCase())) {
            components.push(match.toUpperCase());
          }
        });
      }
    });

    return components;
  }

  /**
   * Verificar compatibilidad entre componentes (lógica simplificada)
   */
  private checkCompatibility(component1: string, component2: string): CompatibilityResult {
    // Lógica simplificada - en un caso real esto sería más complejo
    const isGPU = (comp: string) => /RTX|GTX|RX/i.test(comp);
    const isMB = (comp: string) => /B\d{3}|X\d{3}|Z\d{3}/i.test(comp);

    if (isGPU(component1) && isMB(component2)) {
      // La mayoría de GPUs modernas son compatibles con motherboards modernas
      return {
        compatible: true,
        confidence: 0.9,
        reasons: ['Ambos soportan PCIe 4.0', 'Conectores estándar'],
        recommendations: ['Verificar fuente de poder', 'Comprobar espacio en el case']
      };
    }

    return {
      compatible: false,
      confidence: 0.5,
      reasons: ['Información insuficiente para determinar compatibilidad'],
      recommendations: ['Proporciona más detalles sobre los componentes']
    };
  }

  /**
   * Actualizar chat en la lista
   */
  private updateChatInList(updatedChat: Chat): void {
    const chats = this.chatsSubject.value;
    const index = chats.findIndex(c => c.id === updatedChat.id);
    
    if (index !== -1) {
      chats[index] = updatedChat;
      this.chatsSubject.next(chats);
      this.saveChats(chats);
    }
  }

  /**
   * Cargar chats desde localStorage
   */
  private loadChats(): void {
    try {
      const chatsData = localStorage.getItem(this.CHATS_STORAGE_KEY);
      if (chatsData) {
        const chats: Chat[] = JSON.parse(chatsData);
        // Convertir strings de fecha a objetos Date
        chats.forEach(chat => {
          chat.createdAt = new Date(chat.createdAt);
          chat.updatedAt = new Date(chat.updatedAt);
          chat.messages.forEach(message => {
            message.timestamp = new Date(message.timestamp);
          });
        });
        this.chatsSubject.next(chats);
      }
    } catch (error) {
      console.error('Error cargando chats:', error);
    }
  }

  /**
   * Guardar chats en localStorage
   */
  private saveChats(chats: Chat[]): void {
    try {
      localStorage.setItem(this.CHATS_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error guardando chats:', error);
    }
  }

  /**
   * Generar ID único para chat
   */
  private generateChatId(): string {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generar ID único para mensaje
   */
  private generateMessageId(): string {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}