import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
import { GenericValidators } from '@shared/validators/generic-validators';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '@shared/functions/date-format';

@Component({
  selector: 'vex-users-manage',
  templateUrl: './users-manage.component.html',
  styleUrls: ['./users-manage.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class UsersManageComponent implements OnInit {

  icClose = IconsService.prototype.getIcon('icClose')
  configs = configs

  documentTypes: DocumentType[];
  sexTypes: SexType[];
  form: FormGroup;

  isEditMode: boolean = false;

  visible = false;
  inputType = "password";
  icVisibility = IconsService.prototype.getIcon("icVisibility")
  icVisibilityOff = IconsService.prototype.getIcon("icVisibilityOff")
  previewImageUrl: string | null = null;

  initForm(): void {
    this.form = this._fb.group({
      usIdUsuario: [''],
      usUserName: ['', [Validators.required]],
      usPass: ['', [Validators.required, Validators.minLength(8), GenericValidators.passwordValidator]],
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
    private cd: ChangeDetectorRef,
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
    this.listDocumentTypes();
    this.listSexType();

    if (this.data != null) {
      // Modo de edición
      this.isEditMode = true;
      this.dataUser(this.data.usUserName);

      this.form.get('usPass').clearValidators();
      this.form.get('usPass').updateValueAndValidity();
    } else {
      // Modo de agregar
      this.isEditMode = false;

      this.form.get('usPass').setValidators([
        Validators.required,
        Validators.minLength(8),
        GenericValidators.passwordValidator
        //this.passwordValidator // Supongo que tienes un validador personalizado para la contraseña
      ]);
      this.form.get('usPass').updateValueAndValidity();
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

  selectedImage(file: File){
    this.form.get("usImage").setValue(file);
    console.log(this.form.get("usImage").setValue(file))

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImageUrl = e.target.result;
      this.cd.markForCheck(); // Notifica a Angular que la vista necesita actualizarse
    };
    reader.readAsDataURL(file);
  }

  dataUser(userName: string){
    this._userService.getDataUser(userName).subscribe((resp) => {

      this.form.reset({
        usImage: resp.usImage,
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
      this.previewImageUrl = resp.usImage;
      this.cd.markForCheck();
    })
  }

  userEdit(userId: number){

    const formData = new FormData();
    
    // Agregar los datos del formulario al FormData
    formData.append('usIdUsuario', this.form.get('usIdUsuario').value);
    formData.append('usUserName', this.form.get('usUserName').value);
    formData.append('usPass', this.form.get('usPass').value);
    formData.append('usNombre', this.form.get('usNombre').value);
    const fechaNacimiento = new Date(this.form.get('usFechaNacimiento').value).toISOString(); // Convertir a formato ISO
    formData.append('usFechaNacimiento', fechaNacimiento);
    formData.append('usIdTipoDocumento', this.form.get('usIdTipoDocumento').value);
    formData.append('usNumerodocumento', this.form.get('usNumerodocumento').value);
    formData.append('usIdGenero', this.form.get('usIdGenero').value);
    formData.append('usDireccion', this.form.get('usDireccion').value);
  
    // Agregar la imagen si existe
    const fileInput = this.form.get('usImage').value; // Asegúrate de que 'usImage' sea el campo correcto en tu formulario.
    if (fileInput) {
      formData.append('usImage', fileInput); // Agregar archivo
    }

    this._userService.updateDataUser(userId, formData)
    .subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  userRegister() {
    const formData = new FormData();
    
    // Agregar los datos del formulario al FormData
    formData.append('usIdUsuario', this.form.get('usIdUsuario').value);
    formData.append('usUserName', this.form.get('usUserName').value);
    formData.append('usPass', this.form.get('usPass').value);
    formData.append('usNombre', this.form.get('usNombre').value);
    const fechaNacimiento = new Date(this.form.get('usFechaNacimiento').value).toISOString(); // Convertir a formato ISO
    formData.append('usFechaNacimiento', fechaNacimiento);
    formData.append('usIdTipoDocumento', this.form.get('usIdTipoDocumento').value);
    formData.append('usNumerodocumento', this.form.get('usNumerodocumento').value);
    formData.append('usIdGenero', this.form.get('usIdGenero').value);
    formData.append('usDireccion', this.form.get('usDireccion').value);
  
    // Agregar la imagen si existe
    const fileInput = this.form.get('usImage').value; // Asegúrate de que 'usImage' sea el campo correcto en tu formulario.
    if (fileInput) {
      formData.append('usImage', fileInput); // Agregar archivo
    }
  
    this._userService.createUser(formData)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this._dialogRef.close(true);
        } else {
          this._alert.warn("Atención", resp.message);
        }
      });
  }
  

  toggleVisibility(){
    if(this.visible){
      this.inputType = "password";
      this.visible = false;
      this.cd.markForCheck()
    }else {
      this.inputType = "text";
      this.visible = true;
      this.cd.markForCheck()
    }
  }

}
