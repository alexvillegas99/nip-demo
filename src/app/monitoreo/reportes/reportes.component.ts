import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { SearchComponent } from '../../shared/components/search/search.component';
import { SelectComponent } from '../../shared/components/select/select.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, SearchComponent, SelectComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReportesComponent {
  valores = [
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
  ];

  arrayReportes = [
    {
      name: 'Reporte general',
      type: 'general',
      descripcion: 'Reporte general de todos los controladores',
      image: 'assets/imgs/icons/icon_reports.svg',
    },
    {
      name: 'Reporte de controladores',
      type: 'controladores',
      descripcion: 'Reporte de controladores',
      image: 'assets/imgs/icons/icon_reports.svg',
    },
    {
      name: 'Reporte de sensores',
      type: 'sensores',
      descripcion: 'Reporte de sensores',
      image: 'assets/imgs/icons/icon_reports.svg',
    },
    {
      name: 'Reporte de actuadores',
      type: 'actuadores',
      descripcion: 'Reporte de actuadores',
      image: 'assets/imgs/icons/icon_reports.svg',
    },
    {
      name: 'Reporte de alarmas',
      type: 'alarmas',
      descripcion: 'Reporte de alarmas',
      image: 'assets/imgs/icons/icon_reports.svg',
    },
    {
      name: 'Reporte de eventos',
      type: 'eventos',
      descripcion: 'Reporte de eventos',
      image: 'assets/imgs/icons/icon_reports.svg',
    },
  ];

  estadoAlarma = [
    {
      nombre: 'GENERAL',
      code: 1,
    },
    {
      nombre: 'SENSORES',
      code: 2,
    },
    {
      nombre: 'ALARMAS',
      code: 3,
    },
    {
      nombre: 'ACTUADORES',
      code: 4,
    },
    {
      nombre: 'EVENTOS',
      code: 5,
    },
    {
      nombre: 'CONTROLADORES',
      code: 6,
    },
  ];

  valorFiltrado = '';
  estadoFiltrado = '';
  valoresCopia: any;

  filtrar() {
    console.log(this.estadoFiltrado, 'textoFiltrado......', this.textoFiltrado);

    // Inicialmente, trabajamos con una copia de los valores originales.
    let resultadosFiltrados = this.valores;

    // Filtra por estado primero
    if (this.estadoFiltrado !== '' && this.estadoFiltrado !== '3') {
      if (this.estadoFiltrado === '1') {
        resultadosFiltrados = resultadosFiltrados.filter(
          (x: any) => x.estado === 'Atendido'
        );
      } else if (this.estadoFiltrado === '2') {
        resultadosFiltrados = resultadosFiltrados.filter(
          (x: any) => x.estado === 'Pendiente'
        );
      }
    }

    // Luego filtra por el valor del input, si no está vacío
    if (this.valorFiltrado !== '') {
      resultadosFiltrados = resultadosFiltrados.filter(
        (x: any) =>
          x.condicion.toUpperCase().trim().includes(this.valorFiltrado) ||
          x.evento.toUpperCase().trim().includes(this.valorFiltrado) ||
          x.valor.toUpperCase().trim().includes(this.valorFiltrado) ||
          x.usuario.toUpperCase().trim().includes(this.valorFiltrado)
      );
    }

    // Asigna los resultados filtrados a valoresCopia
    this.valoresCopia = resultadosFiltrados;
  }

  opcionSeleccionada(event: any) {
    this.estadoFiltrado = event;
    this.filtrar();
  }

  textoFiltrado(event: any) {
    this.valorFiltrado = event.toUpperCase();
    this.filtrar();
  }
}
