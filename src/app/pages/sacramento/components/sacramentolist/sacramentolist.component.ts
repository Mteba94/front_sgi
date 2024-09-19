import { Component, OnInit } from '@angular/core';
import { CustomTitleService } from '@shared/services/custom-title.service';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { SacramentoService } from '../../services/sacramento.service';
import { componentSettings, menuItems, updateMenuItems } from './sacramento-list-config';
import { DateRange, FiltersBox } from '@shared/models/search-options.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SacramentoManageComponent } from '../sacramento-manage/sacramento-manage.component';
import { SacramentoResponse } from '../../models/sacramento-response.interface';
import { RowClick } from '@shared/models/row-click.interface';
import { ConstanciesService } from 'src/app/pages/constancies/services/constancies.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstanciesManageComponent } from 'src/app/pages/constancies/components/constancies-manage/constancies-manage.component';
import { BaseResponse } from '@shared/models/base-api-response.interface';

@Component({
  selector: 'vex-sacramentolist',
  templateUrl: './sacramentolist.component.html',
  styleUrls: ['./sacramentolist.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms]
})
export class SacramentolistComponent implements OnInit {

  component: any

  constructor(
    customTitle: CustomTitleService,
    public _sacramentoService: SacramentoService,
    public _dialog: MatDialog,
  ) {
    customTitle.set("Sacramentos");
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

  searchDateRange(date: DateRange){
    this.component.filters.startDate = date.startDate
    this.component.filters.endDate = date.endDate
    this.formatGetInputs();
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

  openDialogRegister(){
    this._dialog.open(SacramentoManageComponent, {
      disableClose: true,
      width: "700px",
      maxHeight: '80vh'
    })
    .afterClosed()
    .subscribe((res) => {
      if(res){
        this.setGetInputsSacrament(true)
      }
    })
  }

  setGetInputsSacrament(refresh: boolean){
    this.component.filters.refresh = refresh;
    this.formatGetInputs()
  }

  rowClick(rowClick: RowClick<SacramentoResponse>){
    let action = rowClick.action;
    let sacramento = rowClick.row;

    switch(action){
      case "edit":
        this.SacramentoEdit(sacramento);
        break
      case "constancia":
        this.constancesGenerate(sacramento)
        break
    }

    return false
  }

  SacramentoEdit(sacramentoData: SacramentoResponse){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = sacramentoData

    this._dialog.open(SacramentoManageComponent, {
      data: sacramentoData,
      disableClose: true,
      width: "700px",
      maxHeight: '80vh'
    })
    .afterClosed().subscribe(
      (res) => {
        if (res) {
          this.formatGetInputs()
        }
      }
    )
  }

  constancesGenerate(sacramentoData: SacramentoResponse){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = sacramentoData
    this._dialog.open(ConstanciesManageComponent, {
      data: sacramentoData,
      disableClose: true,
      width: "900px",
      maxHeight: '80vh'
    })
    .afterClosed().subscribe(
      (res) => {
        if (res) {
          this.formatGetInputs()
        }
      }
    )
  }

  /*
  constancesGenerate(sacramentoData: SacramentoResponse){
    this._sacramentoService.SacramentoById(sacramentoData.scIdSacramento).subscribe((resp) => {

      const numeroPartida = resp.scNumeroPartida.trim();
      const [libro, folio, partida] = numeroPartida.split('-').map(part => part.trim());

      const libroNumero = libro.replace(/[^\d]/g, '');  // Elimina todo lo que no sea dígito
      const folioNumero = folio.replace(/[^\d]/g, '');
      const partidaNumero = partida.replace(/[^\d]/g, '');

      const fechaSacramento = resp.scFechaSacramento;
      const fecha = new Date(fechaSacramento);

      const dia = fecha.getDate();
      const mesNumero = fecha.getMonth();
      const anio = fecha.getFullYear();

      const fechaActual = new Date();

      const diaAct = fechaActual.getDate();
      const mesAct = fechaActual.getMonth();
      const aniAct = fechaActual.getFullYear();

      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

      const mesLetraAct = meses[mesAct];
      
      const mesLetra = meses[mesNumero];

      const fechaNacimiento = new Date(resp.peFechaNacimiento)

      const diaNac = fechaNacimiento.getDate().toString().padStart(2, '0')
      const mesNac = (fechaNacimiento.getMonth() + 1).toString().padStart(2, '0');
      const añoNac = fechaNacimiento.getFullYear();

      const fechaFormateadaNac = `${diaNac}/${mesNac}/${añoNac}`;

      const nombrePadrinos = [resp.scNombrePadrino, resp.scNombreMadrina];

      let edad = fecha.getFullYear() - fechaNacimiento.getFullYear();
      const mes = fecha.getMonth() - fechaNacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && fecha.getDate() < fechaNacimiento.getDate())) {
          edad--;
      }
      
      const constaciaData: ConstanciaRequest = {
        idTipoSacramento: resp.scIdTipoSacramento,
        tipoSacramento: resp.scTipoSacramento,
        numero: libroNumero,
        folio: folioNumero,
        partida: partidaNumero,
        dia: dia.toString(),
        mes: mesLetra,
        anio: anio.toString(),
        nombreBautizado: resp.peNombre,
        fechaNacimiento: fechaFormateadaNac,
        edad: edad,
        nombrePadre: resp.scNombrePadre,
        nombreMadre: resp.scNombreMadre,
        nombrePadrinos: nombrePadrinos,
        nombreSacerdote: resp.scParroco,
        anotacionMarginal: "resp.scAnotacionMarginal",
        diaExpedicion: diaAct.toString(),
        mesExpedicion: mesLetraAct,
        anioExpedicion: aniAct.toString()
      }

      this._spinner.show();
      this._constanciaService.constancieGenerate(constaciaData).subscribe((respConst) => {

        const base64Data = respConst.data.b64;
        const fileName = respConst.data.fileName;

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
      
        const blob = new Blob([byteArray], { type: 'application/pdf' });
      
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
      
        document.body.appendChild(link);
      
        link.click();
      
        document.body.removeChild(link);
        this._spinner.hide();
      },
      (error) => {
        console.error("Error al generar la constancia: ", error);

        this._spinner.hide();
      })
    })
  }
    */


}
