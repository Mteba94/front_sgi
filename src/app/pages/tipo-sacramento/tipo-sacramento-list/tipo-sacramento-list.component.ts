import { Component, OnInit } from '@angular/core';
import { CustomTitleService } from '@shared/services/custom-title.service';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TipoSacramentoService } from 'src/app/services/tipo-sacramento.service';
import { componentSettings } from './tipo-sacramento-list-config';
import { tipoSacramentoApi } from 'src/app/responses/tipoSacramento/tiposacramento.response';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { DatesFilter } from '@shared/functions/actions';
import { MatDialog } from '@angular/material/dialog';
import { TipoSacramentoManageComponent } from '../tipo-sacramento-manage/tipo-sacramento-manage.component';

@Component({
  selector: 'vex-tipo-sacramento-list',
  templateUrl: './tipo-sacramento-list.component.html',
  styleUrls: ['./tipo-sacramento-list.component.scss'],
  animations:[
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class TipoSacramentoListComponent implements OnInit {

  component

  constructor(
    customTitle: CustomTitleService,
    public _tipoSacramentoService: TipoSacramentoService,
    public _dialog: MatDialog
  ) { 
    customTitle.set('Listado de Tipos de Sacramento');
  }

  ngOnInit(): void {
    this.component = componentSettings
  }

  rowClick(e: any){
    let action = e.action
    let tipoSacramento = e.row

    switch (action) {
      case "edit":
        this.TipoSacramentoEdit(tipoSacramento)
        break;
      case "remove":
        this.TipoSacramentoRemove(tipoSacramento)
        break;
    }
    return false
  }

  setData(data: any = null){
    this.component.filters.stateFilter = data.value
    this.component.menuOpen = false
    this.formatGetInputs()
  }

  search(data: any){
    this.component.filters.numFilter = data.searchValue
    this.component.filters.textFilter = data.searchString
    this.formatGetInputs()
  }

  datesFilterOpen(){
    DatesFilter(this)
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

    if(this.component.filters.startDate != "" && this.component.filters.endDate != ""){
      inputs.startDate = this.component.filters.startDate
      inputs.endDate = this.component.filters.endDate
    }

    this.component.getInputs = inputs
  }

  openDialogRegister(){
    this._dialog.open(TipoSacramentoManageComponent, {
      disableClose: true,
      width: "400px"
    }).afterClosed().subscribe(
      (res) => {
        if (res) {
          this.formatGetInputs()
        }
      }
    )
  }

  TipoSacramentoEdit(row: tipoSacramentoApi){

  }

  TipoSacramentoRemove(tipoSacramento: any){

  }

}
