import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoSacramentoListComponent } from './components/tipo-sacramento-list/tipo-sacramento-list.component';

const routes: Routes = [
  {
    path: '',
    component: TipoSacramentoListComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoSacramentoRoutingModule { }
