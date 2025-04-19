import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ListaEquiposService } from '../services/lista-equipos.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '../shared/components/select/select.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SearchComponent } from '../shared/components/search/search.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SearchComponent,
    SelectComponent,
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent implements OnInit {
  private readonly _listaEquiposService = inject(ListaEquiposService);
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(BsModalService);
  private readonly alert = inject(AlertService);

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
  modalDispositivoRef: any;
  modalValoresRef: any;

  listaDispositivo: any;
  dipositivoSeleccionado!: any;
  valoresSeleccionados!: any;

  ngOnInit(): void {
    this.getDevices();
    this.inicializarFormulario();
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

  get esVariador(): boolean {
    return this.formDispositivo.get('tipo')?.value === 'variador';
  }

  getDevices() {
    this._listaEquiposService.getDevices().subscribe({
      next: (response) => {
        this.listaDispositivo = response;
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
    this.valoresSeleccionados = valores;

    this.modalValoresRef = this.modalService.show(template, {
      class: 'modal-md modal-dialog-centered',
    });
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
              next: (response) => {
                this.alert.showToast(
                  'success',
                  'Usuario actualizado correctamente'
                );
                this.getDevices();
                this.modalDispositivoRef?.hide();
              },
              error: (error) => {
                console.log(error);
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
        next: (response) => {
          console.log(response);
          this.alert.showToast('success', 'Usuario creado correctamente');
          this.getDevices();
          this.modalDispositivoRef?.hide();
        },
        error: (error) => {
          console.log(error);
          this.alert.showToast('error', 'Error al crear el dispositivo');
        },
      });
    }
  }

  textoFiltrado(event: any) {
    console.log(event, 'textoFiltrado....');
  }

  opcionSeleccionada(event: any) {
    console.log(event, 'opcionSeleccionada....');
  }
}
