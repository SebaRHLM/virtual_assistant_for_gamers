import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TycPageRoutingModule } from './tyc-routing.module';

import { TycPage } from './tyc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TycPageRoutingModule
  ],
  declarations: [TycPage]
})
export class TycPageModule {}
