import { Component, Inject, OnInit } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close'
import * as configs from '../../../../../static-data/configs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@shared/services/alert.service';
import { CatalogosService } from '../../services/catalogos.service';

@Component({
  selector: "vex-grado-sacerdotal-manage",
  templateUrl: "./grado-sacerdotal-manage.component.html",
  styleUrls: ["./grado-sacerdotal-manage.component.scss"],
})
export class GradoSacerdotalManageComponent implements OnInit {
  icClose = icClose;
  configs = configs;

  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      csId: [,],
      csNombre: ["", [Validators.required]],
      csAbreviacion: ["", [Validators.required]],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    public _dialogRef: MatDialogRef<GradoSacerdotalManageComponent>,
    private _catalogoService: CatalogosService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if(this.data != null){
      this.catSacerdoteById(this.data.gradoSacerdotalId);
    }
  }

  catSacerdoteSave(): void {
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
        console.log(this.form.invalid)
      })
    }

    const csId = this.form.get("csId").value;

    if (csId > 0) {
      this.catSacerdoteEdit(csId);
    } else {
      this.catSacerdoteRegister();
    }
  }

  catSacerdoteById(catId: number): void {
    this._catalogoService.GradoSacerdotalById(catId).subscribe((resp) => {
      this.form.reset({
        csId: resp.csId,
        csNombre: resp.csNombre,
        csAbreviacion: resp.csAbreviacion
      })
    })
  }

  catSacerdoteEdit(sacerdoteId: number): void {
    this._catalogoService.GradoSacerdotalUpdate(sacerdoteId, this.form.value).subscribe((resp) => {
      if(resp.isSuccess){
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }else{
        this._alert.warn("Atención", resp.message)
      }
    })
  }

  catSacerdoteRegister(): void {
    this._catalogoService.GradoSacerdotalRegister(this.form.value).subscribe((resp) => {
      if(resp.isSuccess){
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }else{
        this._alert.warn("Atención", resp.message)
      }
    })
  }
}
