import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaEquiposService } from '../services/lista-equipos.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent implements OnInit {
  private readonly _listaEquiposService = inject(ListaEquiposService);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(BsModalService);
  private readonly alert = inject(AlertService);
  private readonly _modalService = inject(NgbModal);

  modalValoresTemplateRef!: TemplateRef<any>;

  filtrosTipo = [
    {
      nombre: 'VARIADOR',
      code: 'variador',
    },
    {
      nombre: 'PM',
      code: 'pm',
    },
  ];

  formDispositivo!: FormGroup;
  formValores!: FormGroup;
  modalDispositivoRef: any;
  modalValoresRef: any;
  modalAgregarValoresRef: any;

  listaDispositivo: any;
  listaDispositivoFiltrada: any;
  dipositivoSeleccionado!: any;
  valoresSeleccionados!: any;
  valorSeleccionado!: any;

  ngOnInit(): void {
    this.getDevices();
    this.inicializarFormulario();
    this.inicializarFormularioValores();
  }

  inicializarFormulario() {
    this.formDispositivo = this.fb.group({
      tipo: new FormControl('', Validators.compose([Validators.required])),
      ip: new FormControl('', Validators.compose([Validators.required])),
      nombre: new FormControl('', Validators.compose([Validators.required])),
      modelo: new FormControl('', Validators.compose([Validators.required])),
      serie: new FormControl('', Validators.compose([Validators.required])),
      area: new FormControl('', Validators.compose([Validators.required])),
      imagen: new FormControl('', Validators.compose([Validators.required])),
      ubicacion: new FormControl(''),
      Inom: new FormControl(''),
      Nnom: new FormControl(''),
      Pnom: new FormControl(''),
      Vnom: new FormControl(''),
      motor: new FormControl(''),
    });
  }

  inicializarFormularioValores() {
    this.formValores = this.fb.group({
      Description: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      Register: new FormControl('', Validators.compose([Validators.required])),
      DataType: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  get esVariador(): boolean {
    return this.formDispositivo.get('tipo')?.value === 'variador';
  }

  getDevices() {
    this._listaEquiposService.getDevices().subscribe({
      next: (response) => {
        this.listaDispositivo = response;
        this.listaDispositivoFiltrada = response;
      },
      error: (error) => {},
    });
  }

  abrirModal(template: TemplateRef<any>, dispositivo?: any) {
    console.log(dispositivo);

    this.dipositivoSeleccionado = dispositivo ?? null;
    if (dispositivo) {
      this.formDispositivo.patchValue(dispositivo);
    } else {
      this.formDispositivo.reset({ rol: 'visualizador' });
    }

    this.modalDispositivoRef = this.modalService.show(template, {
      class: 'modal-md modal-dialog-centered',
    });
  }

  abrirModalValores(template: TemplateRef<any>, valores?: any) {
    this.valoresSeleccionados = valores.data;
    this.dipositivoSeleccionado = valores;
    this.modalValoresTemplateRef = template; // 🔑 Guardamos referencia al template
    this.modalValoresRef = this.modalService.show(template, {
      class: 'modal-md modal-dialog-centered',
    });
  }

  abrirModalAgregarEditarValores(
    template: TemplateRef<any>,
    valor?: any,
    index?: number
  ) {
    if (valor) {
      this.valorSeleccionado = { ...valor, index };
      this.formValores.patchValue(valor);
    } else {
      this.formValores.reset();
      this.valorSeleccionado = null;
    }

    if (this.modalValoresRef) {
      this.modalValoresRef.hide(); // Cierra el modal de valores correctamente
    }

    this.modalAgregarValoresRef = this._modalService.open(template, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });

    this.modalAgregarValoresRef.result.then(
      () => {
        // ✅ Reabre el modal de valores con su template
        this.abrirModalValores(
          this.modalValoresTemplateRef,
          this.valoresSeleccionados
        );
      },
      () => {
        this.abrirModalValores(
          this.modalValoresTemplateRef,
          this.valoresSeleccionados
        );
      }
    );
  }

  createDevice() {
    const data = this.formDispositivo.value;
    if (this.dipositivoSeleccionado) {
      this.alert
        .customAlertSweet('question', '¿Deseas actualizar este usuario?')
        .then((ok) => {
          if (!ok) return;

          this._listaEquiposService
            .updateDevice(this.dipositivoSeleccionado._id, data)
            .subscribe({
              next: () => {
                this.alert.showToast(
                  'success',
                  'Usuario actualizado correctamente'
                );
                this.getDevices();
                this.modalDispositivoRef?.hide();
              },
              error: (err: any) => {
                console.log(err);
                this.alert.showToast(
                  'error',
                  'Error al actualizar el dispositivo'
                );
              },
            });
        });
    } else {
      console.log(data, 'data para crear dispositivo....');

      this._listaEquiposService.createDevice(data).subscribe({
        next: (response: any) => {
          console.log(response);
          this.alert.showToast('success', 'Usuario creado correctamente');
          this.getDevices();
          this.modalDispositivoRef?.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.alert.showToast('error', 'Error al crear el dispositivo');
        },
      });
    }
  }

  textoFiltrado(event: any) {
    console.log(event, 'textoFiltrado....');
    this.listaDispositivoFiltrada = this.listaDispositivo.filter((item: any) =>
      item.nombre.toLowerCase().includes(event.toLowerCase())
    );
  }

  opcionSeleccionada(event: any) {
    console.log(event, 'opcionSeleccionada....');
    this.listaDispositivoFiltrada = this.listaDispositivo.filter((item: any) =>
      item.tipo.toLowerCase().includes(event.toLowerCase())
    );
  }

  editarModalValor(template: TemplateRef<any>, valorEditar: any) {
    if (valorEditar) {
      this.valorSeleccionado = valorEditar;
      this.formValores.patchValue(valorEditar);
      console.log(
        this.dipositivoSeleccionado,
        'valorSeleccionado....',
        this.valorSeleccionado
      );
    }

    this.modalAgregarValoresRef = this._modalService.open(template, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
    this.modalAgregarValoresRef.result.then(
      (result: any) => {
        console.log(result, 'data uptdate....');

        // Abrir modal 1 de nuevo cuando se cierre el modal 2
        /*if (this.modal1Referencia) {
          this.openModal1(this.modal1Referencia); // Reemplaza `content1` con el contenido del modal 1
        }*/
      },
      (reason: any) => {
        // Abrir modal 1 de nuevo cuando se rechace el modal 2
        /*if (this.modalRef1) {
          this.openModal1(this.modalRef1); // Reemplaza `content1` con el contenido del modal 1
        }*/
      }
    );
  }

  crearValor(dipositivo: any) {
    console.log(
      this.formValores.value,
      'crearValor....',
      this.dipositivoSeleccionado
    );

    const data = this.formValores.value;

    this._listaEquiposService.createDevice(data).subscribe({
      next: (response: any) => {
        this.alert.showToast('success', 'Valor creado correctamente');
        this.getDevices();
        this.modalValoresRef?.hide();
      },
      error: (error: any) => {
        console.log(error);
        this.alert.showToast('error', 'Error al crear el valor');
      },
    });
  }

  editarValor(dipositivo: any) {
    const data = this.formValores.value;
    data._id = this.valorSeleccionado._id;

    console.log(this.valorSeleccionado._id, 'editarValor....', data);

    this._listaEquiposService
      .updateValor(this.dipositivoSeleccionado._id, data)
      .subscribe({
        next: (response: any) => {
          this.alert.showToast('success', 'Valor editado correctamente');
          this.getDevices();
          this.modalValoresRef?.hide();
        },
        error: (error: any) => {
          console.log(error);
          this.alert.showToast('error', 'Error al editar el valor');
        },
      });
  }
}
