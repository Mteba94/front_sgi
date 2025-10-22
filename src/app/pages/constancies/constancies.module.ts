import { CommonModule } from '@angular/common';

import { ConstanciesRoutingModule } from './constancies-routing.module';
import { ConstancieslistComponent } from './components/constancieslist/constancieslist.component';
import { ConstanciesManageComponent } from './components/constancies-manage/constancies-manage.component';
import { SharedModule } from '@shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule } from '@angular/core';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { SearchBoxMultipleComponent } from '@shared/components/reusables/search-box-multiple/search-box-multiple.component';
import { MenuComponent } from '@shared/components/reusables/menu/menu.component';
import { SearchBoxSimpleModule } from '@shared/components/search-box-simple/search-box-simple.module';
import { ContanciesAnularComponent } from './components/contancies-anular/contancies-anular.component';
import { ButtonResetFiltersComponent } from '@shared/components/reusables/button-reset-filters/button-reset-filters.component';


@NgModule({
  declarations: [
    ConstancieslistComponent,
    ConstanciesManageComponent,
    ContanciesAnularComponent
  ],
  imports: [
    CommonModule,
    ConstanciesRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    SearchBoxSimpleModule,
    ButtonResetFiltersComponent
  ]
})
export class ConstanciesModule { }
