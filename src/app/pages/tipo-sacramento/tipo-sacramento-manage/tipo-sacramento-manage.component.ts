import { Component, Inject, OnInit } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close'
import * as configs from '../../../../static-data/configs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@shared/services/alert.service';
import { TipoSacramentoService } from 'src/app/services/tipo-sacramento.service';

@Component({
  selector: 'vex-tipo-sacramento-manage',
  templateUrl: './tipo-sacramento-manage.component.html',
  styleUrls: ['./tipo-sacramento-manage.component.scss']
})
export class TipoSacramentoManageComponent implements OnInit {

  icClose = icClose
  configs = configs

  form: FormGroup

  initForm(): void{
    this.form = this._fb.group({
      TsIdTipoSacramento: [0, [Validators.required]],
      TsNombre: ['', [Validators.required]],
      TsDescripcion: ['', [Validators.required]],
      TsRequerimiento: ['', [Validators.required]]
    })
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _tipoSacramentoService: TipoSacramentoService,
    public _dialogRef: MatDialogRef<TipoSacramentoManageComponent>
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
    if(this.data != null){
      this.tipoSacramentoById(this.data.data.tsIdTipoSacramento)
    }
  }

  tipoSacramentoById(SacramentoId: number): void{
    this._tipoSacramentoService.TipoSacramentoById(SacramentoId).subscribe(
      (resp) => {
        this.form.reset({
          TsIdTipoSacramento: resp.tsIdTipoSacramento,
          TsNombre: resp.tsNombre,
          TsDescripcion: resp.tsDescripcion,
          TsRequerimiento: resp.tsRequerimiento
        })
      }
    )
  }

  TipoSacramentoSave(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const tipoSacramentoId = this.form.get("TsIdTipoSacramento").value;

    if (tipoSacramentoId > 0) {
      this.tipoSacramentoEdit(tipoSacramentoId);
    } else {
      this.tipoSacramentoRegister();
    }
  }

  tipoSacramentoRegister(): void {
    this._tipoSacramentoService
      .TipoSacramentoRegister(this.form.value)
      .subscribe((resp) => {
        //console.log(resp);
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        } else {
          this._alert.warn("Atención", resp.message);
        }
      });
  }

  tipoSacramentoEdit(categoryId: number): void {
    this._tipoSacramentoService
       .TipoSacramentoEdit(categoryId, this.form.value)
       .subscribe((resp) => {
         if (resp.isSuccess) {
           this._alert.success("Excelente", resp.message);
           this._dialogRef.close(true);
         } else {
           this._alert.warn("Atención", resp.message);
         }
       });
  }

}
