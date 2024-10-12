import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { ChartModule } from 'src/@vex/components/chart/chart.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SacAnioActComponent } from './components/sac-anio-act/sac-anio-act.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    DashboardListComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule,
    NgxChartsModule,
    SacAnioActComponent,
    SharedModule
  ]
})
export class DashboardModule { }
