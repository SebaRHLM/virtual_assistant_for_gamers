import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TycPage } from './tyc.page';

const routes: Routes = [
  {
    path: '',
    component: TycPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TycPageRoutingModule {}
