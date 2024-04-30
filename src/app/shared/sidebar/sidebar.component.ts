import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuSelectedService } from '../../services/menu-selected.service';
import { SELECTED_MENU, SELECTED_SUBMENU } from '../../core/constants/local-store.constants';
import { CommonModule } from '@angular/common';
import { ConvertDataService } from '../../core/services/convert-data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() sideNavStatus: boolean = false;
  @Output() logOutMessage = new EventEmitter<boolean>();
  @Output() sideNavStatusChange = new EventEmitter<boolean>();
  logOutStatus: boolean = false;
  menuOpen: boolean = false;

  async verifyMenuOpen() {
    if (this.sideNavStatus) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    private readonly convertDataService: ConvertDataService,

    private readonly menuSelectedService: MenuSelectedService,
    private readonly router: Router
  ) {
    console.log(this.menu);
  }

  menu = [
    {
      id: 1,
      icon: 'assets/imgs/icons/panel.png',
      name: 'Panel de control',
      route: '/',
      isOpen: false,
    },
    {
      id: 2,
      icon: 'https://cdn-icons-png.flaticon.com/512/5511/5511365.png',
      name: 'Demos',
      route: '#',
      isOpen: false,
      submenus: [
        {
          icon: 'https://cdn-icons-png.flaticon.com/512/10178/10178345.png',
          name: 'Compresor',
          route: '/demos/demo1',
          isSelected: false,
        },
        {
          icon: 'https://images.vexels.com/media/users/3/138225/isolated/preview/ccae03070531014e6e972cb68bd512e7-icono-de-transporte-de-logistica-de-envio.png',
          name: 'Logística',
          route: '/demos/demo2',
          isSelected: false,
        },
      
      ],
    },
    {
      id: 3,
      icon: 'https://cdn-icons-png.flaticon.com/512/5674/5674015.png',
      name: 'Reportes',
      route: '#',
      isOpen: false,
      submenus: [
        {
          icon: 'https://cdn-icons-png.flaticon.com/512/5674/5674015.png',
          name: 'Reportes de incidentes',
          route: '/reportes',
          isSelected: false,
        },
      ],
    },
   
    {
      id: 4,
      icon: 'https://cdn-icons-png.flaticon.com/512/2767/2767694.png',
      name: 'Mantenimiento',
      route: '/mantenimiento',
      isOpen: false,
    },
  ];
  menuSelected: any; // Variable para almacenar el valor seleccionado
  menuSelectedSubscription: Subscription; // Para mantener una referencia a la suscripción

  ngOnInit(): void {
    this.menuSelectedSubscription =
      this.menuSelectedService.selectedItem$.subscribe((selectedItem) => {
        this.menuSelected = selectedItem;
        if (this.menuSelected) {
          this.handleSelectedItemChange(this.menuSelected);
        }
      });
    this.verifySelectedMenu();
  }

  async toggleMenu(item: any) {
    if (!item.isOpen) {
      this.closeMenu();
      if (this.verifyExistSubMenu()) {
        await this.delay(800);
      } else {
        this.menuSelectedService.setSelectedItem('sidebar');
        localStorage.removeItem(SELECTED_MENU);
      }
      item.isOpen = true;
      if (!item.submenus) this.changeStatusNav();
      this.menu.forEach((menuItem) => {
        if (menuItem !== item) {
          menuItem.isOpen = false;
        }
      });

      await this.delay(100);
      localStorage.setItem(
        SELECTED_MENU,
        this.convertDataService.convertirJsonAString(item)
      );
    }
  }

  verifyExistSubMenu() {
    try {
      const selectedMenu = this.convertDataService.convertirStringAJson(
        localStorage.getItem(SELECTED_MENU) || ''
      );
      if (selectedMenu.submenus) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async selectedSubMenu(submenu: any) {
    this.menu.forEach((menuItem) => {
      if (menuItem.submenus) {
        menuItem.submenus.forEach((submenuItem) => {
          if (submenuItem !== submenu) {
            submenuItem.isSelected = false;
          } else {
            submenuItem.isSelected = true;
          }
        });
      }
    });

    this.changeStatusNav();
    await this.delay(100);
    localStorage.removeItem(SELECTED_SUBMENU);
    localStorage.setItem(
      SELECTED_SUBMENU,
      this.convertDataService.convertirJsonAString(submenu)
    );
    this.menuSelectedService.setSelectedItem('sidebar');
  }
  changeStatusNav() {
    if (window.innerWidth <= 800) {
      this.sideNavStatus = !this.sideNavStatus;
      this.sideNavStatusChange.emit(this.sideNavStatus);
    }
  }
  public resetMenu() {
    this.menu.forEach((menuItem) => {
      menuItem.isOpen = false;
      if (menuItem.submenus) {
        menuItem.submenus.forEach((submenuItem) => {
          submenuItem.isSelected = false;
        });
      }
    });
  }

  closeMenu() {
    try {
      const subMenu = document.querySelector('.sub-menu-item')!;
      subMenu.classList.add('fade-out-animation');
      this.menu.forEach((menuItem) => {
        if (menuItem.submenus) {
          menuItem.submenus.forEach((submenuItem) => {
            submenuItem.isSelected = false;
          });
        }
      });
    } catch (error) {}
  }
  logOutShowMessage() {
    this.logOutStatus = !this.logOutStatus;
    this.logOutMessage.emit(this.logOutStatus);
    this.logOutStatus = !this.logOutStatus;
  }
  goToPage(route: string) {
    if (route === '#') return;
    this.router.navigate([route]);
  }
  verifySelectedMenu() {
    try {
      const selectedMenu = this.convertDataService.convertirStringAJson(
        localStorage.getItem(SELECTED_MENU) || ''
      );
      const selectedSubMenu = this.convertDataService.convertirStringAJson(
        localStorage.getItem(SELECTED_SUBMENU) || ''
      );

      if (selectedMenu) {
        this.menu.forEach((menuItem) => {
          if (menuItem.id !== selectedMenu.id) {
            menuItem.isOpen = false;
          } else {
            menuItem.isOpen = true;
            if (menuItem.submenus) {
              menuItem.submenus.forEach((submenuItem) => {
                if (submenuItem.name !== selectedSubMenu.name) {
                  submenuItem.isSelected = false;
                } else {
                  submenuItem.isSelected = true;
                }
              });
            }
          }
        });
      }
    } catch (error) {}
  }
  handleSelectedItemChange(selectedItem: any) {
    if (selectedItem === 'navbar') {
      this.resetMenu();
      localStorage.removeItem(SELECTED_MENU);
      localStorage.removeItem(SELECTED_SUBMENU);
    }
  }
}
