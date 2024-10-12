import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardRequest } from '../../models/dashboar-request.interface';
import { DashboardService } from '../../services/dashboard.service';
import { CantidadSacramentosResponse } from '../../models/cantsacramento-response.interface';

@Component({
  selector: 'app-sac-anio-act',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './sac-anio-act.component.html',
  styleUrls: ['./sac-anio-act.component.scss']
})
export class SacAnioActComponent implements OnInit {

  single: any[];
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  dataSource: CantidadSacramentosResponse[] = []

  constructor(
    private _dashboardService: DashboardService
  ) {
    Object.assign(this, { single: this.single });
   }

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

  ngOnInit(): void {
    this.CantidadSacramentos(this.request)
  }

  onSelect(data): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  // CantidadSacramentos(request: DashboardRequest) {
  //   this._dashboardService.CantidadSacramentos(request).subscribe((resp) => {

  //       // Obtener el año actual
  //       const currentYear = new Date().getFullYear();

  //       this.dataSource = resp.data.items;

  //       // Filtrar los datos solo para el año en curso
  //       const filteredData = this.dataSource.filter(item => Math.floor(item.anio) === currentYear);

  //       const groupedData = filteredData.reduce((acc, curr) => {

  //           const found = acc.find(item => item.name === curr.sacramentos);

  //           if (found) {
  //               // Si ya existe, agrega el nuevo año y total a la serie
  //               found.series.push({
  //                   name: String(Math.floor(curr.anio)), // Convertir a cadena el año
  //                   value: Math.trunc(curr.total)
  //               });
  //           } else {
  //               // Si no existe, crea una nueva entrada con el sacramento y su primera serie
  //               acc.push({
  //                   name: curr.sacramentos,
  //                   series: [{
  //                       name: String(Math.floor(curr.anio)), // Convertir a cadena el año
  //                       value: Math.trunc(curr.total)
  //                   }]
  //               });
  //           }

  //           return acc;
  //       }, []);

  //       // Asignar el resultado filtrado al gráfico
  //       console.log(groupedData)
  //       this.single = groupedData;

  //   });
  // }

  CantidadSacramentos(request: DashboardRequest) {
    this._dashboardService.CantidadSacramentos(request).subscribe((resp) => {
      
      this.dataSource = resp.data.items;
  
      // Filtrar los datos por el año 2024
      const filteredData = this.dataSource.filter(item => Math.floor(item.anio) === 2024);
  
      // Procesar los datos filtrados
      const groupedData = filteredData.reduce((acc, curr) => {
        const found = acc.find(item => item.name === curr.sacramentos);
  
        if (found) {
          // Si ya existe, agrega el nuevo total al sacramento
          found.series.push({
            name: curr.sacramentos,
            value: Math.trunc(curr.total)
          });
        } else {
          // Si no existe, crea una nueva entrada con el sacramento y su serie
          acc.push({
            name: curr.sacramentos,
            value: Math.trunc(curr.total)
          });
        }
  
        return acc;
      }, []);
  
      // Asignar el resultado filtrado y agrupado a `this.single`
      this.single = groupedData;
  
    });
  }
  


}
