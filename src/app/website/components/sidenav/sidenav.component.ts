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
  imports: [RouterModule, RouterOutlet, CommonModule, SublevelMenuComponent, SearchComponent],
  encapsulation: ViewEncapsulation.None // Para desactivar el encapsulamiento
})
export class SidenavComponent implements OnInit {
  @Input() navDatas: any;
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  navData = NAVBARDATA;
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

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  busqueda(event: any) {
    console.log(event, 'evento....');
  }

  toggleCollapse(): void {
    console.log('toggleCollapse....');
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    console.log('closeSidenav....');
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  handleClick(item: INavbarData): void {
    // this.toggleCollapse();
    console.log(item, 'handleClick');
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    // console.log(data, 'getActiveClass');
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    console.log(item, 'shrinkItems');
    console.log(!this.multiple, 'multiple');
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        console.log(item !== modelItem && modelItem.expanded, 'item !== modelItem && modelItem.expanded....');
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    } else {
      this.router.navigate([item.routeLink]).then();
    }
  }
}
