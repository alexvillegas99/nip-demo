import { INavbarData } from './helper';

export const NAVBARDATA: INavbarData[] = [
  {
    routeLink: 'portal/home',
    icon: 'assets/imgs/navbar/portal-d.svg',
    label: 'Portal',
    items: [],
    roles: ['Superadministrador','Administrador', 'Operador'],
  },
  {
    routeLink: 'monitoreo',
    icon: 'assets/imgs/navbar/equipos-d.svg',
    label: 'Monitoreo',
    items: [
      // {
      //   routeLink: 'maquinaria-equipos',
      //   label: 'Maquinaria y Equipos',
      //   icon: 'assets/imgs/navbar/maquinaria-d.svg',
      //   items: [
      //     {
      //       routeLink: 'monitoreo/maquinaria-equipos/gestion-comprensor',
      //       label: 'Compresores',
      //       icon: '',
      //       items: [],
      //     },
      //     // {
      //     //   routeLink: 'gestion-variador',
      //     //   label: 'Variadores',
      //     //   icon: '',
      //     //   items: [],
      //     // },
      //   ],
      // },
      // {
      //   routeLink: 'instrumentacion-medidores',
      //   label: 'Instrumentación y medidores',
      //  icon: 'assets/imgs/navbar/inst-medidores-d.svg',
      //  items: [
      // {
      //   routeLink: 'mantenimiento',
      //   label: 'Sensor de Presión',
      //   icon: '',
      //   items: [],
      // },
      {
        routeLink: 'monitoreo/instrumentacion/gestion/medidores',
        label: 'Medidores de energía',
        icon: '',
        items: [],
      },
      {
        routeLink: 'monitoreo/instrumentacion/gestion/variadores',
        label: 'Variadores de frecuencia',
        icon: '',
        items: [],
      },
      //  ],
      //  },
      /*  {
        routeLink: '',
        label: 'Procesos',
        icon: 'assets/imgs/navbar/procesos.svg',
        items: [
          {
            routeLink: './mantenimiento',
            label: 'Proceso IP',
            icon: '',
            items: [],
          },
        ],
      }, */
      /*  {
        routeLink: './monitoreo/reportes',
        icon: 'assets/imgs/navbar/reporteria-d.svg',
        label: 'Reportes',
        items: [],
        // roles: ['ADMIN', 'BASIC']
      }, */
    ],
    roles: ['Superadministrador','Administrador', 'Operador'],
  },
  {
    routeLink: 'mantenimiento',
    icon: 'assets/imgs/navbar/mantenimiento-d.svg',
    label: 'Mantenimiento',
    items: [
      {
        routeLink: './mantenimiento/gestion-mantenimiento',
        label: 'Gestión de Mantenimiento',
        icon: 'assets/imgs/navbar/gest-mantenimiento-d.svg',
        items: [],
      },
      {
        routeLink: './mantenimiento/orometro',
        label: 'Gestión de  Horometro',
        icon: 'assets/imgs/navbar/gest-mantenimiento-d.svg',
        items: [],
      },
    ],
    roles: ['Superadministrador','Administrador', 'Operador'],
  },
  {
    routeLink: './configuracion',
    icon: 'assets/imgs/navbar/configuracion-d.svg',
    label: 'Configuración',
    items: [
      {
        routeLink: './configuracion/gestion-equipos',
        label: 'Gestión de Equipos',
        icon: 'assets/imgs/navbar/inst-medidores-d.svg',
        items: [],
      },
      {
        routeLink: './configuracion/gestion-perfiles',
        label: 'Gestión de Perfiles',
        icon: 'assets/imgs/navbar/inst-medidores-d.svg',
        items: [],
      },
    ],
    roles: ['Superadministrador'],
  },
  {
    routeLink: './usuarios',
    icon: 'assets/imgs/navbar/user.svg',
    label: 'Usuarios',
    items: [],
    roles: ['Superadministrador','Administrador'],
  },
];
