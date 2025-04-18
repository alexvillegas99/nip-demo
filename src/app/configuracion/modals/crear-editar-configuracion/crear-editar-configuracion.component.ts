import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-editar-configuracion',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './crear-editar-configuracion.component.html',
  styleUrl: './crear-editar-configuracion.component.scss',
})
export class CrearEditarConfiguracionComponent {}
