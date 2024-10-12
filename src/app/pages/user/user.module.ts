import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { SharedModule } from '@shared/shared.module';
import { ImgSelectorComponent } from '@shared/components/reusables/img-selector/img-selector.component';


@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ImgSelectorComponent
  ]
})
export class UserModule {}
