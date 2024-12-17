import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SacerdotesListComponent } from './components/sacerdotes-list/sacerdotes-list.component';

const routes: Routes = [
  {
    path: '',
    component: SacerdotesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SacerdotesRoutingModule { }
