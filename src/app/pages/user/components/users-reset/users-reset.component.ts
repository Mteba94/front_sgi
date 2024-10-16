import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '@shared/services/alert.service';
import { UserService } from '../../services/user.service';
import { BaseResponse } from '@shared/models/base-api-response.interface';

@Component({
  selector: 'vex-users-reset',
  templateUrl: './users-reset.component.html',
  styleUrls: ['./users-reset.component.scss']
})
export class UsersResetComponent implements OnInit {

  newPassword: string = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _alert: AlertService,
    public _dialogRef: MatDialogRef<UsersResetComponent>,
    public _userService: UserService
  ) { }

  ngOnInit(): void {
    if(this.data != null){
      //console.log(this.data)
      this.resetUser(this.data.usIdUsuario);
    }
  }

  resetUser(userId: number){
    this._userService.userReset(userId).subscribe((resp) => {
      this.newPassword = resp.data
      if(resp.isSuccess){
        this._alert.success("Atencion", "Se ha reestablecido la contraseña.")
      }else{
        this._alert.warn("Atencion", "No se ha podido reestablecer la contraseña.")
        }
      })
  }

  onClose(){
    this._dialogRef.close();
  }

}
