import { Component, OnInit } from '@angular/core';
import { FiltersBox } from '@shared/models/search-options.interface';
import { SacerdotesManageComponent } from '../sacerdotes-manage/sacerdotes-manage.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RowClick } from '@shared/models/row-click.interface';
import { SacerdoteResponse } from '../../models/sacerdote-response.interface';
import { SacerdoteService } from '../../services/sacerdote.service';
import { componentSettings } from './sacerdotes-list-config';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

@Component({
  selector: "vex-sacerdotes-list",
  templateUrl: "./sacerdotes-list.component.html",
  styleUrls: ["./sacerdotes-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class SacerdotesListComponent implements OnInit {
  component: any;
  buttonShow = false;

  constructor(
    public _dialog: MatDialog,
    public _sacerdoteService: SacerdoteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.component = componentSettings;
    this.buttonShow = this.authService.hasRole(['Administrador'])
  }

  setMenu(value: number) {
    this.component.filters.stateFilter = value;
    this.formatGetInputs();
  }

  search(data: FiltersBox) {
    this.component.filters.numFilter = data.searchValue;
    this.component.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  formatGetInputs() {
    let inputs = {
      numFilter: 0,
      textFilter: "",
      stateFilter: null,
      startDate: null,
      endDate: null,
    };

    if (this.component.filters.numFilter != "") {
      inputs.numFilter = this.component.filters.numFilter;
      inputs.textFilter = this.component.filters.textFilter;
    }

    if (this.component.filters.stateFilter != null) {
      inputs.stateFilter = this.component.filters.stateFilter;
    }

    if (this.component.filters.refresh) {
      let random = Math.random();
      this.component.filters.refresh = false;
    }

    if (
      this.component.filters.startDate != "" &&
      this.component.filters.endDate != ""
    ) {
      inputs.startDate = this.component.filters.startDate;
      inputs.endDate = this.component.filters.endDate;
    }

    this.component.getInputs = inputs;
  }

  openDialogRegister() {
    this._dialog
      .open(SacerdotesManageComponent, {
        disableClose: true,
        width: "700px",
        maxHeight: "80vh",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsSacrament(true);
        }
      });
  }

  rowClick(rowClick: RowClick<SacerdoteResponse>) {
    let action = rowClick.action;
    let sacramento = rowClick.row;

    switch (action) {
      case "edit":
        this.sacerdoteEdit(sacramento);
        break;
      case "delete":
        this.sacerdoteDelete(sacramento);
        break;
      case "firma":
        this.sacerdoteFirma(sacramento);
        break;
    }

    return false;
  }

  setGetInputsSacrament(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  sacerdoteEdit(sacerdoteData: SacerdoteResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = sacerdoteData;

    this._dialog
      .open(SacerdotesManageComponent, {
        data: sacerdoteData,
        disableClose: true,
        width: "700px",
        maxHeight: "80vh",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.formatGetInputs();
        }
      });
  }

  sacerdoteDelete(sacerdoteData: SacerdoteResponse) {
    Swal.fire({
      title: `¿Realmente deseas eliminar al sacerdote ${sacerdoteData.sacerdoteNombre}`,
      text: "Se borrara de forma permanente!",
      icon: "warning",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: "rgb(210, 155, 253)",
      cancelButtonColor: "rgb(79,109,253)",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar",
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this._sacerdoteService
          .SacerdoteDelete(sacerdoteData.sacerdoteId)
          .subscribe(() => this.formatGetInputs());
      }
    });
  }

  sacerdoteFirma(sacerdoteData: SacerdoteResponse) {
    Swal.fire({
      title: `¿Realmente deseas confirmar al sacerdote ${sacerdoteData.sacerdoteNombre} para firma`,
      text: "Quedara asignado para firma!",
      icon: "warning",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: "rgb(210, 155, 253)",
      cancelButtonColor: "rgb(79,109,253)",
      confirmButtonText: "Si, Confirmar firma!",
      cancelButtonText: "Cancelar",
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this._sacerdoteService
          .SacerdoteFirma(sacerdoteData.sacerdoteId)
          .subscribe(() => this.formatGetInputs());
      }
    });
  }

  resetFilters() {
    this.component.filters = { ...this.component.resetFilters };
    this.formatGetInputs();
  }
}
