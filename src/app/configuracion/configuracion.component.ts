import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss'
})
export class ConfiguracionComponent {
  listaDispositivo = [
    {
      nombre: 'Medidor PM5560'
    },
    {
      nombre: 'Compresor PM5560'
    },
    {
      nombre: 'Variador 123B'
    },
    {
      nombre: 'Compresor PM5560'
    }
  ]
}
