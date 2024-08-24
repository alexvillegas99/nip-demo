import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  encapsulation: ViewEncapsulation.None, // Para desactivar el encapsulamiento
})
export class SelectComponent {
  @Input() lista!: any;
  @Input() labelDisabled!: string;
  @Output() opcionEvent = new EventEmitter<any>();

  opcion!: any;

  opcionSeleccionada(event: any) {
    this.opcionEvent.emit(event.target.value);
  }
}
