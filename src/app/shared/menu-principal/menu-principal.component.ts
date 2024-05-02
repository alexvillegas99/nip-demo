import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { MENU_PORTAL } from '../../core/constants/local-store.constants';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss',
})
export class MenuPrincipalComponent implements OnInit {
  constructor(private readonly router: Router) {}
  ngOnInit(): void {
    const menu = localStorage.getItem(MENU_PORTAL);
    if (menu) {
      this.seleccionarMenu(menu);
    } else {
      this.seleccionarMenu('Inicio');
    }
  }

  goToPage(arg0: any) {
    if (localStorage.getItem(MENU_PORTAL) !== arg0.nombre) {
      localStorage.setItem(MENU_PORTAL, arg0.nombre);
      this.router.navigate([arg0.url]);
      this.seleccionarMenu(arg0.nombre);
    }
  }

  menu: any = [
    {
      nombre: 'Inicio',
      url: '/home',
      icono: 'assets/imgs/icons/home.png',
      isSelected: false,
    },
    {
      nombre: 'Alarmas',
      url: '/alarmas',
      icono: 'assets/imgs/icons/alarmas.png',
      isSelected: false,
    },
    {
      nombre: 'Dashboard',
      url: '/dashboard',
      icono: 'assets/imgs/icons/dashboard.png',
      isSelected: false,
    },
  ];
  seleccionarMenu(nombre: any) {
    this.menu.forEach((element: any) => {
      element.isSelected = element.nombre === nombre;
    });
    console.log(this.menu);
  }
}
