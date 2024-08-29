import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SacramentoRoutingModule } from './sacramento-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { SearchBoxMultipleComponent } from '@shared/components/reusables/search-box-multiple/search-box-multiple.component';
import { MenuComponent } from '@shared/components/reusables/menu/menu.component';
import { SacramentolistComponent } from './components/sacramentolist/sacramentolist.component';
import { SacramentoManageComponent } from './components/sacramento-manage/sacramento-manage.component';
import { SearchBoxSimpleModule } from "../../shared/components/search-box-simple/search-box-simple.module";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    SacramentolistComponent,
    SacramentoManageComponent,
  ],
  imports: [
    CommonModule,
    SacramentoRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    SearchBoxSimpleModule,
    MatDatepickerModule,
    MatNativeDateModule,
],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ]
})
export class SacramentoModule { }
