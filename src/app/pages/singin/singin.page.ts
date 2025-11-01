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
    arica: [
      { name: 'Arica', value: 'arica' },
      { name: 'Camarones', value: 'camarones' },
      { name: 'Putre', value: 'putre' },
      { name: 'General Lagos', value: 'general_lagos' }
    ],
    tarapaca: [
      { name: 'Alto Hospicio', value: 'alto_hospicio' },
      { name: 'Camiña', value: 'camiña' },
      { name: 'Colchane', value: 'colchane' },
      { name: 'Huara', value: 'huara' },
      { name: 'Iquique', value: 'iquique' },
      { name: 'Pica', value: 'pica' },
      { name: 'Pozo Almonte', value: 'pozo_almonte' }
    ],
    antofagasta: [
      { name: 'Antofagasta', value: 'antofagasta' },
      { name: 'Mejillones', value: 'mejillones' },
      { name: 'Sierra Gorda', value: 'sierra_gorda' },
      { name: 'Taltal', value: 'taltal' },
      { name: 'Calama', value: 'calama' },
      { name: 'María Elena', value: 'maria_elena' },
      { name: 'San Pedro de Atacama', value: 'san_pedro_de_atacama' },
      { name: 'Tocopilla', value: 'tocopilla' },
      { name: 'Ollagüe', value: 'ollague' }
    ],
    atacama: [
      { name: 'Alto del Carmen', value: 'alto_del_carmen' },
      { name: 'Caldera', value: 'caldera' },
      { name: 'Chañaral', value: 'chanaral' },
      { name: 'Copiapó', value: 'copiapo' },    
      { name: 'Diego de Almagro', value: 'diego_de_almagro' },
      { name: 'Freirina', value: 'freirina' },
      { name: 'Huasco', value: 'huasco' },
      { name: 'Tierra Amarilla', value: 'tierra_amarilla' },
      { name: 'Vallenar', value: 'vallenar' }
    ],
    coquimbo: [
      { name: 'Andacollo', value: 'andacollo' },
      { name: 'Canela', value: 'canela' },
      { name: 'Combarbalá', value: 'combarbala' }, 
      { name: 'Coquimbo', value: 'coquimbo' },
      { name: 'Illapel', value: 'illapel' },
      { name: 'La Higuera', value: 'la_higuera' },
      { name: 'La Serena', value: 'la_serena' },
      { name: 'Los Vilos', value: 'los_vilos' },
      { name: 'Monte Patria', value: 'monte_patria' },
      { name: 'Ovalle', value: 'ovalle' },
      { name: 'Paihuano', value: 'paihuano' },
      { name: 'Punitaqui', value: 'punitaqui' },
      { name: 'Río Hurtado', value: 'rio_hurtado' }, 
      { name: 'Salamanca', value: 'salamanca' },
      { name: 'Vicuña', value: 'vicuna' }
    ],
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
    ohiggins: [
      { name: 'Rancagua', value: 'rancagua' },
      { name: 'San Fernando', value: 'san_fernando' },
      { name: 'Rengo', value: 'rengo' },
      { name: 'Machalí', value: 'machali' },
      { name: 'Pichilemu', value: 'pichilemu' }
    ],
    maule: [
      { name: 'Talca', value: 'talca' },
      { name: 'Curicó', value: 'curico' },         
      { name: 'Linares', value: 'linares' },
      { name: 'Constitución', value: 'constitucion' }, 
      { name: 'Parral', value: 'parral' },
      { name: 'Cauquenes', value: 'cauquenes' },
      { name: 'Molina', value: 'molina' },
      { name: 'San Javier', value: 'san_javier' }
    ],
    nuble: [
      { name: 'Chillán', value: 'chillan' },                
      { name: 'Chillán Viejo', value: 'chillan_viejo' },     
      { name: 'San Carlos', value: 'san_carlos' },
      { name: 'Bulnes', value: 'bulnes' },
      { name: 'Quirihue', value: 'quirihue' },
      { name: 'Coihueco', value: 'coihueco' },
      { name: 'Yungay', value: 'yungay' },
      { name: 'San Nicolás', value: 'san_nicolas' },          
      { name: 'El Carmen', value: 'el_carmen' },
      { name: 'Ninhue', value: 'ninhue' }
    ],
    biobio: [
      { name: 'Concepción', value: 'concepcion' },         
      { name: 'Talcahuano', value: 'talcahuano' },
      { name: 'San Pedro de la Paz', value: 'san_pedro_de_la_paz' },
      { name: 'Hualpén', value: 'hualpen' },                 
      { name: 'Coronel', value: 'coronel' },
      { name: 'Lota', value: 'lota' },
      { name: 'Chiguayante', value: 'chiguayante' },
      { name: 'Los Ángeles', value: 'los_angeles' },         
      { name: 'Cañete', value: 'canete' },                  
      { name: 'Lebu', value: 'lebu' }
    ],
    araucania: [
      { name: 'Temuco', value: 'temuco' },
      { name: 'Padre Las Casas', value: 'padre_las_casas' },
      { name: 'Villarrica', value: 'villarrica' },
      { name: 'Angol', value: 'angol' },
      { name: 'Lautaro', value: 'lautaro' },
      { name: 'Nueva Imperial', value: 'nueva_imperial' },
      { name: 'Pucón', value: 'pucon' },          
      { name: 'Collipulli', value: 'collipulli' },
      { name: 'Curacautín', value: 'curacautin' },  
      { name: 'Victoria', value: 'victoria' }
    ],
    rios: [
      { name: 'Valdivia', value: 'valdivia' },
      { name: 'La Unión', value: 'la_union' },
      { name: 'Panguipulli', value: 'panguipulli' },
      { name: 'Río Bueno', value: 'rio_bueno' },     
      { name: 'Lanco', value: 'lanco' },
      { name: 'Paillaco', value: 'paillaco' },
      { name: 'Futrono', value: 'futrono' },
      { name: 'Lago Ranco', value: 'lago_ranco' },
      { name: 'Máfil', value: 'mafil' },            
      { name: 'Corral', value: 'corral' }
    ],
    lagos: [
      { name: 'Puerto Montt', value: 'puerto_montt' },
      { name: 'Osorno', value: 'osorno' },
      { name: 'Castro', value: 'castro' },
      { name: 'Ancud', value: 'ancud' },
      { name: 'Puerto Varas', value: 'puerto_varas' },
      { name: 'Quellón', value: 'quellon' },   
      { name: 'Purranque', value: 'purranque' },
      { name: 'Calbuco', value: 'calbuco' },
      { name: 'Llanquihue', value: 'llanquihue' },
      { name: 'Frutillar', value: 'frutillar' }
    ],
    aysen: [
      { name: 'Coyhaique', value: 'coyhaique' },
      { name: 'Puerto Aysén', value: 'puerto_aysen' },
      { name: 'Chile Chico', value: 'chile_chico' },
      { name: 'Cochrane', value: 'cochrane' },
      { name: 'Puerto Cisnes', value: 'puerto_cisnes' },
      { name: 'Lago Verde', value: 'lago_verde' },
      { name: 'Río Ibáñez', value: 'rio_ibanez' },        
      { name: 'Guaitecas', value: 'guaitecas' },
      { name: 'O’Higgins', value: 'ohiggins' },           
      { name: 'Tortel', value: 'tortel' }
    ],
    magallanes: [
      { name: 'Punta Arenas', value: 'punta_arenas' },
      { name: 'Puerto Natales', value: 'puerto_natales' },
      { name: 'Porvenir', value: 'porvenir' },
      { name: 'Puerto Williams', value: 'puerto_williams' },
      { name: 'San Gregorio', value: 'san_gregorio' },
      { name: 'Primavera', value: 'primavera' },
      { name: 'Timaukel', value: 'timaukel' },
      { name: 'Torres del Paine', value: 'torres_del_paine' }
    ]
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
    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: async (response) => {
        console.log('✅ Respuesta del servidor:', response);
        await this.showSuccessAlert();
        this.router.navigate(['/chat'], { replaceUrl: true });
      },
      error: async (err) => {
        console.error('❌ Error al registrar:', err);
        await this.showErrorAlert('Error al registrar usuario.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  } else {
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
  /** 
  * Ir a Terminos y condicioes
  */
  goTotyc(){
    this.router.navigate(['/tyc']);
  }
}