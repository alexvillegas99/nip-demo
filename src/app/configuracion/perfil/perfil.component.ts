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
import { SearchComponent } from '../../shared/components/search/search.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilService } from '../../services/tarea.service copy';
import { DisableForRolesDirective } from '../../core/directives/disable-for-roles.directive';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SearchComponent,
    DisableForRolesDirective,
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

  formPermiso!: FormGroup;

  perfiles: any;
  perfilSeleccionado!: any;

  modalPermisosRef: any;

  permisosSeleccionados: any = [];
  permisos = [
    {
      descripcion: 'crear',
    },
    {
      descripcion: 'leer',
    },
    {
      descripcion: 'actualizar',
    },
    {
      descripcion: 'eliminar',
    },
  ];

  ngOnInit(): void {
    this.getPerfiles();
    this.inicializarFormulario();
  }

  getPerfiles() {
    this.perfilService.getPerfil().subscribe({
      next: (res) => {
        this.perfiles = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  inicializarFormulario() {
    this.formPermiso = this.fb.group({
      nombre: new FormControl('', Validators.compose([Validators.required])),
      permisos: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  abrirModal(template: TemplateRef<any>, perfil?: any) {
    console.log(perfil);

    this.perfilSeleccionado = perfil ?? null;
    if (perfil) {
      this.formPermiso.patchValue(perfil);
    } else {
      this.formPermiso.reset();
    }

    this.modalPermisosRef = this.modalService.show(template, {
      class: 'modal-md modal-dialog-centered',
    });
  }

  textoFiltrado(event: any) {
    console.log(event, 'textoFiltrado....');
    this.perfiles = this.perfiles.filter((item: any) =>
      item.nombre.toLowerCase().includes(event.toLowerCase())
    );
  }

  createPermiso() {}

  editarPermiso() {
    console.log(this.perfilSeleccionado, 'editarPermiso');
    this.perfilService
      .updatePerfil(this.perfilSeleccionado._id, this.perfilSeleccionado)
      .subscribe({
        next: (res: any) => {
          // this.alert.showSuccess('Perfil actualizado correctamente');
          this.modalPermisosRef.hide();
          this.getPerfiles();
        },
        error: (err: any) => {
          console.log(err);
          // this.alert.showError('Error al actualizar el perfil');
        },
      });
  }

  checkModulo(permiso: any) {
    console.log(permiso, 'dta de permiso..', this.perfilSeleccionado.permisos);

    const index = this.perfilSeleccionado.permisos.findIndex(
      (reg: any) => reg.descripcion === permiso.descripcion
    );
    console.log(index, 'indice encontrado...');

    if (index > -1) {
      this.perfilSeleccionado.permisos[index].estado =
        !this.perfilSeleccionado.permisos[index].estado;
    }
  }
}
