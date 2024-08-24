import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  ngOnInit(): void {
  }

  busqueda(event: any) {
    console.log(event, 'evento....');
  }
}
