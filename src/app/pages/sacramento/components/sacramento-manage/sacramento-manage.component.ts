import { Component, Inject, OnInit } from '@angular/core';
import { IconsService } from '@shared/services/icons.service';
import * as configs from '../../../../../static-data/configs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@shared/services/alert.service';
import { SacramentoService } from '../../services/sacramento.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DocumentTypeService } from '@shared/services/document-type.service';
import { DocumentType } from '@shared/models/document-type.interface';
import { tipoSacramentoSelect } from '../../models/list-tipoSacramento-select.interface';
import { atLeastOneFieldRequiredValidator } from './atLeastOneFieldRequiredValidator';
import { SexType } from '@shared/models/sex-type.interface';
import { SexTypeService } from '@shared/services/sex-type.service';
import { SacerdoteSelectService } from '@shared/services/sacerdote-select.service';
import { ListSacerdote } from '@shared/models/list-sacerdote.interface';
import { SacerdotesManageComponent } from 'src/app/pages/sacerdotes/components/sacerdotes-manage/sacerdotes-manage.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GenericValidators } from '@shared/validators/generic-validators';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '@shared/functions/date-format';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "vex-sacramento-manage",
  templateUrl: "./sacramento-manage.component.html",
  styleUrls: ["./sacramento-manage.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class SacramentoManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  configs = configs;

  celebranteFilterCtrl = new FormControl();
  filteredSacerdotes: Observable<any[]>;

  documentTypes: DocumentType[];
  tipoSacramentoTypes: tipoSacramentoSelect[];
  sacerdotes: ListSacerdote[];
  sexTypes: SexType[];
  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group(
      {
        scIdSacramento: [,],
        scLibro: ["", [Validators.required, GenericValidators.numeric]],
        scFolio: ["", [Validators.required, GenericValidators.numeric]],
        scPartida: ["", [Validators.required, GenericValidators.numeric]],
        scNumeroPartida: [""],
        scIdTipoSacramento: [0, [Validators.required]],
        peNombre: ["", [Validators.required]],
        peFechaNacimiento: [null, [Validators.required]],
        peIdTipoDocumento: [0, [Validators.required]],
        peNumeroDocumento: [, [Validators.required, Validators.minLength(13), GenericValidators.numeric]],
        peSexoId: [0, [Validators.required, Validators.min(1)]],
        peDireccion: ["", [Validators.required]],
        scPadre: [""],
        scMadre: [""],
        scPadrino: [""],
        scMadrina: [""],
        scParroco: ["", [Validators.required]],
        scFechaSacramento: ["", [Validators.required]],
        scObservaciones: [""],
      },
      // {
      //   validator: [
      //     atLeastOneFieldRequiredValidator("scPadre", "scMadre"),
      //     atLeastOneFieldRequiredValidator("scPadrino", "scMadrina"),
      //   ],
      // }
    );
  }

  tipoSacramento: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _sacramentoService: SacramentoService,
    public _dialogRef: MatDialogRef<SacramentoManageComponent>,
    private _documentTypeService: DocumentTypeService,
    private _sexTypeService: SexTypeService,
    private _sacerdoteService: SacerdoteSelectService,
    public _dialog: MatDialog,
    public _spinner: NgxSpinnerService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listDocumentTypes();
    this.listTipoSacramento();
    this.listSexType();
    // Chain listSacerdote to ensure sacerdotes are loaded before sacramentoById/matrimonioById
    this._sacerdoteService.listSacerdote().subscribe((resp) => {
      this.sacerdotes = resp;
      this.filteredSacerdotes = this.celebranteFilterCtrl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterSacerdotes(value || ""))
      );

      // Now that sacerdotes are loaded, call sacramentoById if data exists
      if (this.data != null) {
        this.sacramentoById(this.data.scIdSacramento);
      } else {
        this.handleSacramentoTypeChange(this.form.get("scMatrimonioId")?.value);
      }
    });

    this.form.get("peIdTipoDocumento")?.valueChanges.subscribe((value) => {
      if (value === 2) {
        this.form.get("peNumeroDocumento")?.disable();
        this.generateSecuencial();
      } else {
        this.form.get("peNumeroDocumento")?.enable();
      }
    });
  }

  generateSecuencial(): void {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Últimos dos dígitos del año
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Mes con dos dígitos
    const day = ("0" + date.getDate()).slice(-2); // Día con dos dígitos
    const hour = ("0" + date.getHours()).slice(-2); // Hora con dos dígitos
    const minute = ("0" + date.getMinutes()).slice(-2); // Minutos con dos dígitos
    const second = ("0" + date.getSeconds()).slice(-2); // Segundos con dos dígitos
    const secuencial = `${year}${month}${day}${hour}${minute}${second}`;
    const secuencialEsp = (parseInt(secuencial) + 1).toString();
    this.form.patchValue({
      peNumeroDocumento: secuencial,
      peNumeroDocumentoEsposo: secuencial,
      peNumeroDocumentoEsposa: secuencialEsp,
    });
  }

  handleSacramentoTypeChange(sacramentoTypeId: number): void {
    this.tipoSacramento = sacramentoTypeId;

    const confirmacionFields = {
      scIdTipoSacramento: 3,
      additionalFields: [
        { name: "peEdad", validators: [GenericValidators.numeric]},
        { name: "scLugarBautizo"},
      ]
    }

    const matrimonioFields = {
      scIdTipoSacramento: 4,
      additionalFields: [
        { name: "peNombreEsposo", validators: [Validators.required] },
        { name: "peNombreEsposa", validators: [Validators.required] },
        { name: "peEdadEsposo", validators: [GenericValidators.numeric] },
        { name: "peEdadEsposa", validators: [GenericValidators.numeric] },
        { name: "peFechaNacimientoEsposo" },
        { name: "peFechaNacimientoEsposa" },
        { name: "peIdTipoDocumentoEsposo", validators: [Validators.required] },
        { name: "peIdTipoDocumentoEsposa", validators: [Validators.required] },
        {
          name: "peNumeroDocumentoEsposo",
          validators: [Validators.required, Validators.minLength(13)],
        },
        {
          name: "peNumeroDocumentoEsposa",
          validators: [Validators.required, Validators.minLength(13)],
        },
        {
          name: "peSexoIdEsposo",
          validators: [Validators.required],
          defaultValue: 2,
        },
        {
          name: "peSexoIdEsposa",
          validators: [Validators.required],
          defaultValue: 1,
        },
        { name: "peDireccionEsposo", validators: [Validators.required] },
        { name: "peDireccionEsposa", validators: [Validators.required] },
        { name: "scPadreEsposo" },
        { name: "scPadreEsposa" },
        { name: "scMadreEsposo" },
        { name: "scMadreEsposa" },
        { name: "scTestigo1", validators: [Validators.required] },
        { name: "scTestigo2", validators: [Validators.required] },
      ],
    };

    const defaultFields = [
      { name: "peNombre", validators: [Validators.required] },
      { name: "peFechaNacimiento", validators: [Validators.required] },
      { name: "peIdTipoDocumento", validators: [Validators.required] },
      {
        name: "peNumeroDocumento",
        validators: [Validators.required, Validators.minLength(13)],
      },
      { name: "peDireccion", validators: [Validators.required] },
      { name: "scPadre" },
      { name: "scMadre" },
      { name: "scPadrino" },
      { name: "scMadrina" },
      { name: "peSexoId",  validators: [Validators.required, Validators.min(1)] },
    ];

    if(sacramentoTypeId === confirmacionFields.scIdTipoSacramento){
      this.form.patchValue({
        scIdTipoSacramento: confirmacionFields.scIdTipoSacramento
      });

      confirmacionFields.additionalFields.forEach((field) =>{
        if (!this.form.contains(field.name)) {
          const control = new FormControl(
            { value: "", disabled: false },
            field.validators
          );
          this.form.addControl(field.name, control);
        }
      })

      const peFechaNacimientoControl = this.form.get('peFechaNacimiento');
      if (peFechaNacimientoControl) {
        peFechaNacimientoControl.clearValidators();
        peFechaNacimientoControl.updateValueAndValidity();
      }

      const peDireccionControl = this.form.get('peDireccion');
      if (peDireccionControl) {
        peDireccionControl.clearValidators();
        peDireccionControl.updateValueAndValidity();
      }

    }

    if (sacramentoTypeId === matrimonioFields.scIdTipoSacramento) {
      this.form.patchValue({
        scIdTipoSacramento: matrimonioFields.scIdTipoSacramento,
      });

      matrimonioFields.additionalFields.forEach((field) => {
        if (!this.form.contains(field.name)) {
          const control = new FormControl(
            { value: field.defaultValue || "", disabled: !!field.defaultValue },
            field.validators
          );
          this.form.addControl(field.name, control);
          //this.form.addControl(field.name, new FormControl('', field.validators));
        }
      });

      this.form
        .get("peIdTipoDocumentoEsposo")
        ?.valueChanges.subscribe((value) => {
          //console.log(value);
          if (value === 2) {
            this.form.get("peNumeroDocumentoEsposo")?.disable();
            this.generateSecuencial();
          } else {
            this.form.get("peNumeroDocumentoEsposo")?.enable();
          }
        });

      this.form
        .get("peIdTipoDocumentoEsposa")
        ?.valueChanges.subscribe((value) => {
          if (value === 2) {
            this.form.get("peNumeroDocumentoEsposa")?.disable();
            this.generateSecuencial();
          } else {
            this.form.get("peNumeroDocumentoEsposa")?.enable();
          }
        });

      this.form.setValidators([
        atLeastOneFieldRequiredValidator("scPadreEsposo", "scMadreEsposo"),
        atLeastOneFieldRequiredValidator("scPadreEsposa", "scMadreEsposa"),
      ]);

      defaultFields.forEach((field) => {
        if (this.form.contains(field.name)) {
          this.form.get(field.name)?.clearValidators();
          this.form.get(field.name)?.updateValueAndValidity();
          this.form.removeControl(field.name);
        }
      });
    }

    if(sacramentoTypeId != confirmacionFields.scIdTipoSacramento) {
      confirmacionFields.additionalFields.forEach((field) => {
        if (this.form.contains(field.name)) {
          this.form.removeControl(field.name);
        }
      });

      const peFechaNacimientoControl = this.form.get('peFechaNacimiento');
      if(peFechaNacimientoControl){
        peFechaNacimientoControl.setValidators([Validators.required]);
        peFechaNacimientoControl.updateValueAndValidity();
      }

      const peDireccionControl = this.form.get('peDireccion');
      if (peDireccionControl) {
        peDireccionControl.setValidators([Validators.required]);
        peDireccionControl.updateValueAndValidity();
      }

    }

    if(sacramentoTypeId != matrimonioFields.scIdTipoSacramento) {
      defaultFields.forEach((field) => {
        if (!this.form.contains(field.name)) {
          this.form.addControl(
            field.name,
            new FormControl("", field.validators)
          );
        }
      });

      matrimonioFields.additionalFields.forEach((field) => {
        if (this.form.contains(field.name)) {
          this.form.removeControl(field.name);
        }
      });
    }
  }

  listDocumentTypes(): void {
    this._documentTypeService.listDocumentType().subscribe((resp) => {
      this.documentTypes = resp;
    });
  }

  listTipoSacramento(): void {
    this._sacramentoService.TipoSacramentoSelect().subscribe((resp) => {
      this.tipoSacramentoTypes = resp.data;
    });
  }

  listSexType(): void {
    this._sexTypeService.listSexType().subscribe((resp) => {
      this.sexTypes = resp;
    });
  }

  listSacerdote(): void {
    this._sacerdoteService.listSacerdote().subscribe((resp) => {
      this.sacerdotes = resp;
      this.filteredSacerdotes = this.celebranteFilterCtrl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterSacerdotes(value || ""))
      );

      // Verificar los datos filtrados
      this.filteredSacerdotes.subscribe((filtered) => {
        //console.log("Filtered Sacerdotes:", filtered);
      });
    });
  }

  sacramentoSave(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const libro = this.form.get("scLibro").value;
    const folio = this.form.get("scFolio").value;
    const partida = this.form.get("scPartida").value;

    // Combinar los valores en el campo scNumeroPartida
    const scNumeroPartida =
      `L.${libro} - F.${folio} - P.${partida}`.toUpperCase();
    this.form.patchValue({ scNumeroPartida });

    const scIdTipoSacramento = this.form.get("scIdTipoSacramento").value;

    if(scIdTipoSacramento == 4){
      if (this.form.get("peFechaNacimientoEsposo").value === "") {
        this.form.patchValue({ peFechaNacimientoEsposo: "1900-01-01" });
      }
  
      if (this.form.get("peFechaNacimientoEsposa").value === "") {
        this.form.patchValue({ peFechaNacimientoEsposa: "1900-01-01" });
      }
    }

    if(scIdTipoSacramento == 3){
      const fechaNacimientoControl = this.form.get("peFechaNacimiento");
  
      // Verifica si el campo peFechaNacimiento está vacío o es null/undefined
      if (!fechaNacimientoControl.value || fechaNacimientoControl.value === "") {
        this.form.patchValue({ peFechaNacimiento: "1900-01-01" });
      }
    }

    const scIdSacramento = this.data?.scIdSacramento ?? 0;

    if (scIdSacramento > 0) {
      if (scIdTipoSacramento == 4) {
        this.matrimonioEdit(scIdSacramento);
      } else {
        this.sacramentoEdit(scIdSacramento);
      }
    } else {
      if (scIdTipoSacramento == 4) {
        this.matrimonioRegister();
      } else {
        this.sacramentoRegister();
      }
    }
  }

  sacramentoRegister(): void {
    this._sacramentoService
      .SacramentoRegister(this.form.getRawValue())
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        } else {
          this._alert.warn("Atención", resp.message);
        }
      });
  }

  matrimonioRegister(): void {
    this._sacramentoService
      .MatrimonioRegister(this.form.getRawValue())
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        } else {
          this._alert.warn("Atención", resp.message);
        }
      });
  }

  sacramentoById(sacramentoId: number): void {
    this._spinner.show();
    this._sacramentoService.SacramentoById(sacramentoId).subscribe((resp) => {
      if (resp.scIdTipoSacramento == 4) {
        this.matrimoniobyId(sacramentoId);
      }

      const parts = resp.scNumeroPartida.match(
        /L\.(\d+) - F\.(\d+) - P\.(\d+)/i
      );
      const scLibro = parts ? parts[1] : "";
      const scFolio = parts ? parts[2] : "";
      const scPartida = parts ? parts[3] : "";

      const parrocoSeleccionado = this.sacerdotes?.length 
        ? this.sacerdotes.find(s => s.scId === resp.scParrocoId) || null 
        : null;

      this.handleSacramentoTypeChange(resp.scIdTipoSacramento);

      this.form.reset({
        scIdSacramento: resp.scIdSacramento,
        scLibro: scLibro,
        scFolio: scFolio,
        scPartida: scPartida,
        scNumeroPartida: resp.scNumeroPartida,
        scIdTipoSacramento: resp.scIdTipoSacramento,
        peNombre: resp.peNombre,
        peEdad: resp.peEdad === 0 ? null : resp.peEdad,
        peFechaNacimiento: resp.peFechaNacimiento && this.formatDate(resp.peFechaNacimiento) === "1900-01-01" ? "" : resp.peFechaNacimiento,
        peIdTipoDocumento: resp.peIdTipoDocumento,
        peNumeroDocumento: resp.peNumeroDocumento,
        peSexoId: resp.peSexoId,
        peDireccion: resp.peDireccion,
        scPadre: resp.scNombrePadre,
        scMadre: resp.scNombreMadre,
        scPadrino: resp.scNombrePadrino,
        scMadrina: resp.scNombreMadrina,
        scParroco: resp.scParrocoId,
        scFechaSacramento: resp.scFechaSacramento,
        scObservaciones: resp.scObservaciones,
        scLugarBautizo: resp.scLugarBautizo
      });

      this.celebranteFilterCtrl.setValue(parrocoSeleccionado);

      this.form.get("scIdTipoSacramento")?.disable();
      this.form.get("scObservaciones")?.setValidators([Validators.required]);
      this._spinner.hide();
    });
  }

  matrimoniobyId(matrimonioId: number): void {
    this._spinner.show();
    this._sacramentoService.MatrimonioById(matrimonioId).subscribe((resp) => {
      //console.log(resp)

      this.handleSacramentoTypeChange(resp.scIdTipoSacramento);

      const parts = resp.scNumeroPartida.match(
        /L\.(\d+) - F\.(\d+) - P\.(\d+)/i
      );
      const scLibro = parts ? parts[1] : "";
      const scFolio = parts ? parts[2] : "";
      const scPartida = parts ? parts[3] : "";

      const parrocoSeleccionado = this.sacerdotes.find(s => s.scId === resp.scParrocoId) || null;
      
      this.form.patchValue({
        scIdTipoSacramento: resp.scIdTipoSacramento,
        scLibro: scLibro,
        scFolio: scFolio,
        scPartida: scPartida,
        scNumeroPartida: resp.scNumeroPartida,
        peNombreEsposo: resp.peNombreEsposo,
        peNombreEsposa: resp.peNombreEsposa,
        peEdadEsposo: resp.peEdadEsposo === 0 ? null : resp.peEdadEsposo,
        peEdadEsposa: resp.peEdadEsposa === 0 ? null : resp.peEdadEsposa,
        peFechaNacimientoEsposo: resp.peFechaNacimientoEsposo && this.formatDate(resp.peFechaNacimientoEsposo) === "1900-01-01" ? "" : resp.peFechaNacimientoEsposo,
        peFechaNacimientoEsposa: resp.peFechaNacimientoEsposa && this.formatDate(resp.peFechaNacimientoEsposa) === "1900-01-01" ? "" : resp.peFechaNacimientoEsposa,
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
        scParroco: resp.scParrocoId,
        scFechaSacramento: resp.scFechaSacramento,
        scObservaciones: resp.scObservaciones,
      });

      this.celebranteFilterCtrl.setValue(parrocoSeleccionado);

      this.form.get("scIdTipoSacramento")?.disable();
      this.form.get("scObservaciones")?.setValidators([Validators.required]);
      this._spinner.hide();
    });
  }

  sacramentoEdit(scIdSacramento: number): void {
    const formData = this.form.getRawValue();
  
    // Asegúrate de convertir peEdad a string antes de enviarlo
    if (formData.peEdad !== null && formData.peEdad !== undefined) {
      formData.peEdad = formData.peEdad.toString();
    }
    
    this._sacramentoService
      .SacramentoEdit(scIdSacramento, formData)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        } else {
          this._alert.warn("Atención", resp.message);
        }
      });
  }

  matrimonioEdit(scIdSacramento: number): void {
    this._sacramentoService
      .MatrimonioEdit(scIdSacramento, this.form.getRawValue())
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
    let input = event.target.value.replace(/\D/g, "");

    input = input.replace(
      /^(\d{0,5})(\d{0,5})(\d{0,5}).*/,
      "L.$1 - F.$2 - P.$3"
    );

    event.target.value = input;
    this.form.get("scNumeroPartida").setValue(input);
  }

  agregarNuevoCelebrante() {
    this._dialog
      .open(SacerdotesManageComponent, {
        disableClose: true,
        width: "700px",
        maxHeight: "80vh",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.listSacerdote();
        }
      });
  }

  private _filterSacerdotes(value: string | ListSacerdote): ListSacerdote[] {
    const filterValue =
      typeof value === "string"
        ? value.toLowerCase()
        : value
        ? value.scNombre.toLowerCase()
        : "";

    return this.sacerdotes.filter((sacerdote) =>
      sacerdote.scNombre.toLowerCase().includes(filterValue)
    );
  }

  onCelebranteSelected(sacerdote: ListSacerdote) {
    if (sacerdote) {
      this.form.patchValue({ scParroco: sacerdote.scId });
    }
  }

  displayCelebrante(sacerdote?: ListSacerdote): string {
    return sacerdote ? sacerdote.scNombre : "";
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Asegura dos dígitos
    const day = String(d.getDate()).padStart(2, "0"); // Asegura dos dígitos
    return `${year}-${month}-${day}`;
  }
}
