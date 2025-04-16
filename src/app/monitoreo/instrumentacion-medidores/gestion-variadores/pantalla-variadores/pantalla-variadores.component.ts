import { Component } from '@angular/core';
import { DataPlcService } from '../../../../services/data-plc.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { MENU_PORTAL } from '../../../../core/constants/local-store.constants';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pantalla-variadores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './pantalla-variadores.component.html',
  styleUrl: './pantalla-variadores.component.scss'
})
export class PantallaVariadoresComponent {

 menu: any = [
    {
      nombre: 'VARIADOR',
      path: 'variador',
      isSelected: false,
      productIDNumber: 15235,
    }
  ];

  screen1 = true;
  screen2 = false;
  screen3 = false;
  mantenimientoSeleccionado: any;



  constructor(
    private readonly router: Router,
  ) {
  }

  cambiarPantalla(screen: any) {
    if (screen === 1) {
      this.screen1 = true;
      this.screen2 = false;
      this.screen3 = false;
    } else if (screen === 2) {
      this.screen1 = false;
      this.screen2 = true;
      this.screen3 = false;
    } else if (screen === 3) {
      this.screen1 = false;
      this.screen2 = false;
      this.screen3 = true;
    }
  }

  seleccionarMantenimiento(data: any) {
    console.log(data);
    this.mantenimientoSeleccionado = data;
    this.cambiarPantalla(3);
  }

  goToPage(arg0: any) {
    if (localStorage.getItem(MENU_PORTAL) !== arg0.nombre) {
      localStorage.setItem(MENU_PORTAL, arg0.nombre);
      this.router.navigate([arg0.url]);
      this.seleccionarMenu(arg0.nombre);
    }
  }

  seleccionarMenu(nombre: any) {
    this.menu.forEach((element: any) => {
      element.isSelected = element.nombre === nombre;

      if (element.isSelected) this.router.navigate([element.url]);
    });
  }
}

