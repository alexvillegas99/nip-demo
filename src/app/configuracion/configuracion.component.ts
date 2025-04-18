import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ListaEquiposService } from '../services/lista-equipos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent implements OnInit {
  private readonly _listaEquiposService = inject(ListaEquiposService);

  listaDispositivo: any;

  ngOnInit(): void {
    this.getDevices();
  }

  getDevices() {
    this._listaEquiposService.getDevices().subscribe({
      next: (response) => {
        this.listaDispositivo = response;
      },
      error: (error) => {},
    });
  }

  abrirModal() {}
}
