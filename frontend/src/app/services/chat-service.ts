import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Chat, Message } from '../models/chat';
import { AuthService } from './auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chats: Chat[] = [];
  private currentChat: Chat | null = null;

  // Observables para reaccionar desde el componente
  public chats$ = new BehaviorSubject<Chat[]>([]);
  public currentChat$ = new BehaviorSubject<Chat | null>(null);

  private apiUrl = `${environment.apiUrl}/ai/chat`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ===============================
  //  📘 Gestión de chats locales
  // ===============================

  getUserChats(): Chat[] {
    return this.chats;
  }

  createNewChat(): Chat {
    const user = this.authService.getCurrentUser();
    const newChat: Chat = {
      id: crypto.randomUUID(),
      userId: user?.id || 'unknown',
      title: `Chat ${this.chats.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    this.chats.unshift(newChat);
    this.currentChat = newChat;
    this.emitUpdates();
    return newChat;
  }

  selectChat(chatId: string) {
    this.currentChat = this.chats.find(c => c.id === chatId) || null;
    this.emitUpdates();
  }

  deleteChat(chatId: string) {
    this.chats = this.chats.filter(c => c.id !== chatId);
    if (this.currentChat?.id === chatId) {
      this.currentChat = this.chats[0] || null;
    }
    this.emitUpdates();
  }

  // =====================================
  // 💬 Enviar mensaje al modelo de IA
  // =====================================
  async sendMessage(content: string) {
    if (!this.currentChat) {
      this.createNewChat();
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      sender: 'user',
      type: 'text'
    };

    this.currentChat!.messages.push(userMessage);
    this.currentChat!.updatedAt = new Date();
    this.emitUpdates();

    try {
      const token = this.authService.getToken();

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const body = { contenido: content };

      const response: any = await this.http.post(this.apiUrl, body, { headers }).toPromise();

      if (response?.data?.aiMessage) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          content: response.data.aiMessage.contenido || 'Sin respuesta del modelo.',
          timestamp: new Date(),
          sender: 'assistant',
          type: 'text'
        };

        this.currentChat!.messages.push(aiMessage);
        this.currentChat!.updatedAt = new Date();
        this.emitUpdates();
      } else {
        console.warn('⚠️ Respuesta inesperada del servidor IA:', response);
      }

    } catch (error) {
      console.error('❌ Error enviando mensaje al backend:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: '⚠️ No se pudo conectar con el asistente en este momento.',
        timestamp: new Date(),
        sender: 'assistant',
        type: 'text'
      };
      this.currentChat!.messages.push(errorMessage);
      this.emitUpdates();
    }
  }

  // =====================================
  // 🔄 Emitir cambios a los observadores
  // =====================================
  private emitUpdates() {
    this.chats$.next([...this.chats]);
    this.currentChat$.next(this.currentChat ? { ...this.currentChat } : null);
  }
}