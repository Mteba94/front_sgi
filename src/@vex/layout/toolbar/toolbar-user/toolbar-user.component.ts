import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PopoverService } from '../../../components/popover/popover.service';
import { ToolbarUserDropdownComponent } from './toolbar-user-dropdown/toolbar-user-dropdown.component';
import icPerson from '@iconify/icons-ic/twotone-person';
import { UserService } from 'src/app/pages/user/services/user.service';

@Component({
  selector: 'vex-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserComponent implements OnInit {

  dropdownOpen: boolean;
  icPerson = icPerson;
  
  username: string;
  userImageUrl: string | null = null;

  constructor(private popover: PopoverService,
              private cd: ChangeDetectorRef,
              private _userService: UserService
            ) { }

  ngOnInit() {
    const token = localStorage.getItem("token")

    if(!token){
      return ""
    }

    var dataUser = JSON.parse(atob(token.split('.')[1]))
    this.username = dataUser.given_name
    this.getUser();
  }

  getUser(){
    this._userService.getDataUser(this.username).subscribe((data) => {
      //console.log(data)
      if (data && data.usImage) {
        this.userImageUrl = data.usImage;
        this.cd.markForCheck();
      }
    })  
  }

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    const popoverRef = this.popover.open({
      content: ToolbarUserDropdownComponent,
      origin: originRef,
      offsetY: 12,
      position: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
}
