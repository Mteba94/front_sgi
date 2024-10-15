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


@NgModule({
  declarations: [
    UserListComponent,
    UsersAllComponent,
    UsersManageComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ImgSelectorComponent,
    ListTableComponent,
    MenuComponent,
    SearchBoxSimpleModule
  ]
})
export class UserModule {}
