import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor(private toastr: NgxToastrService) { }

  showSuccess(message: string, title: string = 'Success') {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string = 'Error') {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string = 'Info') {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title);
  }

  showCustom(message: string, title: string, options: any = {}) {
    this.toastr.show(message, title, options);
  }

  clear() {
    this.toastr.clear();
  }

  remove(toastId: number) {
    this.toastr.remove(toastId);
  }
}
