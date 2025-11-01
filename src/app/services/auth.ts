import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'zero_ai_current_user';
  private readonly STORAGE_KEY_TOKEN = 'zero_ai_token';
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

// Registrar nuevo usuario  
register(userData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, userData).pipe(
    tap((response: any) => {
      // Si viene el success = true y data (distinto de nada) desde el backend, guardar el usuario
      if (response && response.success && response.data) {
        const backendUser = response.data;

        // Mapeo de campos del backend al modelo del frontend
        const user: User = {
          id: backendUser.id_usuario,
          username: backendUser.username,
          rut: backendUser.rut || '',
          region: backendUser.region || '',
          comuna: backendUser.comuna || '',
          email: backendUser.email,
          role: backendUser.rol
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.log(' Usuario registrado y guardado:', user);
      } else {
        console.warn('Respuesta de registro no válida:', response);
      }
    })
  );
}

// Iniciar sesión
login(credentials: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    tap((response: any) => {
      if (response?.data) {
        const backendUser = response.data;

        const user: User = {
          id: backendUser.id_usuario,
          username: backendUser.username,
          rut: backendUser.rut || '',
          region: backendUser.region || '',
          comuna: backendUser.comuna || '',
          email: backendUser.email,
          password: '',
          role: backendUser.rol || 'user',
          createdAt: new Date(),
          isActive: true
        };

        if (response.token) {
            localStorage.setItem(this.STORAGE_KEY_TOKEN, response.token);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.log(' Usuario logueado y guardado:', user);
    } else {
      console.warn(' Respuesta de login no válida:', response);
    }
  }));
}


  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadCurrentUser(): void {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    if (userData) {
      const user: User = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }
}
