import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoSacramentoRoutingModule } from './tipo-sacramento-routing.module';
import { TipoSacramentoListComponent } from './components/tipo-sacramento-list/tipo-sacramento-list.component';
import { SharedModule } from '@shared/shared.module';
import { TipoSacramentoManageComponent } from './components/tipo-sacramento-manage/tipo-sacramento-manage.component';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { SearchBoxMultipleComponent } from '@shared/components/reusables/search-box-multiple/search-box-multiple.component';
import { MenuComponent } from "../../shared/components/reusables/menu/menu.component";
import { FilterDateRangeYmdComponent } from '@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';
import { ButtonResetFiltersComponent } from '@shared/components/reusables/button-reset-filters/button-reset-filters.component';


@NgModule({
  declarations: [
    TipoSacramentoListComponent,
    TipoSacramentoManageComponent
  ],
  imports: [
    CommonModule,
    TipoSacramentoRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent
]
})
export class TipoSacramentoModule { }
