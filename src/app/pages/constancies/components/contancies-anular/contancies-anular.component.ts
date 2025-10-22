import { Component, Inject, OnInit } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close'
import * as configs from '../../../../../static-data/configs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConstanciesService } from '../../services/constancies.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'vex-contancies-anular',
  templateUrl: './contancies-anular.component.html',
  styleUrls: ['./contancies-anular.component.scss']
})
export class ContanciesAnularComponent implements OnInit {

  icClose = icClose
  configs = configs

  form: FormGroup

  initForm(): void{
      this.form = this._fb.group({
        ct_observaciones: ['', [Validators.required]]
      })
    }

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private _constanciaService: ConstanciesService,
    private _alert: AlertService,
    public _dialogRef: MatDialogRef<ContanciesAnularComponent>,
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
  }

  anularConstancia(): void{
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const constanciaId = this.data.ct_ConstanciaId

    if(constanciaId > 0){
      this.anulacionContancia(constanciaId)
    }
  }

  anulacionContancia(constanciaId: number): void{
    this._constanciaService.constancieAnular(constanciaId, this.form.value).subscribe(
      (resp) => {
        if(resp.isSuccess){
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true)
        }else{
          this._alert.warn("Atención", resp.message);
        }
      }
    )
  }

}
