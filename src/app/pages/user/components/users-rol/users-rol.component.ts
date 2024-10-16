import { Component, Inject, OnInit } from '@angular/core';
import { IconsService } from '@shared/services/icons.service';
import * as configs from '../../../../../static-data/configs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@shared/services/alert.service';
import { RolService } from '@shared/services/rol.service';
import { Rol, RolAssing } from '@shared/models/rol.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'vex-users-rol',
  templateUrl: './users-rol.component.html',
  styleUrls: ['./users-rol.component.scss']
})
export class UsersRolComponent implements OnInit {

  icClose = IconsService.prototype.getIcon('icClose')
  configs = configs
  form: FormGroup;

  rolTypes: Rol[];

  initForm(): void {
    this.form = this._fb.group({
      usIdUsuario: [''],
      usUserName: ['', [Validators.required]],
      usNombre: ['', [Validators.required]],
      usRolId: ['', [Validators.required]],
    });
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _rolSelect: RolService,
    public _dialogRef: MatDialogRef<UsersRolComponent>,
    private authService: AuthService,
    public _spinner: NgxSpinnerService,
  ) { 
    this.initForm();
  }

  username: string;

  ngOnInit(): void {
    this.listRolTypes();

    if(this.data != null){
      //console.log(this.data)
      this.dataUser(this.data);
    }

    const token = localStorage.getItem("token")
    var dataUser = JSON.parse(atob(token.split('.')[1]))
    this.username = dataUser.nameid

  }

  dataUser(data: any){

    this.form.reset({
      usIdUsuario: this.data.usIdUsuario,
      usNombre: this.data.usNombre,
      usUserName: this.data.usUserName,
      usRolId: this.data.userIdRole
    })

    this.form.get('usNombre')?.disable();
    this.form.get('usUserName')?.disable();

  }

  listRolTypes(){
    this._rolSelect.listRolType().subscribe((resp) =>{
      this.rolTypes = resp
    })
  }

  rolSave(){

    this._alert.prompt("Atención", "Ingrese su contraseña actual").then(currentPass => {
      
      const loginData = {
        username: this.username,
        password: currentPass.value
      };

      this._spinner.show();
      this.authService.login(loginData).subscribe((resp) => {
        this._spinner.hide();
        if (resp.isSuccess) {
          this.rolAsign();
        } else {
          this._alert.error("Credenciales Incorrectas", resp.message, false);
        }
      });
    });

  }

  rolAsign(){
    const data: RolAssing ={
      userId: this.form.get('usIdUsuario')?.value,
      roleId: this.form.get('usRolId')?.value
    }

    this._rolSelect.assignRol(data).subscribe((resp) =>{
      if (resp.isSuccess) {
        this._alert.success("Excelente", resp.message);
        this._dialogRef.close(true);
      } else {
        this._alert.warn("Atención", resp.message);
      }
    })
  }

}
