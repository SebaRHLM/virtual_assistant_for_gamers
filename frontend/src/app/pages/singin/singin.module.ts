import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinginPageRoutingModule } from './singin-routing.module';

import { SinginPage } from './singin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SinginPageRoutingModule
  ],
  declarations: [SinginPage]
})
export class SinginPageModule {}
