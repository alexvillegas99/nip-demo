import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListaEquiposService } from '../../services/lista-equipos.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../shared/components/search/search.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { DisableForRolesDirective } from '../../core/directives/disable-for-roles.directive';

@Component({
  selector: 'app-lista-equipo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SearchComponent,
    SelectComponent,
    DisableForRolesDirective,
  ],
  templateUrl: './lista-equipo.component.html',
  styleUrl: './lista-equipo.component.scss',
})
export class ListaEquipoComponent implements OnInit {
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
  formRangos!: FormGroup;
  modalDispositivoRef: any;
  modalValoresRef: any;
  modalAgregarValoresRef: any;
  modalRangosRef: any;

  listaDispositivo: any;
  listaDispositivoFiltrada: any;
  dipositivoSeleccionado!: any;
  valoresSeleccionados!: any;
  valorSeleccionado!: any;
  dataSeleccionada!: any;

  imagenPreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.getDevices();
    this.inicializarFormulario();
    this.inicializarFormularioValores();
    this.inicializarFormularioRango();
  }

  inicializarFormulario() {
    this.formDispositivo = this.fb.group({
      tipo: new FormControl('pm', Validators.compose([Validators.required])),
      ip: new FormControl('', Validators.compose([Validators.required])),
      ipEquipo: new FormControl(''),
      nombre: new FormControl('', Validators.compose([Validators.required])),
      modelo: new FormControl('', Validators.compose([Validators.required])),
      serie: new FormControl('', Validators.compose([Validators.required])),
      area: new FormControl('', Validators.compose([Validators.required])),
      imagen: new FormControl(''),
      imagenBase64: new FormControl(null),
      ubicacion: new FormControl(''),
      Inom: new FormControl(''),
      Nnom: new FormControl(''),
      Pnom: new FormControl(''),
      Vnom: new FormControl(''),
      motor: new FormControl(''),
      motorBase64: new FormControl(null),
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

  inicializarFormularioRango() {
    this.formRangos = this.fb.group({
      RangoMinimoModerado: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      RangoMinimoAlerta: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      RangoMaximoModerado: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      RangoMaximoAlerta: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
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
    this.dipositivoSeleccionado = dispositivo ?? null;
    console.log(dispositivo, 'dispositivo seleccionado');

    if (dispositivo) {
      this.formDispositivo.patchValue(dispositivo);
    } else {
      this.formDispositivo.reset({ rol: 'visualizador' });
    }

    this.modalDispositivoRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
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
          this.dipositivoSeleccionado
        );
      },
      () => {
        this.abrirModalValores(
          this.modalValoresTemplateRef,
          this.dipositivoSeleccionado
        );
      }
    );
  }

  abrirModalRango(template: TemplateRef<any>, dispositivo?: any) {
    this.dipositivoSeleccionado = dispositivo ?? null;
    if (dispositivo) {
      this.formRangos.patchValue(dispositivo?.rango);
    } else {
      this.formRangos.reset();
    }

    this.modalRangosRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  createDevice() {
    console.log('Creating device...', this.formDispositivo.value);

    const data = this.formDispositivo.value;
    if (this.dipositivoSeleccionado) {
      this.alert
        .customAlertSweet('question', '¿Deseas actualizar este dispositivo?')
        .then((ok) => {
          if (!ok) return;

          this._listaEquiposService
            .updateDevice(this.dipositivoSeleccionado._id, data)
            .subscribe({
              next: (response) => {
                this.alert.showToast(
                  'success',
                  'Dispositivo actualizado correctamente'
                );
                this.getDevices();
                this.formDispositivo.reset();
                this.modalDispositivoRef?.hide();
              },
              error: (error) => {
                console.error(error);
                this.alert.showToast(
                  'error',
                  'Error al actualizar el dispositivo'
                );
              },
            });
        });
    } else {
      this._listaEquiposService.createDevice(data).subscribe({
        next: (response) => {
          this.alert.showToast('success', 'Dispositivo creado correctamente');
          this.getDevices();
          this.modalDispositivoRef?.hide();
        },
        error: (error) => {
          console.error(error);
          this.alert.showToast('error', 'Error al crear el dispositivo');
        },
      });
    }
  }

  textoFiltrado(event: any) {
    this.listaDispositivoFiltrada = this.listaDispositivo.filter((item: any) =>
      item.nombre.toLowerCase().includes(event.toLowerCase())
    );
  }

  opcionSeleccionada(event: any) {
    this.listaDispositivoFiltrada = this.listaDispositivo.filter((item: any) =>
      item.tipo.toLowerCase().includes(event.toLowerCase())
    );
  }

  editarModalValor(template: TemplateRef<any>, valorEditar: any) {
    if (valorEditar) {
      this.valorSeleccionado = valorEditar;
      this.formValores.patchValue(valorEditar);
    }

    this.modalAgregarValoresRef = this._modalService.open(template, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
    this.modalAgregarValoresRef.result.then(
      (result: any) => {
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
    const data = this.formValores.value;
    const json = {
      _id: dipositivo._id,
      data: [
        {
          ...data,
        },
      ],
    };
    console.log(json, 'data a enviar');

    this._listaEquiposService.createValor(json).subscribe({
      next: (response) => {
        this.alert.showToast('success', 'Valor creado correctamente');
        this.getDevices();
        this.modalAgregarValoresRef?.close();
      },
      error: (error) => {
        console.error(error);
        this.alert.showToast('error', 'Error al crear el valor');
      },
    });
  }

  editarValor(dipositivo: any) {
    const Description = this.valorSeleccionado.Description;
    const newDescription = this.formValores.value.Description;

    const json = {
      data: [
        {
          ...this.formValores.value,
          newDescription,
          Description,
        },
      ],
    };

    this._listaEquiposService
      .updateValor(this.dipositivoSeleccionado._id, json)
      .subscribe({
        next: (response) => {
          this.alert.showToast('success', 'Valor editado correctamente');
          this.getDevices();
          this.modalAgregarValoresRef?.close();
        },
        error: (error) => {
          console.error(error);
          this.alert.showToast('error', 'Error al editar el valor');
        },
      });
  }

  abrirModalRangos(template: TemplateRef<any>, data?: any) {
    if (data.rango) {
      this.dataSeleccionada = data;
      this.formRangos.patchValue(data.rango);
    } else {
      this.formRangos.reset();
    }

    this.modalRangosRef = this._modalService.open(template, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
    this.modalRangosRef.result.then(
      (result: any) => {
        if (result) {
          data.rango = result;
          this.editarRango(data);
        }
      },
      (reason: any) => {
        // Abrir modal 1 de nuevo cuando se rechace el modal 2
        /*if (this.modalRef1) {
          this.openModal1(this.modalRef1); // Reemplaza `content1` con el contenido del modal 1
        }*/
      }
    );
  }

  editarRango(dataEditar: any) {
    const json = {
      data: [
        {
          ...dataEditar,
        },
      ],
    };

    this._listaEquiposService
      .updateValor(this.dipositivoSeleccionado._id, json)
      .subscribe({
        next: (response) => {
          this.alert.showToast('success', 'Valor editado correctamente');
          this.getDevices();
          this.modalRangosRef?.close();
        },
        error: (error) => {
          console.error(error);
          this.alert.showToast('error', 'Error al editar el valor');
        },
      });
  }

  onFileSelected(event: Event, opcion: 'imagen' | 'motor') {
    const input = event.target as HTMLInputElement;

    // Validar si el usuario canceló la selección
    if (!input.files || input.files.length === 0) {
      // Limpiar campo si es necesario
      if (opcion === 'imagen') {
        this.formDispositivo.get('imagenBase64')?.reset();
      } else if (opcion === 'motor') {
        this.formDispositivo.get('motorBase64')?.reset();
      }

      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (opcion === 'imagen') {
        this.formDispositivo.get('imagenBase64')?.setValue(reader.result);
      } else if (opcion === 'motor') {
        this.formDispositivo.get('motorBase64')?.setValue(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  // bajo tolerable // bajo
}
