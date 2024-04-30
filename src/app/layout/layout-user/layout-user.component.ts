import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-user',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent,CommonModule],
  templateUrl: './layout-user.component.html',
  styleUrl: './layout-user.component.scss',
})
export class LayoutUserComponent implements OnInit {
  
  ngOnInit(): void {
    this.onWindowResize();
    console.log(this.sideNavStatus) 
  }
  
  sideNavStatus:boolean=true; 
  logOutMessageStatus:boolean=false;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const size = window.innerWidth;
    if(size<=800){
      this.sideNavStatus=false;
    }
    if(size>800){
      this.sideNavStatus=true;
    }
  }
}
