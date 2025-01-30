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
import moment from 'moment';
import { SacerdoteSelectService } from '@shared/services/sacerdote-select.service';
import { ListSacerdote } from '@shared/models/list-sacerdote.interface';
import { SacerdotesManageComponent } from 'src/app/pages/sacerdotes/components/sacerdotes-manage/sacerdotes-manage.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: "vex-sacramento-manage",
  templateUrl: "./sacramento-manage.component.html",
  styleUrls: ["./sacramento-manage.component.scss"],
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

  initialDate = "2023-01-01";
  maxDate = moment();

  initForm(): void {
    this.form = this._fb.group(
      {
        scIdSacramento: [,],
        scLibro: ["", [Validators.required]],
        scFolio: ["", [Validators.required]],
        scPartida: ["", [Validators.required]],
        scNumeroPartida: [""],
        scIdTipoSacramento: [0, [Validators.required]],
        peNombre: ["", [Validators.required]],
        peFechaNacimiento: [null, [Validators.required]],
        peIdTipoDocumento: [0, [Validators.required]],
        peNumeroDocumento: [, [Validators.required, Validators.minLength(13)]],
        peSexoId: [0, [Validators.required]],
        peDireccion: ["", [Validators.required]],
        scPadre: [""],
        scMadre: [""],
        scPadrino: [""],
        scMadrina: [""],
        scParroco: ["", [Validators.required]],
        scFechaSacramento: ["", [Validators.required]],
        scObservaciones: [""],
      },
      {
        validator: [
          atLeastOneFieldRequiredValidator("scPadre", "scMadre"),
          atLeastOneFieldRequiredValidator("scPadrino", "scMadrina"),
        ],
      }
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _sacramentoService: SacramentoService,
    public _dialogRef: MatDialogRef<SacramentoManageComponent>,
    private _documentTypeService: DocumentTypeService,
    private _sexTypeService: SexTypeService,
    private _sacerdoteService: SacerdoteSelectService,
    public _dialog: MatDialog
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.listDocumentTypes();
    this.listTipoSacramento();
    this.listSexType();
    this.listSacerdote();

    this.form.get("peIdTipoDocumento")?.valueChanges.subscribe((value) => {
      if (value === 2) {
        this.form.get("peNumeroDocumento")?.disable();
        this.generateSecuencial();
      } else {
        this.form.get("peNumeroDocumento")?.enable();
      }
    });

    if (this.data != null) {
      //console.log(this.data.scIdSacramento)
      this.sacramentoById(this.data.scIdSacramento);
    } else {
      // Aplicar la configuración del formulario para el tipo de sacramento por defecto (si lo hay)
      //console.log(this.data.scIdSacramento);
      this.handleSacramentoTypeChange(this.form.get("scMatrimonioId")?.value);
    }
  }

  generateSecuencial(): void {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Últimos dos dígitos del año
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Mes con dos dígitos
    const day = ("0" + date.getDate()).slice(-2); // Día con dos dígitos
    const hour = ("0" + date.getHours()).slice(-2); // Hora con dos dígitos
    const minute = ("0" + date.getMinutes()).slice(-2); // Minutos con dos dígitos
    const second = ("0" + date.getSeconds()).slice(-2); // Segundos con dos dígitos
    const secuencial = `${year}${month}${day}${hour}${minute}${second.slice(
      -2
    )}`;
    const secuencialEsp = (parseInt(secuencial) + 1).toString();
    this.form.patchValue({
      peNumeroDocumento: secuencial,
      peNumeroDocumentoEsposo: secuencial,
      peNumeroDocumentoEsposa: secuencialEsp,
    });
  }

  handleSacramentoTypeChange(sacramentoTypeId: number): void {
    // if(sacramentoTypeId === 2){
    //   this.form.get("scPadrino")?.enable();
    // }
    const matrimonioFields = {
      scIdTipoSacramento: 4,
      additionalFields: [
        { name: "peNombreEsposo", validators: [Validators.required] },
        { name: "peNombreEsposa", validators: [Validators.required] },
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
      { name: "peSexoId" },
    ];

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
          console.log(value);
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
    } else {
      // Restablecer los campos por defecto si no es matrimonio
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

      this.form.setValidators([
        atLeastOneFieldRequiredValidator("scPadre", "scMadre"),
        atLeastOneFieldRequiredValidator("scPadrino", "scMadrina"),
      ]);

      // Eliminar los campos específicos de matrimonio

      // Eliminar los validadores específicos para matrimonio
      this.form.clearValidators();
      this.form.updateValueAndValidity();
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
        //console.log(this.form.getRawValue());
      });
    }

    //console.log(this.form.value)

    const libro = this.form.get("scLibro").value;
    const folio = this.form.get("scFolio").value;
    const partida = this.form.get("scPartida").value;

    // Combinar los valores en el campo scNumeroPartida
    const scNumeroPartida =
      `L.${libro} - F.${folio} - P.${partida}`.toUpperCase();
    this.form.patchValue({ scNumeroPartida });

    //console.log(scNumeroPartida)

    const scIdSacramento = this.form.get("scIdSacramento").value;

    const scIdTipoSacramento = this.form.get("scIdTipoSacramento").value;

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

      //console.log(resp.scNumeroPartida,parts, scLibro, - scFolio, - scPartida )
      const parrocoSeleccionado = this.sacerdotes.find(s => s.scId === resp.scParrocoId) || null;
      //console.log(parrocoSeleccionado);

      this.form.reset({
        scIdSacramento: resp.scIdSacramento,
        scLibro: scLibro,
        scFolio: scFolio,
        scPartida: scPartida,
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
        scParroco: parrocoSeleccionado,
        scFechaSacramento: resp.scFechaSacramento,
        scObservaciones: resp.scObservaciones,
      });

      this.celebranteFilterCtrl.setValue(parrocoSeleccionado);

      this.form.get("scIdTipoSacramento")?.disable();
      this.form.get("scObservaciones")?.setValidators([Validators.required]);
    });
  }

  matrimoniobyId(matrimonioId: number): void {
    this._sacramentoService.MatrimonioById(matrimonioId).subscribe((resp) => {
      console.log(resp);

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
        scParroco: resp.scParrocoId,
        scFechaSacramento: resp.scFechaSacramento,
        scObservaciones: resp.scObservaciones,
      });

      this.celebranteFilterCtrl.setValue(parrocoSeleccionado);

      this.form.get("scIdTipoSacramento")?.disable();
      this.form.get("scObservaciones")?.setValidators([Validators.required]);
    });
  }

  sacramentoEdit(scIdSacramento: number): void {
    this._sacramentoService
      .SacramentoEdit(scIdSacramento, this.form.getRawValue())
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

  private _filterSacerdotes(value: string): ListSacerdote[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.sacerdotes.filter((sacerdote) =>
      sacerdote.scNombre.toLowerCase().includes(filterValue)
    );
  }

  onCelebranteSelected(sacerdote: any) {
    console.log(sacerdote);
    if (sacerdote) {
      this.form.patchValue({ scParroco: sacerdote.scId });
    }
  }

  displayCelebrante(sacerdote?: any): string {
    return sacerdote && sacerdote.scNombre ? sacerdote.scNombre : '';
  }
}
