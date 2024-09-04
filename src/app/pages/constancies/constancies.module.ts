import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstanciesRoutingModule } from './constancies-routing.module';
import { ConstancieslistComponent } from './components/constancieslist/constancieslist.component';
import { ConstanciesManageComponent } from './components/constancies-manage/constancies-manage.component';
import { SharedModule } from '@shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ConstancieslistComponent,
    ConstanciesManageComponent
  ],
  imports: [
    CommonModule,
    ConstanciesRoutingModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class ConstanciesModule { }
