import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IconsService } from '@shared/services/icons.service';

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

  visible = false;
  inputType = "password";
  icVisibility = IconsService.prototype.getIcon("icVisibility")
  icVisibilityOff = IconsService.prototype.getIcon("icVisibilityOff")

  initForm(): void {
    this.form = this._fb.group({
      usIdUsuario: [, ],
      UsNombre: ['', Validators.required],
      UsUserName: ['', Validators.required],
      usIdGenero: [0, Validators.required],
      UsPass: ['', []],  // Nueva contraseña
      confirmPass: ['', []],  // Confirmar contraseña
      UsDireccion: ['', Validators.required],
      usFechaNacimiento: ['', Validators.required],
      usIdTipoDocumento: ['', Validators.required],
      UsNumerodocumento: ['', Validators.required],
      usImage: [''],
      usCreateDate: [''],
      usEstado: [],
      estadoDescripcion: ['']
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('UsPass').value;
    const confirmPass = group.get('confirmPass').value;
    return password && confirmPass && password !== confirmPass ? { passwordMismatch: true } : null;
  }

  constructor(
    private _userService: UserService,
    private _fb: FormBuilder,
    private _sexTypeService: SexTypeService,
    private _alert: AlertService,
    private _documentTypeService: DocumentTypeService,
    private authService: AuthService,
    public _spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
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

    this.form.get('UsPass').valueChanges.subscribe(() => {
      this.form.updateValueAndValidity(); // Actualiza las validaciones
    });

    this.form.get('confirmPass').valueChanges.subscribe(() => {
      this.form.updateValueAndValidity(); // Actualiza las validaciones
    });

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

  userUpdate(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  
    const newPass = this.form.get('UsPass').value;
    const confirmPass = this.form.get('confirmPass').value;
    const username = this.form.get('UsUserName').value; // Asegúrate de que el campo 'username' esté en el formulario
  
    if (newPass) {
      // Validar si las contraseñas coinciden
      if (newPass !== confirmPass) {
        this._alert.warn("Atención", "Las contraseñas no coinciden.");
        return;
      }
    } else {
      // Si no hay nueva contraseña, solicitar la contraseña actual
      this._alert.prompt("Atención", "Ingrese su contraseña actual").then(currentPass => {
        
        if (!currentPass) {
          this._alert.warn("Atención", "Debe proporcionar la contraseña actual.");
          return;
        }
  
        // Mostrar el spinner mientras se valida la contraseña actual
        this._spinner.show();
  
        // Crear el objeto con username y currentPass
        const loginData = {
          username: username,
          password: currentPass.value
        };
  
        // Enviar solo username y contraseña al servicio de autenticación
        this.authService.login(loginData).subscribe((resp) => {
          this._spinner.hide();
          if (resp.isSuccess) {
            this.form.get('UsPass').setValue(currentPass.value);
            this.saveUserData();
          } else {
            this._alert.error("Credenciales Incorrectas", resp.message, false);
          }
        });
      });
      return;
    }
    this.saveUserData();
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

  saveUserData(): void {
    this._alert.confirm("Confirmación", "¿Desea guardar los cambios?").then(result => {
      if (result.isConfirmed) {

        const formData = new FormData();
    
        // Agregar los datos del formulario al FormData
        formData.append('usIdUsuario', this.form.get('usIdUsuario').value);
        formData.append('usUserName', this.form.get('UsUserName').value);
        formData.append('usPass', this.form.get('UsPass').value);
        formData.append('usNombre', this.form.get('UsNombre').value);
        const fechaNacimiento = new Date(this.form.get('usFechaNacimiento').value).toISOString();
        formData.append('usFechaNacimiento', fechaNacimiento);
        formData.append('usIdTipoDocumento', this.form.get('usIdTipoDocumento').value);
        formData.append('usNumerodocumento', this.form.get('UsNumerodocumento').value);
        formData.append('usIdGenero', this.form.get('usIdGenero').value);
        formData.append('usDireccion', this.form.get('UsDireccion').value);
      
        // Agregar la imagen si existe
        const fileInput = this.form.get('usImage').value; // Asegúrate de que 'usImage' sea el campo correcto en tu formulario.
        if (fileInput) {
          formData.append('usImage', fileInput); // Agregar archivo
        }

        this._spinner.show();
        this._userService.updateDataUser(this.userId, formData)
          .subscribe((resp) => {
            this._spinner.hide();
            if (resp.isSuccess) {
              this._alert.success("Excelente", resp.message);
              this.dataUser(this.username);
            } else {
              this._alert.warn("Atención", resp.message);
            }
          });
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
