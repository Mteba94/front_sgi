import { Component, OnInit } from "@angular/core";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { componentSettings } from "./grado-sacerdotal-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { GradoSacerdotalManageComponent } from "../grado-sacerdotal-manage/grado-sacerdotal-manage.component";
import { MatDialog } from "@angular/material/dialog";
import { CatalogosService } from "../../services/catalogos.service";
import { AuthService } from "src/app/pages/auth/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "vex-grado-sacerdotal-list",
  templateUrl: "./grado-sacerdotal-list.component.html",
  styleUrls: ["./grado-sacerdotal-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class GradoSacerdotalListComponent implements OnInit {
  component;
  buttonShow: boolean = false;

  constructor(
    public _dialog: MatDialog,
    public _catalogoService: CatalogosService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.component = componentSettings;
    this.buttonShow = this.authService.hasRole(['Administrador'])
  }

  setData(value: number) {
    this.component.filters.stateFilter = value;
    this.formatGetInputs();
  }

  search(data: FiltersBox) {
    this.component.filters.numFilter = data.searchValue;
    this.component.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  searchDateRange(date: DateRange) {
    this.component.filters.startDate = date.startDate;
    this.component.filters.endDate = date.endDate;
    this.formatGetInputs();
  }

  resetFilters() {
    this.component.filters = { ...this.component.resetFilters };
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
      .open(GradoSacerdotalManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.formatGetInputs();
        }
      });
  }

  rowClick(e: any) {
    let action = e.action;
    let gradoSacerdotal = e.row;

    switch (action) {
      case "edit":
        this.catGradoSacerdotalEdit(gradoSacerdotal)
        break;
      case "remove":
        this.catGradoSacerdotalRemove(gradoSacerdotal)
        break;
    }
    return false;
  }

  catGradoSacerdotalEdit(gradoSacerdotal: any) {
    this._dialog
      .open(GradoSacerdotalManageComponent, {
        disableClose: true,
        width: "400px",
        data: { gradoSacerdotalId: gradoSacerdotal.csId },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.formatGetInputs();
        }
      });
  }

  catGradoSacerdotalRemove(gradoSacerdotal: any) {
    Swal.fire({
          title: `¿Realmente deseas eliminar al sacerdote ${gradoSacerdotal.sacerdoteNombre}`,
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
          if (result.value) {
            this._catalogoService.GradoSacerdotalDelete(gradoSacerdotal.csId).subscribe((resp) => {
              this.formatGetInputs();
            })
          }
        });
  }
}
