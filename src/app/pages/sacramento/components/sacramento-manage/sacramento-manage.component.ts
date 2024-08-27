import { Component, OnInit } from '@angular/core';
import { IconsService } from '@shared/services/icons.service';
import * as configs from '../../../../../static-data/configs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@shared/services/alert.service';
import { SacramentoService } from '../../services/sacramento.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DocumentTypeService } from '@shared/services/document-type.service';
import { DocumentType } from '@shared/models/document-type.interface';
import { tipoSacramentoSelect } from '../../models/list-tipoSacramento-select.interface';

@Component({
  selector: 'vex-sacramento-manage',
  templateUrl: './sacramento-manage.component.html',
  styleUrls: ['./sacramento-manage.component.scss']
})
export class SacramentoManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon('icClose')
  configs = configs

  documentTypes: DocumentType[];
  tipoSacramentoTypes: tipoSacramentoSelect[]
  form: FormGroup;

  initForm(): void{
    this.form = this._fb.group({
      scIdSacramento: [0, [Validators.required]],
      scPartida: [0, [Validators.required]],
      scIdTipoSacramento: [0, [Validators.required]],
      peNombre: ["", [Validators.required]],
      peFechaNacimiento: ["", [Validators.required]],
      peIdTipoDocumento: [0, [Validators.required]],
      peNumeroDocumento: ["", [Validators.required]],
      peDireccion: ["", [Validators.required]],
      scPadre: ["", [Validators.required]],
      scMadre: ["", [Validators.required]],
      scPadrino: ["", [Validators.required]],
      scMadrina: ["", [Validators.required]],
      scParroco: ["", [Validators.required]],
      scFechaSacramento: ["", [Validators.required]],
      scObservaciones: ["", [Validators.required]]
    })
  }

  constructor(
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _sacramentoService: SacramentoService,
    public _dialogRef: MatDialogRef<SacramentoManageComponent>,
    private _documentTypeService: DocumentTypeService
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    this.listDocumentTypes();
    this.listTipoSacramento();
  }

  listDocumentTypes(): void{
    this._documentTypeService.listDocumentType().subscribe((resp) =>{
      this.documentTypes = resp
    })
  }

  listTipoSacramento(): void{
    this._sacramentoService.TipoSacramentoSelect().subscribe((resp) =>{
      this.tipoSacramentoTypes = resp.data;
    })
  }

  sacramentoSave(): void{
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    const scIdSacramento = this.form.get("scIdSacramento").value;

    if(scIdSacramento > 0){
      this.sacramentoEdit(scIdSacramento);
    }else{
      this.sacramentoRegister();
    }
  }

  sacramentoRegister(): void{
    this._sacramentoService.SacramentoRegister(this.form.value).subscribe((resp) => {
      if(resp.isSuccess){
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }else{
        this._alert.warn("Atención", resp.message)
      }
    })
  }

  sacramentoEdit(scIdSacramento: number): void{}

  formatInput(event: any) {
    let input = event.target.value.replace(/\D/g, '');

    input = input.replace(/^(\d{0,5})(\d{0,5})(\d{0,5}).*/, 'L.$1 - F.$2 - P.$3');

    event.target.value = input;
    this.form.get('scPartida').setValue(input);
  }

}
