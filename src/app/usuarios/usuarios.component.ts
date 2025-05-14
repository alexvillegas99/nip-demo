import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { SelectComponent } from '../shared/components/select/select.component';
import { CommonModule } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../services/alert.service';
import { PerfilService } from '../services/tarea.service copy';
import { DisableForRolesDirective } from '../core/directives/disable-for-roles.directive';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    CommonModule,
    DisableForRolesDirective,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuarioSeleccionado: any | null = null;

  formUsuario!: FormGroup;
  filtrosRoles: any = [];

  filtrosEstados = [
    {
      nombre: 'Activo',
      code: true,
    },
    {
      nombre: 'Inactivo',
      code: false,
    },
  ];

  rolFiltro: string = 'todos';
  estadoFiltro: string = 'todos';
  modalUsuarioRef: any;

  roles: any = [];
  cargos = ['Administrador', 'Operador'];
  constructor(
    private readonly fb: FormBuilder,
    private readonly usuariosService: UsuariosService,
    private readonly modalService: BsModalService,
    private readonly alert: AlertService,
    private readonly _perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
    this.getPerfiles();
  }

  inicializarFormulario() {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      cedula: ['', Validators.required],
      telefono: ['', Validators.required],
      rol: ['visualizador', Validators.required],
    });
  }

  getPerfiles() {
    this._perfilService.getPerfil().subscribe({
      next: (resp: any) => {
        this.filtrosRoles.push({ nombre: 'Todos' });
        this.roles = resp;
        this.filtrosRoles.push(...resp);
      },
      error: (error: any) => {
        console.error('Error al obtener los perfiles:', error);
      },
    });
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe((resp) => {
      console.log(resp);
      this.usuarios = resp.data;
    });
  }

  abrirModal(template: TemplateRef<any>, usuario?: any) {
    this.usuarioSeleccionado = usuario || null;
    if (usuario) {
      this.formUsuario.patchValue(usuario);
    } else {
      this.formUsuario.reset({ rol: 'visualizador' });
    }

    this.modalUsuarioRef = this.modalService.show(template, {
      class: 'modal-md modal-dialog-centered',
    });
  }

  guardarUsuario() {
    const data = this.formUsuario.value;
    if (this.usuarioSeleccionado) {
      this.alert
        .customAlertSweet('question', '¿Deseas actualizar este usuario?')
        .then((ok) => {
          if (!ok) return;

          this.usuariosService
            .updateUsuario(this.usuarioSeleccionado._id, data)
            .subscribe(() => {
              this.alert.showToast(
                'success',
                'Usuario actualizado correctamente'
              );
              this.cargarUsuarios();
              this.modalUsuarioRef?.hide();
            });
        });
    } else {
      this.usuariosService.createUsuario(data).subscribe(() => {
        this.alert.showToast('success', 'Usuario creado correctamente');
        this.cargarUsuarios();
        this.modalUsuarioRef?.hide();
      });
    }
  }

  cambiarEstado(usuario: any, estado: boolean) {
    const mensaje = estado ? 'habilitar' : 'deshabilitar';
    this.alert
      .customAlertSweet('warning', `¿Deseas ${mensaje} a ${usuario.nombre}?`)
      .then((ok) => {
        if (!ok) return;

        this.usuariosService
          .setEstadoUsuario(usuario._id, estado)
          .subscribe(() => {
            this.alert.showToast(
              'success',
              `Usuario ${estado ? 'habilitado' : 'deshabilitado'} correctamente`
            );
            this.cargarUsuarios();
          });
      });
  }

  filtrarUsuarios() {
    console.log(this.rolFiltro, 'rol para filtro..', this.estadoFiltro);

    if (this.rolFiltro === '' || this.rolFiltro.toLowerCase() == 'todos') {
      this.rolFiltro = '';
    }

    this.usuariosService.getUsuarios(this.rolFiltro).subscribe((resp) => {
      this.usuarios = resp.data;
    });
  }
}
