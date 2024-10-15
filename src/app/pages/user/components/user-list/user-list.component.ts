import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { SexTypeService } from '@shared/services/sex-type.service';
import { SexType } from '@shared/models/sex-type.interface';
import { AlertService } from '@shared/services/alert.service';
import { DocumentTypeService } from '@shared/services/document-type.service';
import { DocumentType } from '@shared/models/document-type.interface';

@Component({
  selector: 'vex-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms]
})
export class UserListComponent implements OnInit {

  username: string;
  form: FormGroup;
  sexTypes: SexType[];
  userId: number;
  documentTypes: DocumentType[];

  initForm(): void{
    this.form = this._fb.group({
      usIdUsuario: [, ],  // ID de usuario
      UsNombre: ['', Validators.required],  // Nombre
      UsUserName: ['', Validators.required],  // Nombre de usuario
      usIdGenero: [0, [Validators.required]],
      UsPass: [''],  // Contraseña, normalmente no se muestra o se gestiona diferente
      UsDireccion: ['', Validators.required],  // Dirección
      usFechaNacimiento: ['', Validators.required],  // Fecha de nacimiento
      usIdTipoDocumento: ['', Validators.required],
      UsNumerodocumento: ['', Validators.required],
      usImage: [''],  // Ruta de imagen
      usCreateDate: [''],  // Fecha de creación
      usEstado: [],  // Estado (1 = Activo)
      estadoDescripcion: ['']  // Descripción del estado
    })
  }

  constructor(
    private _userService: UserService,
    private _fb: FormBuilder,
    private _sexTypeService: SexTypeService,
    private _alert: AlertService,
    private _documentTypeService: DocumentTypeService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.listSexType();
    this.listDocumentTypes();

    const token = localStorage.getItem("token")

    if(!token){
      return ""
    }

    var dataUser = JSON.parse(atob(token.split('.')[1]))
    this.username = dataUser.given_name

    this.dataUser(this.username)

  }

  dataUser(userName: string){
    this._userService.getDataUser(userName).subscribe((resp) => {
      //console.log(resp)

      this.userId = resp.usIdUsuario;

      this.form.reset({
        UsNombre: resp.usNombre,
        UsUserName: resp.usUserName,
        UsDireccion: resp.usDireccion,
        usFechaNacimiento: resp.usFechaNacimiento,
        estadoDescripcion: resp.estadoDescripcion,
        usIdGenero: resp.usIdGenero,
        usIdTipoDocumento: resp.usIdTipoDocumento,
        UsNumerodocumento: resp.usNumerodocumento
      })

      this.form.get('UsUserName')?.disable();
    })
  }

  userUpdate(){
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
        console.log(this.form.invalid)
      })
    }

    let currentPassword: string

    this._userService.getDataUser(this.username).subscribe((resp) => {
      currentPassword = resp.usPass;
  
      // Verificar si usPass está vacío
      const newPass = this.form.get('UsPass').value;
      if (!newPass) {
        this.form.patchValue({ UsPass: currentPassword });
      }
  
      this._userService.updateDataUser(this.userId, this.form.getRawValue())
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Excelente", resp.message);
          this.dataUser(this.username)
          //this._dialogRef.close(true);
        } else {
          this._alert.warn("Atención", resp.message);
        }
      });
    });
  }

  selectedImage(file: File){
    this.form.get("usImage").setValue(file);

    console.log(this.form.get("usImage").getRawValue)
  }

  listSexType(): void{
    this._sexTypeService.listSexType().subscribe((resp) =>{
      this.sexTypes = resp
    })
  }

  listDocumentTypes(): void{
    this._documentTypeService.listDocumentType().subscribe((resp) =>{
      this.documentTypes = resp
    })
  }

}
