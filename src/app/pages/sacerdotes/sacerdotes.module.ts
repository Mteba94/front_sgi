import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SacerdotesRoutingModule } from './sacerdotes-routing.module';
import { SacerdotesListComponent } from './components/sacerdotes-list/sacerdotes-list.component';
import { SharedModule } from '@shared/shared.module';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { SacerdotesManageComponent } from './components/sacerdotes-manage/sacerdotes-manage.component';
import { SearchBoxMultipleComponent } from '@shared/components/reusables/search-box-multiple/search-box-multiple.component';
import { MenuComponent } from '@shared/components/reusables/menu/menu.component';
import { SearchBoxSimpleModule } from '@shared/components/search-box-simple/search-box-simple.module';
import { ButtonResetFiltersComponent } from '@shared/components/reusables/button-reset-filters/button-reset-filters.component';


@NgModule({
  declarations: [
    SacerdotesListComponent,
    SacerdotesManageComponent
  ],
  imports: [
    CommonModule,
    SacerdotesRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    SearchBoxSimpleModule,
    ButtonResetFiltersComponent
  ]
})
export class SacerdotesModule { }
