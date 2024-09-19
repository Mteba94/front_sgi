import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { ChartModule } from 'src/@vex/components/chart/chart.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    DashboardListComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule,
    NgxChartsModule
  ]
})
export class DashboardModule { }
