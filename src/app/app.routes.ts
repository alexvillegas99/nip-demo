import { VariadoresComponent } from './monitoreo/maquinaria-equipos/gestion-variador/variadores/variadores.component';
import { Routes } from '@angular/router';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { Demo1Component } from './dashboard/demos/demo1/demo1.component';
import { Demo2Component } from './dashboard/demos/demo2/demo2.component';
import { InicioComponent } from './portal/inicio/inicio.component';
import { AlarmasComponent } from './portal/alarmas/alarmas.component';
import { DashboardComponent } from './portal/dashboard/dashboard.component';
import { PortalComponent } from './portal/portal.component';
import { LogisticaComponent } from './equipo-industrial/logistica/logistica.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { LayoutComponent } from './website/components/layout/layout.component';
import { ConsumoEnergeticoComponent } from './consumo-energetico/consumo-energetico.component';
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
                    title: 'Medidor',
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
                path: 'gestion-medidor/:id/medidor',
                title: 'Medidor',
                component: MedidoresComponent,
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
      // }
      {
        path: '',
        redirectTo: 'portal',
        pathMatch: 'full', // Esto asegura que solo redirija cuando la URL es exactamente vacía
      },
    ],
  },
];
