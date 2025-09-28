export interface MessageMetadata {
productUrl?: string;
    componentType?: string;
    analysisType?: 'compatibility' | 'comparison' | 'info';
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'assistant';
  type: 'text' | 'image' | 'link';
  metadata?: MessageMetadata;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ChatSummary {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export interface ComponentInfo {
  name: string;
  type: 'gpu' | 'cpu' | 'motherboard' | 'ram' | 'psu' | 'monitor' | 'storage';
  brand: string;
  model: string;
  specs: Record<string, any>;
  price?: number;
  url?: string;
}

export interface CompatibilityResult {
  compatible: boolean;
  confidence: number;
  reasons: string[];
  recommendations?: string[];
}

// Interfaces adicionales para funcionalidades extendidas

export interface UserQuery {
  id: string;
  userId: string;
  chatId: string;
  query: string;
  queryType: 'compatibility' | 'comparison' | 'info' | 'general';
  components: string[];
  timestamp: Date;
  response?: AssistantResponse;
}

export interface AssistantResponse {
  id: string;
  queryId: string;
  content: string;
  responseType: 'compatibility' | 'comparison' | 'info' | 'error';
  confidence: number;
  sources?: string[];
  recommendations?: string[];
  relatedProducts?: ProductLink[];
  timestamp: Date;
}

export interface ProductLink {
  name: string;
  url: string;
  price?: number;
  store: string;
  availability: 'available' | 'out_of_stock' | 'pre_order';
}

export interface ChatAnalytics {
  chatId: string;
  userId: string;
  totalMessages: number;
  compatibilityQueries: number;
  comparisonQueries: number;
  infoQueries: number;
  averageResponseTime: number;
  userSatisfaction?: number;
  createdAt: Date;
  lastActivity: Date;
}

// Enums para mayor tipo de seguridad

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  LINK = 'link'
}

export enum ComponentType {
  GPU = 'gpu',
  CPU = 'cpu',
  MOTHERBOARD = 'motherboard',
  RAM = 'ram',
  PSU = 'psu',
  MONITOR = 'monitor',
  STORAGE = 'storage'
}

export enum QueryType {
  COMPATIBILITY = 'compatibility',
  COMPARISON = 'comparison',
  INFO = 'info',
  GENERAL = 'general'
}

export enum ResponseType {
  COMPATIBILITY = 'compatibility',
  COMPARISON = 'comparison',
  INFO = 'info',
  ERROR = 'error'
}

// Interfaces para configuración del chat

export interface ChatSettings {
  userId: string;
  autoSave: boolean;
  maxChatHistory: number;
  responseLanguage: 'es' | 'en';
  preferredCurrency: 'CLP' | 'USD';
  showProductPrices: boolean;
  enableNotifications: boolean;
}

export interface ChatTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  messageUserBg: string;
  messageAssistantBg: string;
  sidebarBg: string;
  isDark: boolean;
}