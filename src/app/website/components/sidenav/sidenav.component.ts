import { map } from 'rxjs';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { fadeInOut, INavbarData } from './helper';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NAVBARDATA } from './nav-data';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { AuthService } from '../../../services/auth.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
  standalone: true,
  imports: [RouterModule, CommonModule, SublevelMenuComponent],
  encapsulation: ViewEncapsulation.None, // Para desactivar el encapsulamiento
})
export class SidenavComponent implements OnInit {
  @Input() navDatas: any;
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  navData: any = [];
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  constructor(
    private readonly router: Router,
    private readonly _authService: AuthService
  ) {}

  ngOnInit(): void {
    for (let nav of NAVBARDATA) {
      if (nav.roles?.includes(this._authService.getRole())) {
        this.navData.push(nav);
      }
    }
    this.screenWidth = window.innerWidth;
  }

  busqueda(event: any) {
    console.log(event, 'evento....');
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  handleClick(item: INavbarData): void {
    // this.toggleCollapse();
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    } else {
      this.router.navigate([item.routeLink]).then();
    }
  }
  cerrarSesion(): void {
      this._authService.logout();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
  }
}
