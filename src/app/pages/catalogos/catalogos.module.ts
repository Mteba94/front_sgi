import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { GradoSacerdotalListComponent } from './components/grado-sacerdotal-list/grado-sacerdotal-list.component';
import { GradoSacerdotalManageComponent } from './components/grado-sacerdotal-manage/grado-sacerdotal-manage.component';


@NgModule({
  declarations: [
    GradoSacerdotalListComponent,
    GradoSacerdotalManageComponent
  ],
  imports: [
    CommonModule,
    CatalogosRoutingModule
  ]
})
export class CatalogosModule { }
