import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradoSacerdotalListComponent } from './components/grado-sacerdotal-list/grado-sacerdotal-list.component';

const routes: Routes = [
  {
    path: '',
    component: GradoSacerdotalListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
