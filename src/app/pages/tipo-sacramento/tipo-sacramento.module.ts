import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoSacramentoRoutingModule } from './tipo-sacramento-routing.module';
import { TipoSacramentoListComponent } from './tipo-sacramento-list/tipo-sacramento-list.component';
import { SharedModule } from '@shared/shared.module';
import { TipoSacramentoManageComponent } from './tipo-sacramento-manage/tipo-sacramento-manage.component';
import { ListTableComponent } from 'src/app/core/components/list-table/list-table.component';


@NgModule({
  declarations: [
    TipoSacramentoListComponent,
    TipoSacramentoManageComponent
  ],
  imports: [
    CommonModule,
    TipoSacramentoRoutingModule,
    SharedModule,
    ListTableComponent
  ]
})
export class TipoSacramentoModule { }
