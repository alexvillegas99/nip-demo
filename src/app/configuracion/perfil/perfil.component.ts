import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
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
import { PerfilService } from '../../services/tarea.service copy';

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
export class PerfilComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(BsModalService);
  private readonly alert = inject(AlertService);
  private readonly _modalService = inject(NgbModal);
  private readonly perfilService = inject(PerfilService);

  formDispositivo!: FormGroup;

  perfiles: any;
  perfilFiltrada: any;
  perfilSeleccionado!: any;

  modalDispositivoRef: any;

  ngOnInit(): void {
    this.getPerfiles();
  }

  getPerfiles() {
    this.perfilService.getPerfil().subscribe({
      next: (res) => {
        this.perfiles = res;
        console.log(this.perfiles, 'perfil');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

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
    this.perfilFiltrada = this.perfiles.filter((item: any) =>
      item.nombre.toLowerCase().includes(event.toLowerCase())
    );
  }
}
