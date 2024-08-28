import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { NgbTimepickerModule, NgbTimeStruct, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../services/alert.service';
import { SearchComponent } from '../../shared/components/search/search.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { StepperComponent } from '../../shared/stepper/stepper.component';
import { ToastrService } from '../../services/toas.service';

@Component({
  selector: 'app-gestion-mantenimiento',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StepperComponent,
    NgbTimepickerModule,
    SearchComponent,
    SelectComponent
  ],
  templateUrl: './gestion-mantenimiento.component.html',
  styleUrl: './gestion-mantenimiento.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GestionMantenimientoComponent {
  filtrosPedidos = [
    {
      nombre: 'Entregado',
      code: 1,
    },
    {
      nombre: 'En Proceso',
      code: 2,
    },
    {
      nombre: 'Envio',
      code: 3,
    },
    {
      nombre: 'Todos',
      code: 4,
    },
  ];

  steps = [
    {
      title: 'En proceso',
      icon: 'fa-solid fa-cart-shopping',
      fecha: '2021-10-10',
    },
    { title: 'Envió', icon: 'fa-solid fa-truck-fast', fecha: '2021-10-10' },
    {
      title: 'Entregado',
      icon: 'fa-solid fa-truck-ramp-box',
      fecha: '2021-10-10',
    },
  ];
  currentStep = 2;
  formTareas = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    usuario_asignado: ['', Validators.required],
    prioridad: ['', Validators.required],
  });

  formActividades = this.fb.group({
    descripcion: ['', Validators.required],
    tipo_tarea: ['', Validators.required],
    duracion_estimada: [
      { hour: 0, minute: 0, second: 0 } as NgbTimeStruct,
      Validators.required,
    ],
  });

  formPedidos = this.fb.group({
    usuario: ['Alex Villegas', Validators.required],
    proveedor: ['', Validators.required],
    observacion: ['', Validators.required],
    tipo: ['', Validators.required],
    producto: ['', Validators.required],
  });

  modalRef?: BsModalRef;

  tareaSeleccionada: any;

  menu: any[] = [
    {
      active: false,
      nombre: 'PEDIDOS',
      isSelected: false,
    },
    {
      active: true,
      nombre: 'TAREAS',
      isSelected: false,
    },
  ];

  headers_tareas = [
    'Titulo',
    'Descripción',
    'Tareas Asociadas',
    // 'Prioridad',
    'Fecha',
    'Acciones',
  ];

  headers_pedidos = [
    'Detalle',
    'Usuario',
    'Proveedor',
    'Producto',
    'Creación',
    'Estado',
    'Acciones',
  ];

  tareas = [
    {
      titulo: 'Reemplazar filtro de aire acondicionado',
      descripcion: 'Reemplazar filtro de aire acondicionado',
      prioridad: 'Alta',
      usuario_asignado: 'Alex Villegas',
      tareas_asociadas: [
        {
          descripcion: 'Reemplazar filtro de aire acondicionado',
          tipo_tarea: 'Mecánica',
          prioridad: 'Alta',
          duracion_estimada: '01:00',
          estado: true,
          tiempo_paro_mantenimiento: '01:30',
          usuario_asignado: 'Juan Perez',
        },
        {
          descripcion: 'Reemplazar filtro de aire acondicionado',
          tipo_tarea: 'Mecánica',
          prioridad: 'Media',
          duracion_estimada: '01:00',
          estado: false,
          tiempo_paro_mantenimiento: '01:30',
          usuario_asignado: 'Juan Perez',
        },
        {
          descripcion: 'Reemplazar filtro de aire acondicionado',
          tipo_tarea: 'Mecánica',
          prioridad: 'Baja',
          duracion_estimada: '01:00',
          estado: true,
          tiempo_paro_mantenimiento: '01:30',
          usuario_asignado: 'Juan Perez',
        },
      ],
      fecha_creacion: '2021-10-10',
    },
    {
      titulo: 'Reemplazar filtro de aire acondicionado',
      descripcion: 'Reemplazar filtro de aire acondicionado',
      prioridad: 'Media',
      usuario_asignado: 'Alex Villegas',
      tareas_asociadas: [
        {
          descripcion: 'Reemplazar filtro de aire acondicionado',
          tipo_tarea: 'Mecánica',
          prioridad: 'Alta',

          duracion_estimada: '01:00',
          estado: false,
          tiempo_paro_mantenimiento: '01:30',
          usuario_asignado: 'Juan Perez',
        },
      ],
      fecha_creacion: '2021-10-10',
    },
    {
      titulo: 'Reemplazar filtro de aire acondicionado',
      descripcion: 'Reemplazar filtro de aire acondicionado',
      prioridad: 'Baja',
      usuario_asignado: 'Alex Villegas',
      tareas_asociadas: [
        {
          descripcion: 'Reemplazar filtro de aire acondicionado',
          tipo_tarea: 'Mecánica',
          prioridad: 'Alta',
          duracion_estimada: '01:00',
          estado: false,
          tiempo_paro_mantenimiento: '01:30',
          usuario_asignado: 'Juan Perez',
        },
      ],
      fecha_creacion: '2021-10-10',
    },
  ];

  pedidos = [
    {
      detalle: 'Detalle del pedido 1',
      usuario: 'Alex Villegas',
      proveedor: 'Proveedor 1',
      fecha_creacion: '2021-10-10',
      estado: 'Entregado',
      producto: 'Producto 1',
      tipo_producto: 'Tipo 1',
      historico: [
        {
          fecha: '2021-10-10',
          estado: 'En proceso',
          observacion: 'Observación 1',
        },
        {
          fecha: '2021-10-10',
          estado: 'Envió',
          observacion: 'Observación 2',
        },
        {
          fecha: '2021-10-10',
          estado: 'Entregado',
          observacion: 'Observación 3',
        },
      ],
    },
    {
      detalle: 'Detalle del pedido 2',
      usuario: 'Alex Villegas',
      proveedor: 'Proveedor 1',
      fecha_creacion: '2021-10-10',
      estado: 'En proceso',
      producto: 'Producto 1',
      tipo_producto: 'Tipo 1',
      historico: [
        {
          fecha: '2021-10-10',
          estado: 'En proceso',
          observacion: 'Observación 1',
        },
      ],
    },
    {
      detalle: 'Detalle del pedido 3',
      usuario: 'Alex Villegas',
      proveedor: 'Proveedor 1',
      fecha_creacion: '2021-10-10',
      estado: 'Envió',
      producto: 'Producto 1',
      tipo_producto: 'Tipo 1',
      historico: [
        {
          fecha: '2021-10-10',
          estado: 'En proceso',
          observacion: 'Observación 1',
        },
        {
          fecha: '2021-10-10',
          estado: 'Envió',
          observacion: 'Observación 2',
        },
      ],
    },
  ];

  configModal = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-xl',
  };

  headers_tareas_asociadas = [
    'Descripción',
    'Tipo de tarea',
    'Duración estimada',
    'Estado',
    'Acciones',
  ];

  modalRef1: NgbModalRef;
  modalRef2: NgbModalRef;
  modal1Referencia: any;
  subTareaSeleccionada: any = null;
  pedidoSeleccionado: any = null;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private readonly alertService: AlertService,
    private readonly toastService: ToastrService,
    private _modalService: NgbModal
  ) {}

  eliminarPedido(_t69: number) {
    this.alertService
      .customAlertSweet('warning', '¿Estás seguro de eliminar este pedido?')
      .then((result) => {
        if (result) {
          this.pedidos.splice(_t69, 1);
        }
      });
  }

  eliminarTarea(_t33: number) {
    this.alertService
      .customAlertSweet('warning', '¿Estás seguro de eliminar esta tarea?')
      .then((result) => {
        if (result) {
          this.tareas.splice(_t33, 1);
        }
      });
  }

  closeModalPedidos() {
    this.modalRef?.hide();
    this.formPedidos.reset();
  }

  eliminarSubTarea(posicion: number) {
    this.alertService
      .customAlertSweet('warning', '¿Estás seguro de eliminar esta tarea?')
      .then((result) => {
        if (result) {
          this.tareaSeleccionada.tareas_asociadas.splice(posicion, 1);
        }
      });
  }

  modalNuevaTarea(_t40: TemplateRef<any>) {
    this.formTareas.enable();
    this.formTareas.reset();
    this.tareaSeleccionada = null;
    this.openModal1(_t40);
  }

  submitForm() {
    if (this.formTareas.valid) {
      // Aquí puedes enviar los datos del formulario
      console.log(this.formTareas.value);
    } else {
      // Manejar caso en el que el formulario no sea válido
      console.error('Formulario no válido');
    }
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, this.configModal);
  }

  abrirModalPedidos(template: TemplateRef<void>) {
    this.formPedidos.reset();
    this.modalRef = this.modalService.show(template, this.configModal);
    this.formPedidos.patchValue({
      usuario: 'Alex Villegas',
      tipo: '',
      producto: '',
      proveedor: '',
    });
  }

  cambiarMenu(index: number) {
    this.menu.forEach((item, i) => {
      if (i === index) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }

  seleccionarTarea(tarea: any, template: TemplateRef<any>) {
    this.formTareas.patchValue({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      usuario_asignado: tarea.usuario_asignado,
      prioridad: tarea.prioridad,
    });
    this.formTareas.disable();
    this.tareaSeleccionada = tarea;
    this.openModal1(template);
  }

  padZero(value: number) {
    return value < 10 ? '0' + value : value.toString();
  }

  guardarTarea() {
    const tarea = this.formTareas.value;
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getFullYear()}-${this.padZero(
      fechaActual.getMonth() + 1
    )}-${this.padZero(fechaActual.getDate())}`;

    const data = {
      titulo: tarea.titulo!,
      descripcion: tarea.descripcion!,
      tareas_asociadas: [],
      fecha_creacion: fechaFormateada,
      usuario_asignado: tarea.usuario_asignado!,
      prioridad: tarea.prioridad!,
    };

    this.tareas.unshift(data);
    this.modalRef1.close();
    this.formTareas.reset();
    this.toastService.showSuccess(
      'Tarea creada',
      'La tarea ha sido creada correctamente'
    );
  }

  editarTarea() {
    if (this.formTareas.disabled) {
      this.formTareas.enable();
    } else {
      this.formTareas.disable();
    }
  }

  openModalHijo(modal_hijo: TemplateRef<any>) {
    // this.openModal2(modal_hijo);
  }

  closeModalHijo() {
    this.formActividades.reset();
  }

  guardarSubTarea() {
    const tarea: any = this.formActividades.value;
    console.log(tarea);
    tarea.duracion_estimada = this.formatearFecha(tarea.duracion_estimada);
    tarea.estado = false;
    this.tareaSeleccionada.tareas_asociadas.push(tarea);
    this.modalRef2.close();
    this.toastService.showSuccess(
      'Actividad creada',
      'La actividad ha sido creada correctamente'
    );
    this.formActividades.reset();
  }

  formatearFecha(duracion: any): any {
    const hours = duracion.hour.toString().padStart(2, '0');
    const minutes = duracion.minute.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  modalEditarSubTarea(tarea: any, index: number, modal_hijo: TemplateRef<any>) {
    this.subTareaSeleccionada = { ...tarea, index };
    this.formActividades.patchValue(tarea);
    this.openModalHijo(modal_hijo);
  }

  modalEditarPedido(pedido: any, index: number, modal_hijo: TemplateRef<any>) {
    this.pedidoSeleccionado = { ...pedido, index };
    this.formPedidos.patchValue(pedido);
    this.openModalHijo(modal_hijo);
  }

  guardarSubTareaEditada() {
    const tarea: any = this.formActividades.value;
    tarea.duracion_estimada = this.formatearFecha(tarea.duracion_estimada);
    tarea.estado = this.subTareaSeleccionada.estado;
    this.tareaSeleccionada.tareas_asociadas[this.subTareaSeleccionada.index] =
      tarea;
    this.modalRef2.close();
    this.toastService.showSuccess(
      'Actividad editada',
      'La actividad ha sido editada correctamente'
    );
    this.formActividades.reset();
  }

  guardarPedido() {
    const pedido: any = this.formPedidos.value;
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getFullYear()}-${this.padZero(
      fechaActual.getMonth() + 1
    )}-${this.padZero(fechaActual.getDate())}`;

    const data: any = {
      pedido: pedido.titulo!,
      detalle: pedido.observacion!,
      fecha_creacion: fechaFormateada,
      estado: 'En proceso',
      usuario: pedido.usuario!,
      proveedor: pedido.proveedor!,
      producto: pedido.producto!,
      tipo_producto: pedido.tipo!,
    };

    this.pedidos.unshift(data);
    this.modalRef?.hide();
    this.formPedidos.reset();
    this.toastService.showSuccess(
      'Pedido creado',
      'El pedido ha sido creado correctamente'
    );
    this.pedidoSeleccionado = null;
  }

  verEstadoPedido(pedido: any, template: TemplateRef<any>) {
    this.pedidoSeleccionado = pedido;
    this.openModal(template);
  }

  openModal1(content1: any): void {
    this.modal1Referencia = content1;
    this.modalRef1 = this._modalService.open(content1, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
    this.modalRef1.result.then(
      (result) => {
        // Acción a realizar cuando se cierra el modal 1
      },
      (reason) => {
        // Acción a realizar cuando se rechaza el modal 1
      }
    );
  }

  formatTime(time: string): NgbTimeStruct {
    const [hour, minute] = time.split(':').map(Number);
    return { hour, minute, second: 0 };
  }

  openModal2(content2: any, tarea?: any, index?: number): void {
    if (tarea) {
      this.subTareaSeleccionada = { ...tarea, index };
      this.formActividades.patchValue(tarea);
      const formattedTime = this.formatTime(tarea.duracion_estimada);
      this.formActividades.controls['duracion_estimada'].setValue(
        formattedTime
      );
      // this.formActividades.controls.duracion_estimada.setValue()
    }

    if (this.modalRef1) {
      this.modalRef1.close(); // Cierra el modal 1 antes de abrir el 2
    }
    this.modalRef2 = this._modalService.open(content2, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
    this.modalRef2.result.then(
      (result) => {
        // Abrir modal 1 de nuevo cuando se cierre el modal 2
        if (this.modal1Referencia) {
          this.openModal1(this.modal1Referencia); // Reemplaza `content1` con el contenido del modal 1
        }
      },
      (reason) => {
        // Abrir modal 1 de nuevo cuando se rechace el modal 2
        if (this.modalRef1) {
          this.openModal1(this.modalRef1); // Reemplaza `content1` con el contenido del modal 1
        }
      }
    );
  }

  textoFiltrado(event: any) {
    console.log(event, 'textoFiltrado....'); 
  }

  opcionSeleccionada(event: any) {
    console.log(event, 'opcionSeleccionada....'); 
  }
}
