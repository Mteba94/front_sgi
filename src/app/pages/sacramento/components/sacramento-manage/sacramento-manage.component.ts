import { Component, Inject, OnInit } from '@angular/core';
import { IconsService } from '@shared/services/icons.service';
import * as configs from '../../../../../static-data/configs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@shared/services/alert.service';
import { SacramentoService } from '../../services/sacramento.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentTypeService } from '@shared/services/document-type.service';
import { DocumentType } from '@shared/models/document-type.interface';
import { tipoSacramentoSelect } from '../../models/list-tipoSacramento-select.interface';
import { atLeastOneFieldRequiredValidator } from './atLeastOneFieldRequiredValidator';

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
      scIdSacramento: [, ],
      scNumeroPartida: [, [Validators.required]],
      scIdTipoSacramento: [0, [Validators.required]],
      peNombre: ["", [Validators.required]],
      peFechaNacimiento: ["", [Validators.required]],
      peIdTipoDocumento: [0, [Validators.required]],
      peNumeroDocumento: [, [Validators.required, 
                              Validators.minLength(13)]],
      peDireccion: ["", [Validators.required]],
      scPadre: [""],
      scMadre: [""],
      scPadrino: [""],
      scMadrina: [""],
      scParroco: ["", [Validators.required]],
      scFechaSacramento: ["", [Validators.required]],
      scObservaciones: [""]
    },
    {
      validator: [
        atLeastOneFieldRequiredValidator('scPadre', 'scMadre'),
        atLeastOneFieldRequiredValidator('scPadrino', 'scMadrina'),
      ]
    },
  )
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
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

    if(this.data != null){
      //console.log(this.data.data.scIdSacramento)
      this.sacramentoById(this.data.scIdSacramento);
      
    }
  }

  handleSacramentoTypeChange(sacramentoTypeId: number): void {
    const matrimonioFields = {
      scIdTipoSacramento: 4,
      additionalFields: [
        { name: 'peNombreEsposo', validators: [Validators.required] },
        { name: 'peNombreEsposa', validators: [Validators.required] },
        { name: 'peFechaNacimientoEsposo', validators: [Validators.required] },
        { name: 'peFechaNacimientoEsposa', validators: [Validators.required] },
        { name: 'peIdTipoDocumentoEsposo', validators: [Validators.required] },
        { name: 'peIdTipoDocumentoEsposa', validators: [Validators.required] },
        { name: 'peNumeroDocumentoEsposo', validators: [Validators.required, Validators.minLength(13)] },
        { name: 'peNumeroDocumentoEsposa', validators: [Validators.required, Validators.minLength(13)] },
        { name: 'peDireccionEsposo', validators: [Validators.required] },
        { name: 'peDireccionEsposa', validators: [Validators.required] },
        { name: 'scPadreEsposo' },
        { name: 'scPadreEsposa' },
        { name: 'scMadreEsposo' },
        { name: 'scMadreEsposa' },
        { name: 'scTestigo1', validators: [Validators.required] },
        { name: 'scTestigo2', validators: [Validators.required] }
      ]
    };

    const defaultFields = [
      { name: 'peNombre', validators: [Validators.required] },
      { name: 'peFechaNacimiento', validators: [Validators.required] },
      { name: 'peIdTipoDocumento', validators: [Validators.required] },
      { name: 'peNumeroDocumento', validators: [Validators.required, Validators.minLength(13)] },
      { name: 'peDireccion', validators: [Validators.required] },
      { name: 'scPadre' },
      { name: 'scMadre' },
      { name: 'scPadrino' },
      { name: 'scMadrina' },
    ];

    // const fieldsToAdd = matrimonioFields.additionalFields.map(field => field.name);
  
    // const fieldsToRemove = ['peNombre', 'peFechaNacimiento', 'peIdTipoDocumento', 'peNumeroDocumento', 'peDireccion', 'scPadre', 'scPadrino'];

    if (sacramentoTypeId === matrimonioFields.scIdTipoSacramento) {
      // Añadir los campos al formulario
      matrimonioFields.additionalFields.forEach(field => {
        if (!this.form.contains(field.name)) {
          this.form.addControl(field.name, new FormControl('', field.validators));
        }
      });

      this.form.setValidators([
        atLeastOneFieldRequiredValidator('scPadreEsposo', 'scMadreEsposo'),
        atLeastOneFieldRequiredValidator('scPadreEsposa', 'scMadreEsposa')
      ]);

      defaultFields.forEach(field => {
        if (this.form.contains(field.name)) {
          this.form.get(field.name)?.clearValidators();
          this.form.get(field.name)?.updateValueAndValidity();
          this.form.removeControl(field.name);
        }
      });
    }else {
      // Restablecer los campos por defecto si no es matrimonio
      defaultFields.forEach(field => {
        if (!this.form.contains(field.name)) {
          this.form.addControl(field.name, new FormControl('', field.validators));
        }
      });

      matrimonioFields.additionalFields.forEach(field => {
        if (this.form.contains(field.name)) {
          this.form.removeControl(field.name);
      }
      });

      this.form.setValidators([
        atLeastOneFieldRequiredValidator('scPadre', 'scMadre'),
        atLeastOneFieldRequiredValidator('scPadrino', 'scMadrina')
      ]);
  
      // Eliminar los campos específicos de matrimonio
      
  
      // Eliminar los validadores específicos para matrimonio
      this.form.clearValidators();
      this.form.updateValueAndValidity();
    }
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
        console.log(this.form.invalid)
      })
    }

    const scIdSacramento = this.form.get("scIdSacramento").value;

    const scIdTipoSacramento = this.form.get("scIdTipoSacramento").value;

    if(scIdTipoSacramento == 4){
      console.log(this.form.getRawValue())
    }

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

  sacramentoById(sacramentoId: number): void{
    this._sacramentoService.SacramentoById(sacramentoId).subscribe((resp) => {
      this.form.reset({
        scIdSacramento: resp.scIdSacramento,
        scNumeroPartida: resp.scNumeroPartida,
        scIdTipoSacramento: resp.scIdTipoSacramento,
        peNombre: resp.peNombre,
        peFechaNacimiento: resp.peFechaNacimiento,
        peIdTipoDocumento: resp.peIdTipoDocumento,
        peNumeroDocumento: resp.peNumeroDocumento,
        peDireccion: resp.peDireccion,
        scPadre: resp.scNombrePadre,
        scMadre: resp.scNombreMadre,
        scPadrino: resp.scNombrePadrino,
        scMadrina: resp.scNombreMadrina,
        scParroco: resp.scParroco,
        scFechaSacramento: resp.scFechaSacramento,
        scObservaciones: resp.scObservaciones
      })

      this.form.get('scIdTipoSacramento')?.disable();
      this.form.get('scObservaciones')?.setValidators([Validators.required]);

    })
  }

  sacramentoEdit(scIdSacramento: number): void{
    this._sacramentoService.SacramentoEdit(scIdSacramento, this.form.getRawValue())
    .subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  formatInput(event: any) {
    let input = event.target.value.replace(/\D/g, '');

    input = input.replace(/^(\d{0,5})(\d{0,5})(\d{0,5}).*/, 'L.$1 - F.$2 - P.$3');

    event.target.value = input;
    this.form.get('scNumeroPartida').setValue(input);
  }

}
