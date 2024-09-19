import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardRequest } from '../models/dashboar-request.interface';
import { CantidadSacramentosResponse } from '../models/cantsacramento-response.interface';

@Component({
  selector: 'vex-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent implements OnInit {

  multi: any[] = [ ];
  
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Año';
  yAxisLabel: string = '';
  timeline: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

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
  ) {
    Object.assign(this, { multi: this.multi });
   }

  ngOnInit(): void {
    this.CantidadSacramentos(this.request)
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  yAxisTickFormatting(value: number): string {
    return Math.floor(value).toString(); // Elimina los decimales del eje Y
  }
  
  xAxisTickFormatting(value: number): string {
    return Math.floor(value).toString(); // Elimina los decimales del eje X si es necesario
  }


  CantidadSacramentos(request:  DashboardRequest){
    this._dashboardService.CantidadSacramentos(request).subscribe((resp) => {
      
      this.dataSource = resp.data.items;

      const groupedData = this.dataSource.reduce((acc, curr) => {

        const found = acc.find(item => item.name === curr.sacramentos);
        
        if (found) {
          // Si ya existe, agrega el nuevo año y total a la serie
          found.series.push({
            name: String(Math.floor(curr.anio)), // Asegúrate de que sea un entero y lo conviertes en cadena
            value: Math.trunc(curr.total)
          });
        } else {
          // Si no existe, crea una nueva entrada con el sacramento y su primera serie
          acc.push({
            name: curr.sacramentos,
            series: [{
              name: String(Math.floor(curr.anio)), // Asegúrate de que sea un entero y lo conviertes en cadena
              value: Math.trunc(curr.total)
            }]
          });
        }
        
        return acc;
      }, []);
      
      // Asignar el resultado a multi
      this.multi = groupedData;

    })
  }

  

}
