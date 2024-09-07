import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardRequest } from '../models/dashboar-request.interface';
import { CantidadSacramentosResponse } from '../models/cantsacramento-response.interface';

@Component({
  selector: 'vex-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent implements OnInit {

  dataSource: CantidadSacramentosResponse[] = []

  request: DashboardRequest = {
    numPage: 0,
    order: 'asc',
    sort: '',
    records: 10,
    numFilter: 0,
    textFilter: '',
    stateFilter: 0,
    startDate: '',
    endDate: ''
  }

  constructor(
    private _dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.CantidadSacramentos(this.request)
  }

  chartOptions = {
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: [],
      labels: { }
    },
    series: [],
    legend: {
      show: true,  // Mostrar leyenda
      position: 'top',  // Posición de la leyenda (puede ser 'bottom', 'right', 'left')
      horizontalAlign: 'center',
      onItemClick: {
        toggleDataSeries: true  // Habilitar el filtro al hacer clic en una leyenda
      }
    }
  };

  chartSeries = [];

  CantidadSacramentos(request:  DashboardRequest){
    this._dashboardService.CantidadSacramentos(request).subscribe((resp) => {
      
      this.dataSource = resp.data.items; 

      console.log(this.dataSource.map((e) => e.sacramentos))

      this.chartOptions.xaxis.categories = this.dataSource.map((e) => e.sacramentos);
      
      this.chartSeries = [
        {
          name: "Total",
          data: this.dataSource.map((e) => e.total),
        }
      ];

    })
  }

  

}
