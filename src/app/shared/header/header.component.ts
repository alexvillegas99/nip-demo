import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private readonly router: Router) { }

  
salir() {
this.router.navigate(['/login']);
}
  @Input() sideNavStatus: boolean = false;
  @Output() sideNavToggled = new EventEmitter<boolean>();
  @Output() logOutMessage = new EventEmitter<boolean>();
  menuStatus: boolean = false;
  SideNavToggle() {
    this.menuStatus = !this.menuStatus;
    console.log(this.menuStatus)
    this.sideNavToggled.emit(this.menuStatus);
  }
}
