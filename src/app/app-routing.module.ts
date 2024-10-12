import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from '@shared/guards/auth.guard';

const childrenRoutes: VexRoutes = [
  {
    path: 'estadisticas',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: {
      containerEnabled: true
    }
  },
  {
    path: 'tipoSacramento',
    loadChildren: () => import('./pages/tipo-sacramento/tipo-sacramento.module').then(m => m.TipoSacramentoModule),
    data: {
      containerEnabled: true
    }
  },
  {
    path: 'sacramento',
    loadChildren: () => import("./pages/sacramento/sacramento.module").then((m) => m.SacramentoModule),
  },
  {
    path: 'constancias',
    loadChildren: () => import("./pages/constancies/constancies.module").then((m) => m.ConstanciesModule),
  },
  {
    path: 'user',
    loadChildren: () => import("./pages/user/user.module").then((m) => m.UserModule),
    data: {
      containerEnabled: true
    }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

const routes: VexRoutes = [
  {
    path: '',
    redirectTo: 'estadisticas',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    data: {
      containerEnabled: true
    }
  },
  {
    path: '',
    component: CustomLayoutComponent,
    children: childrenRoutes,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}