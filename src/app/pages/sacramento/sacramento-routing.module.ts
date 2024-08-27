import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SacramentolistComponent } from './components/sacramentolist/sacramentolist.component';

const routes: Routes = [
  {
    path: '',
    component: SacramentolistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SacramentoRoutingModule { }
