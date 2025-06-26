import { Routes } from '@angular/router';
import { InicioComponent } from './portal/inicio/inicio.component';
import { AlarmasComponent } from './portal/alarmas/alarmas.component';
import { DashboardComponent } from './portal/dashboard/dashboard.component';
import { PortalComponent } from './portal/portal.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { LayoutComponent } from './website/components/layout/layout.component';
import { ConsumoEnergeticoComponent } from './monitoreo/instrumentacion-medidores/gestion-medidor/consumo-energetico/consumo-energetico.component';
import { MonitoreoComponent } from './monitoreo/monitoreo.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { InstrumentacionMedidoresComponent } from './monitoreo/instrumentacion-medidores/instrumentacion-medidores.component';
import { MaquinariaEquiposComponent } from './monitoreo/maquinaria-equipos/maquinaria-equipos.component';
import { ProcesosComponent } from './monitoreo/procesos/procesos.component';
import { ReportesComponent } from './monitoreo/reportes/reportes.component';
import { GestionMedidorComponent } from './monitoreo/instrumentacion-medidores/gestion-medidor/gestion-medidor.component';
import { GestionVariadorComponent } from './monitoreo/maquinaria-equipos/gestion-variador/gestion-variador.component';
import { MedidoresComponent } from './monitoreo/instrumentacion-medidores/gestion-medidor/medidores/medidores.component';
import { GestionComprensorComponent } from './monitoreo/maquinaria-equipos/gestion-comprensor/gestion-comprensor.component';
import { ComprensoresComponent } from './monitoreo/maquinaria-equipos/gestion-comprensor/comprensores/comprensores.component';
import { VisualizadorPersonalizadoComponent } from './monitoreo/instrumentacion-medidores/gestion-medidor/visualizador-personalizado/visualizador-personalizado.component';
import { GestionMantenimientoComponent } from './mantenimiento/gestion-mantenimiento/gestion-mantenimiento.component';
import { PantallaMedidoresComponent } from './monitoreo/instrumentacion-medidores/gestion-medidor/pantalla-medidores/pantalla-medidores.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PantallaVariadoresComponent } from './monitoreo/instrumentacion-medidores/gestion-variadores/pantalla-variadores/pantalla-variadores.component';
import { VariadoresComponent } from './monitoreo/instrumentacion-medidores/gestion-variadores/variadores/variadores.component';
import { OrometroComponent } from './mantenimiento/orometro/orometro.component';
import { ListaEquipoComponent } from './configuracion/lista-equipo/lista-equipo.component';
import { PerfilComponent } from './configuracion/perfil/perfil.component';
import { EstaLogeadoGuard } from './core/guards/esta-logeado.guard';
import { RoleGuard } from './core/guards/rol.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'portal',
        title: 'Portal',
        component: PortalComponent,
        canActivate: [EstaLogeadoGuard],
        children: [
           {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
          {
            path: 'home',
            title: 'Inicio',
            component: InicioComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
          },
          {
            path: 'alarmas',
            title: 'Alarmas',
            component: AlarmasComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
          },
          {
            path: 'dashboard',
            title: 'Dashboard',
            component: DashboardComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
          },
          {
            path: '',
            redirectTo: 'portal/home',
            pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
          },
        ],
      },
      {
        path: 'monitoreo',
        title: 'Monitoreo',
        component: MonitoreoComponent,
        canActivate: [EstaLogeadoGuard],
        children: [
          {
            path: 'maquinaria-equipos',
            title: 'Maquinaria y equipos',
            component: MaquinariaEquiposComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
            children: [
              {
                path: 'gestion-comprensor',
                title: 'Gestión de Comprensores',
                component: GestionComprensorComponent,
                canActivate: [EstaLogeadoGuard, RoleGuard],
                data: {
                  roles: ['Superadministrador', 'Administrador', 'Operador'],
                },
                children: [
                  {
                    path: ':id/comprensor',
                    title: 'Comprensor',
                    component: ComprensoresComponent,
                    canActivate: [EstaLogeadoGuard, RoleGuard],
                    data: {
                      roles: ['Superadministrador', 'Administrador', 'Operador'],
                    },
                  },
                ],
              },
              {
                path: 'gestion-variador',
                title: 'Gestión de Variadores',
                component: GestionVariadorComponent,
                canActivate: [EstaLogeadoGuard, RoleGuard],
                data: {
                  roles: ['Superadministrador', 'Administrador', 'Operador'],
                },
                children: [
                  {
                    path: ':id/variador',
                    title: 'Medidor',
                    component: VariadoresComponent,
                    canActivate: [EstaLogeadoGuard, RoleGuard],
                    data: {
                      roles: ['Superadministrador', 'Administrador', 'Operador'],
                    },
                  },
                ],
              },
              {
                path: '',
                redirectTo: 'medidor',
                pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
              },
            ],
          },
          {
            path: 'instrumentacion',
            title: 'Instrumentacion y medidores',
            component: InstrumentacionMedidoresComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
            children: [
              {
                path: 'gestion/:id',
                title: 'Gestión de Medidores',
                component: GestionMedidorComponent,
                canActivate: [EstaLogeadoGuard, RoleGuard],
                data: {
                  roles: ['Superadministrador', 'Administrador', 'Operador'],
                },
              },
              {
                path: ':id/pantalla-medidores',
                title: '',
                component: PantallaMedidoresComponent,
                canActivate: [EstaLogeadoGuard, RoleGuard],
                data: {
                  roles: ['Superadministrador', 'Administrador', 'Operador'],
                },
                children: [
                  {
                    path: 'medidor',
                    title: 'Medidor',
                    component: MedidoresComponent,
                    canActivate: [EstaLogeadoGuard, RoleGuard],
                    data: {
                      roles: ['Superadministrador', 'Administrador', 'Operador'],
                    },
                  },
                  {
                    path: 'consumo-energetico',
                    title: 'Consumo energético',
                    component: ConsumoEnergeticoComponent,
                    canActivate: [EstaLogeadoGuard, RoleGuard],
                    data: {
                      roles: ['Superadministrador', 'Administrador', 'Operador'],
                    },
                  },
                  {
                    path: 'visualizador-personalizado',
                    title: 'Consumo energético',
                    component: VisualizadorPersonalizadoComponent,
                    canActivate: [EstaLogeadoGuard, RoleGuard],
                    data: {
                      roles: ['Superadministrador', 'Administrador', 'Operador'],
                    },
                  },
                  {
                    path: '',
                    redirectTo: 'medidor',
                    pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
                  },
                ],
              },
              {
                path: ':id/pantalla-variadores',
                title: '',
                component: PantallaVariadoresComponent,
                canActivate: [EstaLogeadoGuard, RoleGuard],
                data: {
                  roles: ['Superadministrador', 'Administrador', 'Operador'],
                },
                children: [
                  {
                    path: 'variador',
                    title: 'Variador',
                    component: VariadoresComponent,
                    canActivate: [EstaLogeadoGuard, RoleGuard],
                    data: {
                      roles: ['Superadministrador', 'Administrador', 'Operador'],
                    },
                  },
                ],
              },
            ],
          },
          {
            path: 'procesos',
            title: 'Procesos',
            component: ProcesosComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
          },
          {
            path: 'reportes',
            title: 'Reportes',
            component: ReportesComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
          },
          {
            path: '',
            redirectTo: 'reportes',
            pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
          },
        ],
      },
      {
        path: 'mantenimiento',
        title: 'Mantenimiento',
        component: MantenimientoComponent,
        canActivate: [EstaLogeadoGuard],
        children: [
          {
            path: 'gestion-mantenimiento',
            title: 'Gestión mantenimiento',
            component: GestionMantenimientoComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
          },
          {
            path: 'orometro',
            title: 'Gestión de Orometro',
            component: OrometroComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador', 'Administrador', 'Operador'],
            },
          },
          /*  {
            path: '',
            redirectTo: 'gestion-mantenimiento',
            pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
          }, */
        ],
      },
      {
        path: 'configuracion',
        title: 'Configuracion',
        component: ConfiguracionComponent,
        canActivate: [EstaLogeadoGuard],
        children: [
          {
            path: 'gestion-equipos',
            title: 'Gestión de equipos',
            component: ListaEquipoComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador'],
            },
          },
          {
            path: 'gestion-perfiles',
            title: 'Gestión de Perfiles',
            component: PerfilComponent,
            canActivate: [EstaLogeadoGuard, RoleGuard],
            data: {
              roles: ['Superadministrador'],
            },
          },
          {
            path: '',
            redirectTo: 'gestion-equipos',
            pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
          },
        ],
      },
      {
        path: 'usuarios',
        title: 'usuarios',
        component: UsuariosComponent,
        canActivate: [EstaLogeadoGuard, RoleGuard],
        data: {
          roles: ['Superadministrador', 'Administrador'],
        },
      },
      {
        path: '',
        redirectTo: 'portal',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
