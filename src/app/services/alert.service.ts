import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  showErrorMessage(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      iconColor: 'var(--red)',
      confirmButtonColor: 'var(--red)',
      confirmButtonText: 'Aceptar',
    });
  }
  showInfoMessage(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'info',
      iconColor: 'var(--red)',
      confirmButtonColor: 'var(--red)',
      confirmButtonText: 'Aceptar',
    });
  }
  showAlertMessage(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'warning',
      iconColor: 'var(--warning)',
      confirmButtonColor: 'var(--warning)',
      confirmButtonText: 'Aceptar',
    });
  }

  showSuccessMessage(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonColor: 'var(--red)',
      timer: 2000,
    });
  }

  customAlertSweet(icon: SweetAlertIcon, text: string): Promise<boolean> {
    return Swal.fire({
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'red',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result: SweetAlertResult) => {
      return result.isConfirmed;
    });
  }
  showInfoDactilarCode() {
    Swal.fire({
      html: `
       <img
       class="img-modal"
              src="assets/ci.png"
              alt=""
              class="icon-input"
              style="width: 100%"
            />
        `,
      showCloseButton: true,
      confirmButtonColor: 'var(--red)',
      customClass: {
        popup: 'my-swal-popup2',
        confirmButton: 'my-swal-confirm-button',
      },
      confirmButtonText: 'Aceptar',
    });
  }

  showToast(icon: SweetAlertIcon, title: string = '') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
  
}
