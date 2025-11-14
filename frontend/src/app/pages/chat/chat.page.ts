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
  standalone: false
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

    // Suscribirse a los chats
    const chatsSub = this.chatService.chats$.subscribe(chats => {
      this.updateChatHistory(chats);
    });

    // Suscribirse al chat actual
    const currentSub = this.chatService.currentChat$.subscribe(chat => {
      this.currentChat = chat;
      this.currentChatId = chat?.id || null;
      setTimeout(() => this.scrollToBottom(), 150);
    });

    this.subscriptions.push(chatsSub, currentSub);

    // Mostrar el sidebar abierto por defecto en pantallas grandes
    if (window.innerWidth >= 768) {
      this.sidebarOpen = true;
    }

    // Cargar historial inicial
    this.updateChatHistory(this.chatService.getUserChats());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // ==========================
  // Sidebar
  // ==========================

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  private closeSidebarOnMobile() {
    if (window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
  }

  // ==========================
  // Chats
  // ==========================

  createNewChat() {
    try {
      const newChat = this.chatService.createNewChat();
      this.updateChatHistory(this.chatService.getUserChats());
      this.currentChat = newChat;
      this.closeSidebarOnMobile();
    } catch (error) {
      console.error('Error creando nuevo chat:', error);
      this.showErrorAlert('Error al crear un nuevo chat.');
    }
  }

  selectChat(chatId: string) {
    this.chatService.selectChat(chatId);
    this.closeSidebarOnMobile();
  }

  deleteChat(chatId: string) {
    this.chatService.deleteChat(chatId);
    this.updateChatHistory(this.chatService.getUserChats());
  }

  // ==========================
  // Mensajes
  // ==========================

  async sendMessage() {
    if (!this.messageText.trim() || this.isTyping) return;

    if (!this.currentChat) {
      this.createNewChat();
      await new Promise(r => setTimeout(r, 100));
    }

    const message = this.messageText.trim();
    this.messageText = '';
    this.isTyping = true;

    try {
      await this.chatService.sendMessage(message);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      this.showErrorAlert('No se pudo enviar el mensaje.');
    } finally {
      this.isTyping = false;
      setTimeout(() => this.scrollToBottom(), 200);
    }
  }

  onEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatAssistantMessage(content: string): string {
    if (content.includes('✅') || content.includes('Sí son compatibles')) {
      content = content.replace(/✅.*?(?=\n|$)/g, '<span class="compatibility-result compatible">$&</span>');
    }

    if (content.includes('❌') || content.includes('No son compatibles')) {
      content = content.replace(/❌.*?(?=\n|$)/g, '<span class="compatibility-result incompatible">$&</span>');
    }

    content = content.replace(/\n/g, '<br>');
    content = content.replace(/^([^<\n]+:)(?=<br>|$)/gm, '<h4>$1</h4>');
    content = content.replace(/• ([^<\n]+)/g, '<li>$1</li>');
    content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    return content;
  }

  openProductLink(url: string) {
    if (url && url.trim()) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      this.showErrorAlert('URL no disponible');
    }
  }

  // ==========================
  // Perfil y opciones
  // ==========================

  async showChatOptions(event: Event, chatId: string) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones del chat',
      buttons: [
        {
          text: 'Eliminar chat',
          role: 'destructive',
          icon: 'trash',
          handler: () => this.confirmDeleteChat(chatId)
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });

    await actionSheet.present();
  }

  async confirmDeleteChat(chatId: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar chat',
      message: '¿Estás seguro que deseas eliminar este chat?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteChat(chatId)
        }
      ]
    });
    await alert.present();
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  // ==========================
  // Utilidades
  // ==========================

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  private updateChatHistory(chats: Chat[]) {
    this.chatHistory = chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      lastMessage: chat.messages[chat.messages.length - 1]?.content || 'Sin mensajes',
      timestamp: chat.updatedAt || chat.createdAt || new Date(),
      messageCount: chat.messages.length
    }));
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  trackMessage(index: number, msg: Message) {
    return msg.id;
  }

  hasProductUrl(message: Message): boolean {
    return !!(message.metadata && message.metadata.productUrl);
  }

  getProductUrl(message: Message): string {
    return message.metadata?.productUrl || '';
  }

}
