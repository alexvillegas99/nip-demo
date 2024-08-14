import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from '../../services/toas.service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SearchComponent } from '../../shared/components/search/search.component';
import { SelectComponent } from '../../shared/components/select/select.component';

@Component({
  selector: 'app-alarmas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TimepickerModule,
    SearchComponent,
    SelectComponent,
  ],
  templateUrl: './alarmas.component.html',
  styleUrl: './alarmas.component.scss',
})
export class AlarmasComponent implements OnInit {
  headers = [
    'Código',
    'Tiempo detección',
    'Condición',
    'Evento',
    'Estado',
    'Valor',
    'Usuario',
    'Aplazamiento',
    'Reconocimiento',
  ];
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
  estadoAlarma = [
    {
      nombre: 'Atentida',
      code: 1,
    },
    {
      nombre: 'Pendientes',
      code: 2,
    },
    {
      nombre: 'Todas',
      code: 3,
    },
  ];
  eventos = [
    {
      nombre: 'Se a detectado una caida de presion critica',
    },
    {
      nombre: 'Temperatura alta',
    },
  ];
  configModal = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-lg',
  };

  filtroModel: string = '';
  modalRef?: BsModalRef;
  valoresCopia: any;
  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();

  valorFiltrado = '';
  estadoFiltrado = '';

  filterForm = this.fb.group({
    evento: [''],
    estado: [''],
    valorInpiut: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private modalService: BsModalService,
    private readonly toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.valoresCopia = this.valores;
  }

  ngAfterViewInit() {}

  reconocerAlarmar() {
    this.toastService.showSuccess('Alarma reconocida correctamente', 'Alarma');
    this.modalRef?.hide();
  }

  aplazarAlarma() {
    this.toastService.showSuccess('Alarma aplazada correctamente', 'Alarma');
    this.modalRef?.hide();
  }

  closeModal() {
    this.modalRef?.hide();
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, this.configModal);
  }

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
