import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstancieslistComponent } from './components/constancieslist/constancieslist.component';

const routes: Routes = [
  {
    path: '',
    component: ConstancieslistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstanciesRoutingModule { }
