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
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@Component({
  selector: 'app-alarmas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,TimepickerModule],
  templateUrl: './alarmas.component.html',
  styleUrl: './alarmas.component.scss',
})
export class AlarmasComponent implements OnInit {
  reconocerAlarmar() {
    this.toastService.showSuccess('Alarma reconocida correctamente', 'Alarma');
    this.modalRef?.hide();
  }
  aplazarAlarma() {
    this.toastService.showSuccess('Alarma aplazada correctamente', 'Alarma');
    this.modalRef?.hide();
  }
  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();
  closeModal() {
    this.modalRef?.hide();
  }
  configModal = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-lg',
  };

  filtroModel: string = '';
  modalRef?: BsModalRef;
  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, this.configModal);
  }

  filtrar() {
    const valor = this.filterForm.controls.valorInpiut
      .value!.toUpperCase()
      .trim();
    const estado = this.filterForm.controls.estado.value;

    // Inicialmente, trabajamos con una copia de los valores originales.
    let resultadosFiltrados = this.valores;

    // Filtra por estado primero
    if (estado !== '' && estado !== '3') {
      if (estado === '1') {
        resultadosFiltrados = resultadosFiltrados.filter(
          (x: any) => x.estado === 'Atendido'
        );
      } else if (estado === '2') {
        resultadosFiltrados = resultadosFiltrados.filter(
          (x: any) => x.estado === 'Pendiente'
        );
      }
    }

    // Luego filtra por el valor del input, si no está vacío
    if (valor !== '') {
      resultadosFiltrados = resultadosFiltrados.filter(
        (x: any) =>
          x.condicion.toUpperCase().trim().includes(valor) ||
          x.evento.toUpperCase().trim().includes(valor) ||
          x.valor.toUpperCase().trim().includes(valor) ||
          x.usuario.toUpperCase().trim().includes(valor)
      );
    }

    // Asigna los resultados filtrados a valoresCopia
    this.valoresCopia = resultadosFiltrados;
  }

  constructor(
    private readonly fb: FormBuilder,
    private modalService: BsModalService,
    private readonly toastService: ToastrService
  ) {}
  ngOnInit(): void {
    this.valoresCopia = this.valores;
  }

  filterForm = this.fb.group({
    evento: [''],
    estado: [''],
    valorInpiut: [''],
  });
  ngAfterViewInit() {}
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
  valoresCopia: any;
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
}
