import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AlertController } from '@ionic/angular';
import { User } from '../../models/user';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone : false
})
export class PerfilPage implements OnInit {

  currentUser: User | null = null;
  darkMode = true; // Por defecto en modo oscuro

  constructor(
    private router: Router,
    private authService: AuthService,
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
    
    // Cargar preferencia de tema
    this.loadThemePreference();
  }

  /**
   * Ir al chat
   */
  goToChat() {
    this.router.navigate(['/chat']);
  }

  /**
   * Toggle entre modo oscuro y claro
   */
  toggleDarkMode(event: any) {
    this.darkMode = event.detail.checked;
    
    // Guardar preferencia
    localStorage.setItem('zero_ai_dark_mode', this.darkMode.toString());
    
    // Aplicar tema
    this.applyTheme();
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/home'], { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Cargar preferencia de tema
   */
  private loadThemePreference() {
    const savedTheme = localStorage.getItem('zero_ai_dark_mode');
    if (savedTheme !== null) {
      this.darkMode = savedTheme === 'true';
    }
    
    this.applyTheme();
  }

  /**
   * Aplicar tema a la página
   */
  private applyTheme() {
    const content = document.querySelector('.profile-content');
    if (content) {
      if (this.darkMode) {
        content.classList.remove('light-mode');
      } else {
        content.classList.add('light-mode');
      }
    }
  }
  goToF4Q() {
    this.router.navigate(['/preguntas-frecuentes']);
  }
}