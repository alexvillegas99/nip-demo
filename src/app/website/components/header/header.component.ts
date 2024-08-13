import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);

  formularioBusqueda!: FormGroup | any;

  ngOnInit(): void {
    this.formInicializar();
  }

  formInicializar() {
    this.formularioBusqueda = this._formBuilder.group({
      search: new FormControl(''),
    });
  }
}
