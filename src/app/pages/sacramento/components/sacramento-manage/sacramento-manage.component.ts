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
import { SexType } from '@shared/models/sex-type.interface';
import { SexTypeService } from '@shared/services/sex-type.service';
import moment from 'moment';

@Component({
  selector: 'vex-sacramento-manage',
  templateUrl: './sacramento-manage.component.html',
  styleUrls: ['./sacramento-manage.component.scss']
})
export class SacramentoManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon('icClose')
  configs = configs

  documentTypes: DocumentType[];
  tipoSacramentoTypes: tipoSacramentoSelect[];
  sexTypes: SexType[];
  form: FormGroup;

  initialDate = '2023-01-01';
  maxDate = moment();

  initForm(): void{
    this.form = this._fb.group({
      scIdSacramento: [, ],
      scMatrimonioId: [, ],
      scNumeroPartida: [, [Validators.required]],
      scIdTipoSacramento: [0, [Validators.required]],
      peNombre: ["", [Validators.required]],
      peFechaNacimiento: [null, [Validators.required]],
      peIdTipoDocumento: [0, [Validators.required]],
      peNumeroDocumento: [, [Validators.required, 
                              Validators.minLength(13)]],
      peSexoId: [0, [Validators.required]],
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
    private _documentTypeService: DocumentTypeService,
    private _sexTypeService: SexTypeService
  ) {
    this.initForm();
   }

  ngOnInit(): void {
    this.listDocumentTypes();
    this.listTipoSacramento();
    this.listSexType();

    if(this.data != null){
      //console.log(this.data.scIdSacramento)
      this.sacramentoById(this.data.scIdSacramento);
    }else {
      // Aplicar la configuración del formulario para el tipo de sacramento por defecto (si lo hay)
      console.log(this.data.scIdSacramento)
      this.handleSacramentoTypeChange(this.form.get('scMatrimonioId')?.value);
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
        { name: 'peSexoIdEsposo', validators: [Validators.required], defaultValue: 2 },
        { name: 'peSexoIdEsposa', validators: [Validators.required], defaultValue: 1 },
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
      { name: 'peSexoId' }
    ];

    if (sacramentoTypeId === matrimonioFields.scIdTipoSacramento) {
      
      matrimonioFields.additionalFields.forEach(field => {
        if (!this.form.contains(field.name)) {
          const control = new FormControl(
            { value: field.defaultValue || '', disabled: !!field.defaultValue },
            field.validators
          );
          this.form.addControl(field.name, control);
          //this.form.addControl(field.name, new FormControl('', field.validators));
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

  listSexType(): void{
    this._sexTypeService.listSexType().subscribe((resp) =>{
      this.sexTypes = resp
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

    if(scIdSacramento > 0){

      if(scIdTipoSacramento == 4){
        this.matrimonioEdit(scIdSacramento);
      }else{
        this.sacramentoEdit(scIdSacramento);
      }
      
    }else{

      if(scIdTipoSacramento == 4){
        this.matrimonioRegister();
      }else{
        this.sacramentoRegister();
      }
      
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

  matrimonioRegister(): void{
    this._sacramentoService.MatrimonioRegister(this.form.getRawValue()).subscribe((resp) => {
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

      if(resp.scIdTipoSacramento == 4){
        this.matrimoniobyId(sacramentoId)
      }

      this.form.reset({
        scIdSacramento: resp.scIdSacramento,
        scNumeroPartida: resp.scNumeroPartida,
        scIdTipoSacramento: resp.scIdTipoSacramento,
        peNombre: resp.peNombre,
        peFechaNacimiento: resp.peFechaNacimiento,
        peIdTipoDocumento: resp.peIdTipoDocumento,
        peNumeroDocumento: resp.peNumeroDocumento,
        peSexoId: resp.peSexoId,
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

  matrimoniobyId(matrimonioId: number): void{
    this._sacramentoService.MatrimonioById(matrimonioId).subscribe((resp) => {
      console.log(resp)

      this.handleSacramentoTypeChange(resp.scIdTipoSacramento);

      this.form.patchValue({
        scIdTipoSacramento: resp.scIdTipoSacramento,
        scNumeroPartida: resp.scNumeroPartida,
        peNombreEsposo: resp.peNombreEsposo,
        peNombreEsposa: resp.peNombreEsposa,
        peFechaNacimientoEsposo: resp.peFechaNacimientoEsposo,
        peFechaNacimientoEsposa: resp.peFechaNacimientoEsposa,
        peIdTipoDocumentoEsposo: resp.peIdTipoDocumentoEsposo,
        peIdTipoDocumentoEsposa: resp.peIdTipoDocumentoEsposa,
        peNumeroDocumentoEsposo: resp.peNumeroDocumentoEsposo,
        peNumeroDocumentoEsposa: resp.peNumeroDocumentoEsposa,
        peSexoIdEsposo: resp.peSexoIdEsposo,
        peSexoIdEsposa: resp.peSexoIdEsposa,
        peDireccionEsposo: resp.peDireccionEsposo,
        peDireccionEsposa: resp.peDireccionEsposa,
        scPadreEsposo: resp.scPadreEsposo,
        scPadreEsposa: resp.scPadreEsposa,
        scMadreEsposo: resp.scMadreEsposo,
        scMadreEsposa: resp.scMadreEsposa,
        scTestigo1: resp.scTestigo1,
        scTestigo2: resp.scTestigo2,
        scParroco: resp.scParroco,
        scFechaSacramento: resp.scFechaSacramento,
        scObservaciones: resp.scObservaciones
      });
  
      // Ejemplo de cómo manejar deshabilitar un campo o establecer validadores
      this.form.get('scIdTipoSacramento')?.disable();
      this.form.get('scObservaciones')?.setValidators([Validators.required]);
  
      // Si necesitas realizar alguna acción dependiendo del tipo de sacramento
      
    });
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

  matrimonioEdit(scIdSacramento: number): void{
    this._sacramentoService.MatrimonioEdit(scIdSacramento, this.form.getRawValue())
    .subscribe((resp) =>{
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    })
  }

  formatInput(event: any) {
    let input = event.target.value.replace(/\D/g, '');

    input = input.replace(/^(\d{0,5})(\d{0,5})(\d{0,5}).*/, 'L.$1 - F.$2 - P.$3');

    event.target.value = input;
    this.form.get('scNumeroPartida').setValue(input);
  }

}
