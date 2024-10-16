import { Component, OnInit } from '@angular/core';
import { CustomTitleService } from '@shared/services/custom-title.service';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { componentSettings } from './user-all-config';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user-response.interface';
import { RowClick } from '@shared/models/row-click.interface';
import { UsersManageComponent } from '../users-manage/users-manage.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsersRolComponent } from '../users-rol/users-rol.component';
import { UsersResetComponent } from '../users-reset/users-reset.component';
import { AlertService } from '@shared/services/alert.service';

@Component({
  selector: 'vex-users-all',
  templateUrl: './users-all.component.html',
  styleUrls: ['./users-all.component.scss'],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms]
})
export class UsersAllComponent implements OnInit {

  component: any

  constructor(
    customTitle: CustomTitleService,
    public _userService: UserService,
    public _dialog: MatDialog,
    public _alert: AlertService
  ) {
    customTitle.set("Usuarios");
  }

  ngOnInit(): void {
    this.component = componentSettings
  }

  setMenu(value: number) {
    this.component.filters.stateFilter = value
    this.formatGetInputs()
  }

  formatGetInputs(){
    let inputs = {
      numFilter: 0,
      textFilter: "",
      stateFilter: null,
      startDate: null,
      endDate: null
    }

    if(this.component.filters.numFilter != ""){
      inputs.numFilter = this.component.filters.numFilter
      inputs.textFilter = this.component.filters.textFilter
    }

    if(this.component.filters.stateFilter != null){
      inputs.stateFilter = this.component.filters.stateFilter
    }

    if(this.component.filters.refresh){
      let random = Math.random();
      this.component.filters.refresh = false;
    }

    if(this.component.filters.startDate != "" && this.component.filters.endDate != ""){
      inputs.startDate = this.component.filters.startDate
      inputs.endDate = this.component.filters.endDate
    }
    
    this.component.getInputs = inputs
  }


  openDialogRegister(){
    this._dialog.open(UsersManageComponent, {
      disableClose: true,
      width: "700px",
      maxHeight: '80vh'
    })
    .afterClosed()
    .subscribe((res) => {
      if(res){
        this.setGetInputsUser(true)
      }
    })
  }

  setGetInputsUser(refresh: boolean){
    this.component.filters.refresh = refresh;
    this.formatGetInputs()
  }

  rowClick(rowClick: RowClick<UserResponse>){

    let action = rowClick.action;
    let user = rowClick.row;

    switch(action){
      case "edit":
        this.UserEdit(user);
        break
      case "rol":
        this.UserRol(user)
        break
      case "reset":
        this.userReset(user)
        break
    }

    return false
  }

  UserEdit(userData: UserResponse){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = userData

    this._dialog.open(UsersManageComponent, {
      data: userData,
      disableClose: true,
      width: "700px",
      maxHeight: '80vh'
    })
    .afterClosed().subscribe(
      (res) => {
        if (res) {
          this.formatGetInputs()
        }
      }
    )
  }

  UserRol(userData: UserResponse){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = userData

    this._dialog.open(UsersRolComponent, {
      data: userData,
      disableClose: true,
      width: "700px",
      maxHeight: '80vh'
    })
    .afterClosed().subscribe(
      (res) => {
        if (res) {
          this.formatGetInputs()
        }
      }
    )
  }

  userReset(userData: UserResponse){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = userData
    this._alert.confirm("Confirmación", "¿Desea reestabler la contraseña?").then(result => {
      if (result.value) {
        this._dialog.open(UsersResetComponent, {
          data: userData,
          disableClose: true,
          width: "400px",
          maxHeight: '80vh'
        })
        .afterClosed().subscribe(
          (res) => {
            if (res) {
              this.formatGetInputs()
            }
          }
        )
      }
    })
  }

}
