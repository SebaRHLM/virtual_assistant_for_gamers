import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit() {
    // Verificar si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/chat'], { replaceUrl: true });
    }
  }

  /**
   * Crear formulario reactivo
   */
  private createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Toggle mostrar/ocultar contraseña
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Volver a la página anterior (home)
   */
  goBack() {
    this.router.navigate(['/home']);
  }

  /**
   * Ir a la página de registro
   */
  goToRegister() {
    this.router.navigate(['/singin']);
  }

  /**
   * Procesar inicio de sesión
   */
  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      try {
        const credentials = this.loginForm.value;
        
        // Intentar login usando el servicio de autenticación
        const success = await this.authService.login(credentials.email, credentials.password);
        
        if (success) {
          // Redirigir al chat después del login exitoso
          this.router.navigate(['/chat'], { replaceUrl: true });
        } else {
          await this.showErrorAlert(
            'Credenciales incorrectas', 
            'El email o la contraseña no son correctos. Si no tienes cuenta, regístrate primero.'
          );
        }
      } catch (error) {
        console.error('Error en login:', error);
        await this.showErrorAlert(
          'Error de conexión',
          'Ocurrió un error inesperado. Inténtelo nuevamente.'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marcar campos como touched para mostrar errores
      this.markFormGroupTouched(this.loginForm);
      await this.showErrorAlert(
        'Datos incompletos',
        'Por favor, complete todos los campos correctamente.'
      );
    }
  }

  /**
   * Marcar todos los campos como touched
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  /**
   * Mostrar alerta de error
   */
  private async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
      cssClass: 'error-alert'
    });
    await alert.present();
  }
}