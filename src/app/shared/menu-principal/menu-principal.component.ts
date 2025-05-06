import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MENU_PORTAL } from '../../core/constants/local-store.constants';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss',
})
export class MenuPrincipalComponent implements OnInit {
  private readonly router = inject(Router);

  menu: any = [
    {
      nombre: 'INICIO',
      url: './portal/home',
      icono: 'assets/imgs/icons/home.png',
      isSelected: false,
    },
    {
      nombre: 'INDICADORES',
      url: './portal/dashboard',
      icono: 'assets/imgs/icons/dashboard.png',
      isSelected: false,
    },
    {
      nombre: 'ALARMAS',
      url: './portal/alarmas',
      icono: 'assets/imgs/icons/alarmas.png',
      isSelected: false,
    },
   
  ];
  
  constructor() {}
  
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

  seleccionarMenu(nombre: any) {
    this.menu.forEach((element: any) => {
      element.isSelected = element.nombre === nombre;

      if(element.isSelected) this.router.navigate([element.url]);

    });
    
  }
}
