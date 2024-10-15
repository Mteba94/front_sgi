import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: 'rgb(210, 155, 253)',
      width: 430
    })
  }
  
  warn(title: string, message: string){
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonColor: 'rgb(210, 155, 253)',
      width: 430
    })
  }

  error(title: string, message: string, backdrop?: boolean){
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: 'rgb(210, 155, 253)',
      width: 430,
      backdrop: backdrop
    });
  }

  confirm(title: string, text: string): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });
  }

  prompt(title: string, text: string): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      input: 'password',
      inputPlaceholder: 'Ingrese su contraseña actual',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    });
  }
}
