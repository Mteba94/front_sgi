import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IconsService } from '@shared/services/icons.service';
import { ConstanciesService } from 'src/app/pages/constancies/services/constancies.service';
import { SacerdoteResponse } from 'src/app/pages/sacerdotes/models/sacerdote-response.interface';

@Component({
  selector: 'vex-sacramento-signature',
  templateUrl: './sacramento-signature.component.html',
  styleUrls: ['./sacramento-signature.component.scss']
})
export class SacramentoSignatureComponent implements OnInit {

  icClose = IconsService.prototype.getIcon("icClose");

  form: FormGroup;

  sacerdote: SacerdoteResponse[];

  tipoSacramentoTypes = [
    { tsIdTipoSacramento: 'vicario', tsNombre: 'Vicario' },
    { tsIdTipoSacramento: 'parroco', tsNombre: 'Párroco' }
  ];

  initForm(): void {
    this.form = this._fb.group(
      {
        gradoSacerdotal: ["", [Validators.required]],
        peNombre: ["", [Validators.required]],
        tituloSacerdotal: ["vicario", [Validators.required]],
      }
    )
  }
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<SacramentoSignatureComponent>,
    public _constanciaService: ConstanciesService,
    private router: Router,
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
    this.firmaSelect();
  }

  signatureConfirm(){
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue())
    }
  }

  change(){
    this.dialogRef.close(false);
    this.router.navigate(['/sacerdotes']);
  }

  firmaSelect() {
    this._constanciaService.firmaSelect().subscribe((resp) => {
      this.sacerdote = resp;

      this.form.reset({
        gradoSacerdotal: this.sacerdote[0].sacerdoteCategoria,
        peNombre: this.sacerdote[0].sacerdoteNombre,
      })
    });
  }

}
