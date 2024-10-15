import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '../../../../utils/track-by';
import icPerson from '@iconify/icons-ic/twotone-person';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icAccountCircle from '@iconify/icons-ic/twotone-account-circle';
import icMoveToInbox from '@iconify/icons-ic/twotone-move-to-inbox';
import icListAlt from '@iconify/icons-ic/twotone-list-alt';
import icTableChart from '@iconify/icons-ic/twotone-table-chart';
import icCheckCircle from '@iconify/icons-ic/twotone-check-circle';
import icAccessTime from '@iconify/icons-ic/twotone-access-time';
import icDoNotDisturb from '@iconify/icons-ic/twotone-do-not-disturb';
import icOfflineBolt from '@iconify/icons-ic/twotone-offline-bolt';
import icChevronRight from '@iconify/icons-ic/twotone-chevron-right';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icVerifiedUser from '@iconify/icons-ic/twotone-verified-user';
import icLock from '@iconify/icons-ic/twotone-lock';
import icNotificationsOff from '@iconify/icons-ic/twotone-notifications-off';
import { Icon } from '@visurel/iconify-angular';
import { PopoverRef } from '../../../../components/popover/popover-ref';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import data from '@iconify/icons-ic/round-edit';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: Icon;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserDropdownComponent implements OnInit {

  items: MenuItem[] = [];
  filteredItems: MenuItem[] = [];

  // items: MenuItem[] = [
  //   {
  //     id: '1',
  //     icon: icAccountCircle,
  //     label: 'Mi Perfil',
  //     description: 'Informacion Personal',
  //     colorClass: 'text-teal',
  //     route: 'user'
  //   },
  //   {
  //     id: '2',
  //     icon: icListAlt,
  //     label: 'Administracion del Sistema',
  //     description: 'Gestion de Usuarios y Roles',
  //     colorClass: 'text-amber',
  //     route: '/apps/chat'
  //   },
  //   // {
  //   //   id: '3',
  //   //   icon: icListAlt,
  //   //   label: 'My Projects',
  //   //   description: 'Tasks & Active Projects',
  //   //   colorClass: 'text-amber',
  //   //   route: '/apps/scrumboard'
  //   // },
  //   // {
  //   //   id: '4',
  //   //   icon: icTableChart,
  //   //   label: 'Billing Information',
  //   //   description: 'Pricing & Current Plan',
  //   //   colorClass: 'text-purple',
  //   //   route: '/pages/pricing'
  //   // }
  // ];



  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: icCheckCircle,
      colorClass: 'text-green'
    },
    {
      id: 'away',
      label: 'Away',
      icon: icAccessTime,
      colorClass: 'text-orange'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: icDoNotDisturb,
      colorClass: 'text-red'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: icOfflineBolt,
      colorClass: 'text-gray'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  //trackById = trackById;
  icPerson = icPerson;
  icSettings = icSettings;
  icChevronRight = icChevronRight;
  icArrowDropDown = icArrowDropDown;
  icBusiness = icBusiness;
  icVerifiedUser = icVerifiedUser;
  icLock = icLock;
  icNotificationsOff = icNotificationsOff;

  username: string;
  
  constructor(private cd: ChangeDetectorRef,
        public authService: AuthService,
        private popoverRef: PopoverRef<ToolbarUserDropdownComponent>) { }
        

  ngOnInit() {
    const token = localStorage.getItem("token")
    this.initializeMenu();

    if(!token){
      return ""
    }

    var dataUser = JSON.parse(atob(token.split('.')[1]))
    this.username = dataUser.family_name
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
      this.authService.logout();
      this.popoverRef.close();
  }

  initializeMenu(): void {
    const allItems: MenuItem[] = [
      {
        id: '1',
        icon: icAccountCircle,
        label: 'Mi Perfil',
        description: 'Informacion Personal',
        colorClass: 'text-teal',
        route: 'user'
      },
      {
        id: '2',
        icon: icListAlt,
        label: 'Administracion del Sistema',
        description: 'Gestion de Usuarios y Roles',
        colorClass: 'text-amber',
        route: '/user/list'
      }
    ];

    // Filtrar los items basados en el rol del usuario
    this.filteredItems = allItems.filter(item => {
      if (item.id === '2') {
        return this.authService.hasRole(['Administrador']);
      }
      return true; // Para todos los demás items
    });
  }

  trackById(index: number, item: MenuItem): string {
    return item.id;
  }
  
}
