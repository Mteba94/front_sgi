import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersAllComponent } from './components/users-all/users-all.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'list',
    component: UsersAllComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
