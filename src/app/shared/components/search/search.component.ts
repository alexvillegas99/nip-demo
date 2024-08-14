import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input() label!: string;
  @Output() searchText = new EventEmitter<string>();

  private _formBuilder = inject(FormBuilder);
  formularioBusqueda!: FormGroup | any;

  ngOnInit(): void {
    this.formInicializar();
    this.escucharCampoBusqueda();
  }

  formInicializar() {
    this.formularioBusqueda = this._formBuilder.group({
      search: new FormControl(''),
    });
  }

  escucharCampoBusqueda(): void {
    const busquedaC = this.campoBusqueda;
    busquedaC.valueChanges.pipe(debounceTime(900)).subscribe({
      next: (resp) => {
        this.searchText.emit(resp);
      },
      error: (e: any) => {
        console.error(e, 'error.....');
      },
    });
  }

  get campoBusqueda(): AbstractControl {
    return this.formularioBusqueda.get('search') as FormControl;
  }
}
