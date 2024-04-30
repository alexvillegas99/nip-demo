import { Routes } from '@angular/router';
import { LayoutUserComponent } from './layout/layout-user/layout-user.component';
import { HomeComponent } from './dashboard/home/home.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { MaintenanceComponent } from './dashboard/maintenance/maintenance.component';
import { Demo1Component } from './dashboard/demos/demo1/demo1.component';
import { Demo2Component } from './dashboard/demos/demo2/demo2.component';

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
        title:'Panel de control',
        component:HomeComponent
      },
      {
        path: 'reportes',
        title:'Reportes',
       component:ReportsComponent
      },
      {
        path: 'mantenimiento',
        title:'Mantenimiento',
        component:MaintenanceComponent
      },
      {
        path:'demos/demo1',
        title:'Compresor',
        component:Demo1Component
      },
      {
        path:'demos/demo2',
        title:'Logística',
        component:Demo2Component
      },
   
    
    ],
  },
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Inicio',
        loadComponent: () =>
          import('./dashboard/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
 

];
