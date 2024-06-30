import { Routes } from '@angular/router';
import { LayoutUserComponent } from './layout/layout-user/layout-user.component';
import { HomeComponent } from './dashboard/home/home.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { MaintenanceComponent } from './dashboard/maintenance/maintenance.component';
import { Demo1Component } from './dashboard/demos/demo1/demo1.component';
import { Demo2Component } from './dashboard/demos/demo2/demo2.component';
import { InicioComponent } from './portal/inicio/inicio.component';
import { AlarmasComponent } from './portal/alarmas/alarmas.component';
import { DashboardComponent } from './portal/dashboard/dashboard.component';
import { PortalComponent } from './portal/portal.component';
import { LogisticaComponent } from './equipo-industrial/logistica/logistica.component';
import { MantenimientoComponent } from './equipo-industrial/mantenimiento/mantenimiento.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutUserComponent,
    children: [
      {
        path: '',
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
            redirectTo: 'home',
            pathMatch: 'full' // Esto asegura que solo redirija cuando la URL es exactamente vacía
          },
        ],
      },
      {
        path: 'reportes',
        title: 'Reportes',
        component: ReportsComponent,
      },
      {
        path: 'mantenimiento',
        title: 'Mantenimiento',
        component: MantenimientoComponent,
      },
      {
        path: 'demos/demo1',
        title: 'Compresor',
        component: Demo1Component,
      },
      {
        path: 'demos/demo2',
        title: 'Logística',
        component: Demo2Component,
      },
      {
        path: 'gestion',
        title: 'Gestión',
        component: LogisticaComponent,
      }
    ],
  },
];
