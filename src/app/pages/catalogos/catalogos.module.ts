import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { GradoSacerdotalListComponent } from './components/grado-sacerdotal-list/grado-sacerdotal-list.component';
import { GradoSacerdotalManageComponent } from './components/grado-sacerdotal-manage/grado-sacerdotal-manage.component';
import { SharedModule } from '@shared/shared.module';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { SearchBoxMultipleComponent } from '@shared/components/reusables/search-box-multiple/search-box-multiple.component';
import { FilterDateRangeYmdComponent } from '@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';
import { MenuComponent } from '@shared/components/reusables/menu/menu.component';
import { ButtonResetFiltersComponent } from '@shared/components/reusables/button-reset-filters/button-reset-filters.component';


@NgModule({
  declarations: [
    GradoSacerdotalListComponent,
    GradoSacerdotalManageComponent
  ],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent
  ]
})
export class CatalogosModule { }
