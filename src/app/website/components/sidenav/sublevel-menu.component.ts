import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';

@Component({
  selector: 'app-sublevel-menu',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './sublevel-menu.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state(
        'hidden',
        style({
          height: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'visible',
        style({
          height: '*',
        })
      ),
      transition('visible <=> hidden', [
        style({ overflow: 'hidden' }),
        animate('{{transitionParams}}'),
      ]),
      transition('void => *', animate(0)),
    ]),
  ],
  encapsulation: ViewEncapsulation.None, // Para desactivar el encapsulamiento
})
export class SublevelMenuComponent implements OnInit {
  @Input() nivel!: number;
  @Output() toggleEvent = new EventEmitter<boolean>();
  @Input() data: INavbarData | any = {
    routeLink: '',
    icon: '',
    label: '',
    items: [],
  };
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    console.log(this.data, 'data...', this.nivel);
    console.log(this.collapsed, this.animating, this.expanded, this.multiple);
  }

  handleClick(item: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getActiveClass(item: INavbarData): string {
    return item.expanded && this.router.url.includes(item.routeLink)
      ? 'active-sublevel'
      : '';
  }

  trackByFn(index: number, item: any): any {
    return item.id; // O cualquier identificador único para tus datos
  }
}
