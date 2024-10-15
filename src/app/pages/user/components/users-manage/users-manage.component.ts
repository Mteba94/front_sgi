import { Component, Inject, OnInit } from '@angular/core';
import { IconsService } from '@shared/services/icons.service';
import * as configs from '../../../../../static-data/configs';
import { DocumentType } from '@shared/models/document-type.interface';
import { SexType } from '@shared/models/sex-type.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@shared/services/alert.service';
import { DocumentTypeService } from '@shared/services/document-type.service';
import { SexTypeService } from '@shared/services/sex-type.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'vex-users-manage',
  templateUrl: './users-manage.component.html',
  styleUrls: ['./users-manage.component.scss']
})
export class UsersManageComponent implements OnInit {

  icClose = IconsService.prototype.getIcon('icClose')
  configs = configs

  documentTypes: DocumentType[];
  sexTypes: SexType[];
  form: FormGroup;

  initForm(): void {
    this.form = this._fb.group({
      usIdUsuario: [''],
      usUserName: ['', [Validators.required]],
      usPass: ['', [Validators.required, Validators.minLength(8)]],
      usImage: [''],
      usNombre: ['', [Validators.required]],
      usFechaNacimiento: ['', [Validators.required]],
      usIdTipoDocumento: [0, [Validators.required]],
      usNumerodocumento: ['', [Validators.required]],
      usIdGenero: [0, [Validators.required]],
      usDireccion: ['', [Validators.required]]
    });
  }
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _documentTypeService: DocumentTypeService,
    private _sexTypeService: SexTypeService,
    public _dialogRef: MatDialogRef<UsersManageComponent>,
    private _userService: UserService,
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
    this.listDocumentTypes();
    this.listSexType();

    if(this.data != null){
      //console.log(this.data)
      this.dataUser(this.data.usUserName);
    }
  }

  listDocumentTypes(): void{
    this._documentTypeService.listDocumentType().subscribe((resp) =>{
      this.documentTypes = resp
    })
  }

  listSexType(): void{
    this._sexTypeService.listSexType().subscribe((resp) =>{
      this.sexTypes = resp
    })
  }

  usuarioSave(): void{
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
        console.log(this.form.invalid)
      })
    }

    const scIdUser = this.form.get("usIdUsuario").value;

    if(scIdUser > 0){
      this.userEdit(scIdUser);
    }else{
      this.userRegister();
    }
  }

  dataUser(userName: string){
    this._userService.getDataUser(userName).subscribe((resp) => {

      this.form.reset({
        usNombre: resp.usNombre,
        usUserName: resp.usUserName,
        usDireccion: resp.usDireccion,
        usFechaNacimiento: resp.usFechaNacimiento,
        estadoDescripcion: resp.estadoDescripcion,
        usIdGenero: resp.usIdGenero,
        usIdTipoDocumento: resp.usIdTipoDocumento,
        usNumerodocumento: resp.usNumerodocumento,
        usPass: '',
        usIdUsuario: resp.usIdUsuario
      })

      //this.form.get('UsUserName')?.disable();
    })
  }

  userEdit(userId: number){
    this._userService.updateDataUser(userId, this.form.getRawValue())
    .subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  userRegister(){

  }

}
