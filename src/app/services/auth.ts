import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'zero_ai_users';
  private readonly CURRENT_USER_KEY = 'zero_ai_current_user';

  constructor() {
    // Verificar si hay un usuario activo al inicializar
    this.loadCurrentUser();
  }

  /**
   * RF-ADM-01: Gestionar usuarios (simulado con localStorage)
   * Registrar nuevo usuario
   */
  async register(userData: any): Promise<boolean> {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obtener usuarios existentes
      const users = this.getStoredUsers();
      
      // Verificar si el email ya existe
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: this.generateUserId(),
        username: userData.username,
        rut: userData.rut,
        region: userData.region,
        comuna: userData.comuna,
        email: userData.email,
        password: userData.password, // En producción esto debería estar hasheado
        role: 'user',
        createdAt: new Date(),
        isActive: true
      };

      // Agregar usuario a la lista
      users.push(newUser);
      this.saveUsers(users);

      // Auto-login después del registro
      this.setCurrentUser(newUser);

      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  }

  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      // Buscar usuario en storage
      const users = this.getStoredUsers();
      const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.isActive
      );

      if (user) {
        this.setCurrentUser(user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario es administrador
   * RF-ADM-01, RF-ADM-02: Control de administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  /**
   * RF-ADM-01: Obtener todos los usuarios (solo para admin)
   */
  getAllUsers(): User[] {
    if (!this.isAdmin()) {
      return [];
    }
    return this.getStoredUsers();
  }

  /**
   * RF-ADM-01: Desactivar/activar usuario (solo para admin)
   */
  toggleUserStatus(userId: string): boolean {
    if (!this.isAdmin()) {
      return false;
    }

    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].isActive = !users[userIndex].isActive;
      this.saveUsers(users);
      return true;
    }
    
    return false;
  }

  // Métodos privados para manejo de datos

  /**
   * Cargar usuario actual desde localStorage
   */
  private loadCurrentUser(): void {
    try {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (userData) {
        const user: User = JSON.parse(userData);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  /**
   * Establecer usuario actual
   */
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Obtener usuarios almacenados
   */
  private getStoredUsers(): User[] {
    try {
      const usersData = localStorage.getItem(this.STORAGE_KEY);
      if (usersData) {
        return JSON.parse(usersData);
      }
      
      // Si no hay usuarios, crear usuario admin por defecto
      const defaultUsers: User[] = [
        {
          id: 'admin-001',
          username: 'Admin',
          rut: '12345678-9',
          region: 'metropolitana',
          comuna: 'santiago',
          email: 'admin@zero.ai',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date(),
          isActive: true
        }
      ];
      
      this.saveUsers(defaultUsers);
      return defaultUsers;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  /**
   * Guardar usuarios en localStorage
   */
  private saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error guardando usuarios:', error);
    }
  }

  /**
   * Generar ID único para usuario
   */
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}