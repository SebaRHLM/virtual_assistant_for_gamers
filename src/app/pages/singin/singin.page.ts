import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.page.html',
  styleUrls: ['./singin.page.scss'],
  standalone: false
})
export class SinginPage implements OnInit {

  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  // Datos de comunas por región (simplificado para el ejemplo)
  comunasByRegion: { [key: string]: Array<{name: string, value: string}> } = {
    valparaiso: [
      { name: 'Viña del Mar', value: 'vina' },
      { name: 'Valparaíso', value: 'valparaiso' },
      { name: 'Quilpué', value: 'quilpue' },
      { name: 'Villa Alemana', value: 'villa_alemana' },
      { name: 'Casablanca', value: 'casablanca' }
    ],
    metropolitana: [
      { name: 'Santiago', value: 'santiago' },
      { name: 'Las Condes', value: 'las_condes' },
      { name: 'Providencia', value: 'providencia' },
      { name: 'Ñuñoa', value: 'nunoa' },
      { name: 'Maipú', value: 'maipu' }
    ],
    // Agregar más regiones según necesidad
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit() {
    // Escuchar cambios en la región para resetear comuna
    this.registerForm.get('region')?.valueChanges.subscribe(() => {
      this.registerForm.get('comuna')?.reset();
    });
  }

  /**
   * Crear formulario reactivo con validaciones
   */
  private createForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      rut: ['', [Validators.required, this.rutValidator]],
      region: ['', Validators.required],
      comuna: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado para RUT chileno (simplificado)
   */
  private rutValidator(control: AbstractControl): {[key: string]: any} | null {
    if (!control.value) return null;
    
    const rut = control.value.replace(/\./g, '').replace('-', '');
    if (rut.length < 8 || rut.length > 9) {
      return { 'invalidRut': true };
    }
    
    return null;
  }

  /**
   * Validador para contraseña (debe contener números y letras)
   */
  private passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    if (!control.value) return null;
    
    const hasNumber = /[0-9]/.test(control.value);
    const hasLetter = /[a-zA-Z]/.test(control.value);
    
    if (!hasNumber || !hasLetter) {
      return { 'pattern': true };
    }
    
    return null;
  }

  /**
   * Validador para confirmar que las contraseñas coinciden
   */
  private passwordMatchValidator(form: AbstractControl): {[key: string]: any} | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }
    
    // Limpiar errores si las contraseñas coinciden
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      const hasErrors = Object.keys(errors).length > 0;
      confirmPassword.setErrors(hasErrors ? errors : null);
    }
    
    return null;
  }

  /**
   * Obtener comunas disponibles según la región seleccionada
   */
  getAvailableComunas(): Array<{name: string, value: string}> {
    const selectedRegion = this.registerForm.get('region')?.value;
    return this.comunasByRegion[selectedRegion] || [];
  }

  /**
   * Toggle mostrar/ocultar contraseña
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggle mostrar/ocultar confirmación de contraseña
   */
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Volver a la página anterior
   */
  goBack() {
    this.router.navigate(['/login']);
  }

  /**
   * Procesar registro de usuario
   */
  async onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      try {
        const formData = this.registerForm.value;
        
        // Registrar usuario usando el servicio de autenticación
        const success = await this.authService.register(formData);
        
        if (success) {
          await this.showSuccessAlert();
          // Redirigir al chat después del registro exitoso
          this.router.navigate(['/chat'], { replaceUrl: true });
        } else {
          await this.showErrorAlert('Error al crear la cuenta. Inténtelo nuevamente.');
        }
      } catch (error) {
        console.error('Error en registro:', error);
        await this.showErrorAlert('Ocurrió un error inesperado. Inténtelo nuevamente.');
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched(this.registerForm);
      await this.showErrorAlert('Por favor, complete todos los campos correctamente.');
    }
  }

  /**
   * Marcar todos los campos del formulario como touched
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Mostrar alerta de éxito
   */
  private async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: '¡Cuenta creada!',
      message: 'Tu cuenta ha sido creada exitosamente. ¡Bienvenido a ZERO.AI!',
      buttons: ['OK'],
      cssClass: 'success-alert'
    });
    await alert.present();
  }

  /**
   * Mostrar alerta de error
   */
  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
      cssClass: 'error-alert'
    });
    await alert.present();
  }
}