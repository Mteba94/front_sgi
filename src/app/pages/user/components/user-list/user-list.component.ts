import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';

@Component({
  selector: 'vex-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms]
})
export class UserListComponent implements OnInit {

  username: string;
  form: FormGroup;

  initForm(): void{
    this.form = this._fb.group({
      usIdUsuario: [1, Validators.required],  // ID de usuario
      usNombre: ['', Validators.required],  // Nombre
      usUserName: ['', Validators.required],  // Nombre de usuario
      usPass: [''],  // Contraseña, normalmente no se muestra o se gestiona diferente
      usDireccion: ['', Validators.required],  // Dirección
      usFechaNacimiento: ['', Validators.required],  // Fecha de nacimiento
      usImage: [''],  // Ruta de imagen
      usCreateDate: [''],  // Fecha de creación
      usEstado: [],  // Estado (1 = Activo)
      estadoDescripcion: ['']  // Descripción del estado
    })
  }

  constructor(
    private _userService: UserService,
    private _fb: FormBuilder,
  ) {
    this.initForm();
  }

  ngOnInit() {
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
      console.log(resp)

      this.form.reset({
        usNombre: resp.usNombre,
        usUserName: resp.usUserName,
        usDireccion: resp.usDireccion,
        usFechaNacimiento: resp.usFechaNacimiento,
        estadoDescripcion: resp.estadoDescripcion
      })

      this.form.get('usUserName')?.disable();
    })
  }

  userUpdate(){

  }

  selectedImage(file: File){
    this.form.get("usImage").setValue(file);
  }

}
