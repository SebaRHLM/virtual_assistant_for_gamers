import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tyc',
  templateUrl: './tyc.page.html',
  styleUrls: ['./tyc.page.scss'],
  standalone:false,
})
export class TycPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  /**
   * Volver a la página anterior
   */
  goBack() {
    this.router.navigate(['/login']);
  }
  acceptTerms() {
    this.router.navigate(['/singin']); 
  }
}
