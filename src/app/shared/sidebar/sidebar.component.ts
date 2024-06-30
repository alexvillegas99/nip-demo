import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuSelectedService } from '../../services/menu-selected.service';
import {
  SELECTED_MENU,
  SELECTED_SUBMENU,
  SELECTED_SUBSUBMENU,
} from '../../core/constants/local-store.constants';
import { CommonModule } from '@angular/common';
import { ConvertDataService } from '../../core/services/convert-data.service';
import { Menu } from '../../core/interfaces/menu.interface';

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
  ) {}

  menu: Menu[] = [
    {
      id: 1,
      icon: 'assets/imgs/icons/panel.png',
      name: 'Portal',
      route: '/',
      isSelected: false,
    },
    {
      id: 2,
      icon: 'https://w7.pngwing.com/pngs/897/885/png-transparent-computer-icons-industry-factory-industrial-building-architectural-engineering-project-thumbnail.png',
      name: 'Equipo Industrial',
      route: '#',
      isSelected: false,
      submenus: [
        {
          icon: 'https://cdn-icons-png.flaticon.com/512/10178/10178345.png',
          name: 'Compresores',
          route: '#',
          isSelected: false,
          submenus: [
            {
              icon: 'https://cdn-icons-png.flaticon.com/512/6900/6900514.png',
              name: 'Mantenimiento',
              route: '/mantenimiento',
              isSelected: false,
            },

            {
              icon: 'https://cdn-icons-png.flaticon.com/512/4363/4363708.png',
              name: 'Gestión',
              route: '/gestion',
              isSelected: false,
            },
          ],
        },
        {
          icon: 'https://www.secoin.com.uy/sites/default/files/motor-electrico.png',
          name: 'Variadores',
          route: '#',
          isSelected: false,
          submenus: [
            {
              icon: 'https://cdn-icons-png.flaticon.com/512/6900/6900514.png',
              name: 'Mantenimiento',
              route: '/mantenimiento',
              isSelected: false,
            },

            {
              icon: 'https://cdn-icons-png.flaticon.com/512/4363/4363708.png',
              name: 'Gestión',
              route: '/gestion',
              isSelected: false,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      icon: 'https://cdn-icons-png.flaticon.com/512/5674/5674015.png',
      name: 'Reportes',
      route: '#',
      isSelected: false,
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
      name: 'Configuración',
      route: '/mantenimiento',
      isSelected: false,
    },
  ];

  ngOnInit(): void {
    this.verificarMenuSeleccionado();
  }
  verificarMenuSeleccionado() {
    const menu1 = localStorage.getItem(SELECTED_MENU);
    const menu2 = localStorage.getItem(SELECTED_SUBMENU);
    const menu3 = localStorage.getItem(SELECTED_SUBSUBMENU);

    if (menu1) {
      const menu = this.convertDataService.convertirStringAJson(menu1);
      this.menu.forEach((menuItem) => {
        if (menuItem.name === menu.name) {
          menuItem.isSelected = true;
        }
        if (menuItem.submenus) {
          menuItem.submenus.forEach((submenuItem) => {
            if (submenuItem.name === menu2) {
              submenuItem.isSelected = true;
            }
            if (submenuItem.submenus) {
              submenuItem.submenus.forEach((subsubmenuItem) => {
                if (subsubmenuItem.name === menu3) {
                  subsubmenuItem.isSelected = true;
                }
              });
            }
          });
        }
      });
    } else {
      this.menu[0].isSelected = true;
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

  goToPage(route: string) {
    console.log(route)
    if (route === '#') return;
    this.router.navigate([route]);
  }
  async toggleMenu(item: any) {
    if (!item.isSelected) {
      localStorage.setItem(SELECTED_MENU, item.name);
      this.closeMenu();
      if (this.verifyExistSubMenu()) {
        await this.delay(800);
      } else {
        this.menuSelectedService.setSelectedItem('sidebar');
        localStorage.removeItem(SELECTED_MENU);
      }
      item.isSelected = true;
      if (!item.submenus) this.changeStatusNav();
      this.menu.forEach((menuItem) => {
        if (menuItem !== item) {
          menuItem.isSelected = false;
        }
      });

      await this.delay(100);
      localStorage.setItem(
        SELECTED_MENU,
        this.convertDataService.convertirJsonAString(item)
      );
    } else {
      this.closeMenu();
      this.menu.forEach((menuItem) => {
        if (menuItem === item) {
          menuItem.isSelected = false;
        }
      });
    }
  }
  changeStatusNav() {
    if (window.innerWidth <= 800) {
      this.sideNavStatus = !this.sideNavStatus;
      this.sideNavStatusChange.emit(this.sideNavStatus);
    }
  }
  closeMenu() {
    try {
      const subMenu = document.querySelector('.sub-menu-item')!;
      subMenu.classList.add('fade-out-animation');
      this.menu.forEach((menuItem) => {
        if (menuItem.submenus) {
          menuItem.submenus.forEach((submenuItem) => {
            submenuItem.isSelected = false;
            if (submenuItem.submenus) {
              submenuItem.submenus.forEach((subsubmenuItem) => {
                subsubmenuItem.isSelected = false;
              });
            }
          });
        }
      });
    } catch (error) {}
  }
  async selectedSubMenu(submenu: any) {
    localStorage.setItem(SELECTED_SUBMENU, submenu.name);
if(submenu.route!=='#'){
  //Retear el menu de nivel 3
  localStorage.removeItem(SELECTED_SUBSUBMENU);
  //Resetear del arreglo
  this.menu.forEach((menuItem) => {
    if (menuItem.submenus) {
      menuItem.submenus.forEach((submenuItem) => {
        if (submenuItem.submenus) {
          submenuItem.submenus.forEach((subsubmenuItem) => {
            subsubmenuItem.isSelected = false;
          });
        }
      });
    }
  });
}
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
  }
  async selectedSubSubMenu(subsubmenu: any) {
    localStorage.setItem(SELECTED_SUBSUBMENU, subsubmenu.name);
    this.menu.forEach((menuItem) => {
      if (menuItem.submenus) {
        menuItem.submenus.forEach((submenuItem) => {
          if (submenuItem.submenus) {
            submenuItem.submenus.forEach((subsubmenuItem) => {
              if (subsubmenuItem !== subsubmenu) {
                subsubmenuItem.isSelected = false;
              } else {
                subsubmenuItem.isSelected = true;
              }
            });
          }
        });
      }
    });
  }
}
