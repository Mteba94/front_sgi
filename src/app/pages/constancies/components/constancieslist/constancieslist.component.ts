import { Component, OnInit } from '@angular/core';
import { CustomTitleService } from '@shared/services/custom-title.service';
import { componentSettings, menuItems, updateMenuItems } from './constancia-list-config';
import { ConstanciesService } from '../../services/constancies.service';
import { ConstanciaResponse } from '../../models/constancia-response.interface';
import { RowClick } from '@shared/models/row-click.interface';
import { FiltersBox } from '@shared/models/search-options.interface';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { SacramentoService } from 'src/app/pages/sacramento/services/sacramento.service';
import { BaseResponse } from '@shared/models/base-api-response.interface';

@Component({
  selector: 'vex-constancieslist',
  templateUrl: './constancieslist.component.html',
  styleUrls: ['./constancieslist.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms]
})
export class ConstancieslistComponent implements OnInit {

  component: any
  constructor(
    customTitle: CustomTitleService,
    public _constaciaService: ConstanciesService,
    public _sacramentoService: SacramentoService
  ) { 
    customTitle.set("Constancias");
  }

  ngOnInit(): void {
    this.component = componentSettings

    this._sacramentoService.TipoSacramentoSelect().subscribe((resp: BaseResponse) => {
      if (resp.isSuccess && Array.isArray(resp.data)) {
        updateMenuItems(resp.data);
        this.component.menuItems = menuItems;
      } else {
        console.error("La respuesta no es un arreglo o no fue exitosa:", resp);
      }
    });
  }

  setMenu(value: number) {
    this.component.filters.stateFilter = value
    this.formatGetInputs()
  }

  search(data: FiltersBox){
    this.component.filters.numFilter = data.searchValue
    this.component.filters.textFilter = data.searchData
    this.formatGetInputs()
  }

  formatGetInputs(){
    let inputs = {
      numFilter: 0,
      textFilter: "",
      stateFilter: null,
      startDate: null,
      endDate: null
    }

    if(this.component.filters.numFilter != ""){
      inputs.numFilter = this.component.filters.numFilter
      inputs.textFilter = this.component.filters.textFilter
    }

    if(this.component.filters.stateFilter != null){
      inputs.stateFilter = this.component.filters.stateFilter
    }

    if(this.component.filters.refresh){
      let random = Math.random();
      this.component.filters.refresh = false;
    }

    if(this.component.filters.startDate != "" && this.component.filters.endDate != ""){
      inputs.startDate = this.component.filters.startDate
      inputs.endDate = this.component.filters.endDate
    }
    
    this.component.getInputs = inputs
  }

  setGetInputsSacrament(refresh: boolean){
    this.component.filters.refresh = refresh;
    this.formatGetInputs()
  }

  rowClick(rowClick: RowClick<ConstanciaResponse>){
    let action = rowClick.action;
    let sacramento = rowClick.row;

    switch(action){
      case "edit":
        //this.SacramentoEdit(sacramento);
        break
      case "constancia":
        //this.constancesGenerate(sacramento)
        break
    }

    return false
  }

  openDialogRegister(){}

}
