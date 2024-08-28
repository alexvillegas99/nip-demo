import { VariadoresComponent } from './monitoreo/maquinaria-equipos/gestion-variador/variadores/variadores.component';
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
        children: [
          {
            path: 'home',
            title: 'Inicio',
            component: InicioComponent,
          },
          {
            path: 'alarmas',
            title: 'Alarmas',
            component: AlarmasComponent,
          },
          {
            path: 'dashboard',
            title: 'Dashboard',
            component: DashboardComponent,
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
        children: [
          {
            path: 'maquinaria-equipos',
            title: 'Maquinaria y equipos',
            component: MaquinariaEquiposComponent,
            children: [
              {
                path: 'gestion-comprensor',
                title: 'Gestión de Comprensores',
                component: GestionComprensorComponent,
                children: [
                  {
                    path: ':id/comprensor',
                    title: 'Comprensor',
                    component: ComprensoresComponent,
                  },
                ],
              },
              {
                path: 'gestion-variador',
                title: 'Gestión de Variadores',
                component: GestionVariadorComponent,
                children: [
                  {
                    path: ':id/variador',
                    title: 'Medidor',
                    component: VariadoresComponent,
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
            path: 'instrumentacion-medidores',
            title: 'Instrumentacion y medidores',
            component: InstrumentacionMedidoresComponent,
            children: [
              {
                path: 'gestion-medidor',
                title: 'Gestión de Medidores',
                component: GestionMedidorComponent,
              },
              {
                path: ':id/pantalla-medidores',
                title: '',
                component: PantallaMedidoresComponent,
                children: [
                  {
                    path: 'medidor',
                    title: 'Medidor',
                    component: MedidoresComponent,
                  },
                  {
                    path: 'consumo-energetico',
                    title: 'Consumo energético',
                    component: ConsumoEnergeticoComponent,
                  },
                  {
                    path: 'visualizador-personalizado',
                    title: 'Consumo energético',
                    component: VisualizadorPersonalizadoComponent,
                  },
                ],
              },
            ],
          },
          {
            path: 'procesos',
            title: 'Procesos',
            component: ProcesosComponent,
          },
          {
            path: 'reportes',
            title: 'Reportes',
            component: ReportesComponent,
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
        children: [
          {
            path: 'gestion-mantenimiento',
            title: 'Gestión mantenimiento',
            component: GestionMantenimientoComponent,
          },
          {
            path: '',
            redirectTo: 'gestion-mantenimiento',
            pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
          },
        ],
      },
      {
        path: 'configuracion',
        title: 'Configuracion',
        component: ConfiguracionComponent,
      },
      // {
      //   path: 'demos/demo1',
      //   title: 'Compresor',
      //   component: Demo1Component,
      // },
      // {
      //   path: 'demos/demo2',
      //   title: 'Logística',
      //   component: Demo2Component,
      // },
      // {
      //   path: 'gestion',
      //   title: 'Gestión',
      //   component: LogisticaComponent,
      // },
      // {
      //   path: 'reportes',
      //   title: 'Reportes',
      //   component: ReportsComponent,
      // },
      // {
      //   path: 'consumo-energetico',
      //   title: 'Consumo energético',
      //   component: ConsumoEnergeticoComponent,
      // },
      {
        path: '',
        redirectTo: 'portal',
        pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
      },
    ],
  },
];
