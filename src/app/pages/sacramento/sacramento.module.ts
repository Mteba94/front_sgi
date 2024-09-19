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
import { FilterDateRangeYmdComponent } from '@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';
import { FilterDateSingleYmdComponent } from '@shared/components/reusables/filter-date-single-ymd/filter-date-single-ymd.component';


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
    //FilterDateRangeYmdComponent,
    //FilterDateSingleYmdComponent
  ],
})
export class SacramentoModule { }
