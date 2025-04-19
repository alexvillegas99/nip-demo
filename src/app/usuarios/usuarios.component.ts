import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { SharedModule } from '../shared/shared.module';
import { SelectComponent } from '../shared/components/select/select.component';
import { CommonModule } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertService } from '../services/alert.service';
@Component({
  selector: 'app-usuarios',
  standalone: true,

  imports: [FormsModule, ReactiveFormsModule, SelectComponent, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuarioSeleccionado: any | null = null;

  formUsuario!: FormGroup;
  filtrosRoles = [
    {
      nombre: 'Todos',
      code: 1,
    },
    {
      nombre: 'Administrador',
      code: 2,
    },
    {
      nombre: 'Visualizador',
      code: 3,
    },
    {
      nombre: 'Operador',
      code: 4,
    },
  ];

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

  roles = ['Administrador', 'Visualizador', 'Operador'];
  cargos = ['Administrador', 'Operador'];
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private modalService: BsModalService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
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
    this.usuariosService.getUsuarios(this.rolFiltro).subscribe((resp) => {
      this.usuarios = resp.data;
    });
  }
}
