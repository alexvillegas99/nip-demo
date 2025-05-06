import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '../../shared/components/select/select.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SearchComponent,
    SelectComponent,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(BsModalService);
  private readonly alert = inject(AlertService);
  private readonly _modalService = inject(NgbModal);

  formDispositivo!: FormGroup;

  perfil: any;
  perfilFiltrada: any;
  perfilSeleccionado!: any;

  modalDispositivoRef: any;

  inicializarFormulario() {
    this.formDispositivo = this.fb.group({
      nombre: new FormControl('', Validators.compose([Validators.required])),
      permisos: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  abrirModal(template: TemplateRef<any>, dispositivo?: any) {
    console.log(dispositivo);

    this.perfilSeleccionado = dispositivo ?? null;
    if (dispositivo) {
      this.formDispositivo.patchValue(dispositivo);
    } else {
      this.formDispositivo.reset({ rol: 'visualizador' });
    }

    this.modalDispositivoRef = this.modalService.show(template, {
      class: 'modal-md modal-dialog-centered',
    });
  }

  textoFiltrado(event: any) {
    console.log(event, 'textoFiltrado....');
    this.perfilFiltrada = this.perfil.filter((item: any) =>
      item.nombre.toLowerCase().includes(event.toLowerCase())
    );
  }

  opcionSeleccionada(event: any) {
    console.log(event, 'opcionSeleccionada....');
    this.perfilFiltrada = this.perfil.filter((item: any) =>
      item.tipo.toLowerCase().includes(event.toLowerCase())
    );
  }
}
