import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { SharedModule } from '@shared/shared.module';
import { ImgSelectorComponent } from '@shared/components/reusables/img-selector/img-selector.component';
import { UsersAllComponent } from './components/users-all/users-all.component';
import { ListTableComponent } from '@shared/components/reusables/list-table/list-table.component';
import { MenuComponent } from '@shared/components/reusables/menu/menu.component';
import { UsersManageComponent } from './components/users-manage/users-manage.component';
import { SearchBoxSimpleModule } from '@shared/components/search-box-simple/search-box-simple.module';
import { UsersRolComponent } from './components/users-rol/users-rol.component';
import { UsersResetComponent } from './components/users-reset/users-reset.component';
import { FilterDateRangeYmdComponent } from '@shared/components/reusables/filter-date-range-ymd/filter-date-range-ymd.component';


@NgModule({
  declarations: [
    UserListComponent,
    UsersAllComponent,
    UsersManageComponent,
    UsersRolComponent,
    UsersResetComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ImgSelectorComponent,
    ListTableComponent,
    MenuComponent,
    SearchBoxSimpleModule,
    FilterDateRangeYmdComponent
  ]
})
export class UserModule {}
