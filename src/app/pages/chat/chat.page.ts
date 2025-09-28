import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ChatService } from '../../services/chat-service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Chat, ChatSummary, Message } from '../../models/chat';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone : false
})
export class ChatPage implements OnInit, OnDestroy {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  currentUser: User | null = null;
  currentChat: Chat | null = null;
  currentChatId: string | null = null;
  chatHistory: ChatSummary[] = [];
  messageText = '';
  isTyping = false;
  sidebarOpen = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private chatService: ChatService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    // Obtener usuario actual
    this.currentUser = this.authService.getCurrentUser();

    // Suscribirse a cambios en chats
    const chatsSubscription = this.chatService.chats$.subscribe(chats => {
      this.updateChatHistory();
    });
    this.subscriptions.push(chatsSubscription);

    // Suscribirse a cambios en chat actual
    const currentChatSubscription = this.chatService.currentChat$.subscribe(chat => {
      this.currentChat = chat;
      this.currentChatId = chat?.id || null;
      
      // Auto-scroll al final cuando hay mensajes nuevos
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
    this.subscriptions.push(currentChatSubscription);

    // Cargar historial de chats
    this.updateChatHistory();

    // En desktop, abrir sidebar por defecto
    if (window.innerWidth >= 768) {
      this.sidebarOpen = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * RF-Usu-02: Abrir/cerrar barra lateral
   */
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  /**
   * RF-Usu-04: Crear nueva conversación
   */
  createNewChat() {
    try {
      const newChat = this.chatService.createNewChat();
      this.updateChatHistory();
      this.closeSidebarOnMobile();
    } catch (error) {
      console.error('Error creando nuevo chat:', error);
      this.showErrorAlert('Error al crear nuevo chat');
    }
  }

  /**
   * RF-Usu-03: Seleccionar chat de la barra lateral
   */
  selectChat(chatId: string) {
    this.chatService.selectChat(chatId);
    this.closeSidebarOnMobile();
  }

  /**
   * RF-Usu-05, RF-Usu-06: Enviar mensaje al asistente
   */
  async sendMessage() {
    if (!this.messageText.trim() || this.isTyping) {
      return;
    }

    // Si no hay chat activo, crear uno nuevo
    if (!this.currentChat) {
      this.createNewChat();
      // Esperar un momento para que se cree el chat
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const message = this.messageText.trim();
    this.messageText = '';
    this.isTyping = true;

    try {
      await this.chatService.sendMessage(message);
      this.updateChatHistory();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      this.showErrorAlert('Error al enviar mensaje');
    } finally {
      this.isTyping = false;
      // Enfocar input después de enviar
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.setFocus();
        }
      }, 100);
    }
  }

  /**
   * Manejar tecla Enter en el input
   */
  onEnterKey(event: any) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Formatear mensaje del asistente con HTML
   */
  formatAssistantMessage(content: string): string {
    // Detectar compatibilidad y aplicar estilos
    if (content.includes('✅') || content.includes('Sí son compatibles')) {
      content = content.replace(/✅.*?(?=\n|$)/g, '<span class="compatibility-result compatible">$&</span>');
    }
    
    if (content.includes('❌') || content.includes('No son compatibles')) {
      content = content.replace(/❌.*?(?=\n|$)/g, '<span class="compatibility-result incompatible">$&</span>');
    }

    // Convertir saltos de línea a <br>
    content = content.replace(/\n/g, '<br>');
    
    // Detectar títulos (líneas que terminan con :)
    content = content.replace(/^([^<\n]+:)(?=<br>|$)/gm, '<h4>$1</h4>');
    
    // Detectar listas con •
    content = content.replace(/• ([^<\n]+)/g, '<li>$1</li>');
    content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    return content;
  }

  /**
   * RF-Usu-08: Abrir enlace de producto
   */
  openProductLink(url: string) {
    if (url && url.trim()) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      this.showErrorAlert('URL no disponible');
    }
  }

  /**
   * Mostrar opciones del chat
   */
  async showChatOptions(event: Event, chatId: string) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones del chat',
      buttons: [
        {
          text: 'Eliminar chat',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.confirmDeleteChat(chatId);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Confirmar eliminación de chat
   */
  async confirmDeleteChat(chatId: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar chat',
      message: '¿Estás seguro que deseas eliminar este chat?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.chatService.deleteChat(chatId);
            this.updateChatHistory();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Ir al perfil
   */
  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  /**
   * Track function para ngFor de mensajes
   */
  trackMessage(index: number, message: Message): string {
    return message.id;
  }

  /**
   * Verificar si el mensaje tiene URL de producto
   */
  hasProductUrl(message: Message): boolean {
    return !!(message.metadata && message.metadata.productUrl && message.metadata.productUrl.trim().length > 0);
  }

  /**
   * Obtener URL del producto de manera segura
   */
  getProductUrl(message: Message): string {
    return message.metadata?.productUrl || '';
  }

  // Métodos privados

  /**
   * RF-Usu-03: Actualizar historial de chats
   */
  private updateChatHistory() {
    this.chatHistory = this.chatService.getUserChats();
  }

  /**
   * Scroll automático al final de los mensajes
   */
  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  /**
   * Cerrar sidebar en mobile después de una acción
   */
  private closeSidebarOnMobile() {
    if (window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
  }

  /**
   * Mostrar alerta de error
   */
  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}