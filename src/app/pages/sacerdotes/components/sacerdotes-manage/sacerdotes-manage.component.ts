import { Component, Inject, OnInit } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close'
import * as configs from '../../../../../static-data/configs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CatSacerdoteService } from '@shared/services/cat-sacerdote.service';
import { CatSacerdote } from '@shared/models/cat-sacerdote.interface';
import { SacerdoteService } from '../../services/sacerdote.service';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'vex-sacerdotes-manage',
  templateUrl: './sacerdotes-manage.component.html',
  styleUrls: ['./sacerdotes-manage.component.scss']
})
export class SacerdotesManageComponent implements OnInit {

  icClose = icClose
  configs = configs

  catSacerdotes: CatSacerdote[];

  form: FormGroup

  initForm(): void{
    this.form = this._fb.group({
      ScId: [, ],
      sacerdoteNombre: ['', [Validators.required]],
      sacerdoteIdCategoria: ['', [Validators.required]]
    })
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _catSacerdotService: CatSacerdoteService,
    private _sacerdoteService: SacerdoteService,
    public _dialogRef: MatDialogRef<SacerdotesManageComponent>,
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
    this.listCatSacerdote();

    if(this.data != null){
      this.sacerdoteById(this.data.sacerdoteId);
    }
  }

  sacerdoteSave(): void {
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
        console.log(this.form.invalid)
      })
    }

    const scIdSacerdote = this.form.get("ScId").value;

    if(scIdSacerdote > 0){
      this.sacerdoteEdit(scIdSacerdote);
    }else{
      this.sacerdoteRegister();
    }
  }

  sacerdoteById(sacerdoteId: number): void {
    this._sacerdoteService.SacerdoteById(sacerdoteId).subscribe((resp) => {
      this.form.reset({
        ScId: resp.sacerdoteId,
        sacerdoteNombre: resp.sacerdoteNombre,
        sacerdoteIdCategoria: resp.sacerdoteIdCategoria
      })
    })
  }

  sacerdoteEdit(sacerdoteId: number): void {
    this._sacerdoteService.SacerdoteUpdate(sacerdoteId, this.form.value).subscribe((resp) => {
      if(resp.isSuccess){
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }else{
        this._alert.warn("Atención", resp.message)
      }
    })
  }

  sacerdoteRegister(): void {
    this._sacerdoteService.SacerdoteRegister(this.form.value).subscribe((resp) => {
      if(resp.isSuccess){
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      }else{
        this._alert.warn("Atención", resp.message)
      }
    })
  }

  listCatSacerdote(){
    this._catSacerdotService.listCatSacerdote().subscribe((resp) =>{
      this.catSacerdotes = resp;
    })
  }

}
