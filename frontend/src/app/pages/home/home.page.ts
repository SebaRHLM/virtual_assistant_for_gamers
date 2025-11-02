import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Verificar si el usuario ya está autenticado
    if (this.authService.isAuthenticated()) {
      // Si está autenticado, podríamos redirigir al chat o mostrar diferentes opciones
      console.log('Usuario ya autenticado');
    }
  }

  /**
   * RF-Usu-01: El usuario puede iniciar una conversación con el asistente virtual 
   * haciendo click en el apartado (¡Empieza a preguntar ahora!)
   */
  startChat() {
    if (this.authService.isAuthenticated()) {
      // Si está autenticado, ir directamente al chat
      this.router.navigate(['/chat']);
    } else {
      // Si no está autenticado, ir al login
      this.router.navigate(['/login']);
    }
  }

  /**
   * Navegar a la página de login
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToF4Q() {
    this.router.navigate(['/preguntas-frecuentes']);
  }
}