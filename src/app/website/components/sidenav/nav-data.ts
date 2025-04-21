import { INavbarData } from './helper';

export const NAVBARDATA: INavbarData[] = [
  {
    routeLink: 'portal',
    icon: 'assets/imgs/navbar/portal-d.svg',
    label: 'Portal',
    items: [],
    // roles: ['ADMIN']
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
      {
        routeLink: 'instrumentacion-medidores',
        label: 'Instrumentación y medidores',
        icon: 'assets/imgs/navbar/inst-medidores-d.svg',
        items: [
          // {
          //   routeLink: 'mantenimiento',
          //   label: 'Sensor de Presión',
          //   icon: '',
          //   items: [],
          // },
          {
            routeLink: 'monitoreo/instrumentacion/gestion/medidores',
            label: 'Medidores',
            icon: '',
            items: [],
          }, 
          {
            routeLink: 'monitoreo/instrumentacion/gestion/variadores',
            label: 'Variadores',
            icon: '',
            items: [],
          },
        ],
      },
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
    // roles: ['ADMIN', 'BASIC']
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
        items: [
        ],
      },
      {
        routeLink: './mantenimiento/orometro',
        label: 'Gestión de  Horometro',
        icon: 'assets/imgs/navbar/gest-mantenimiento-d.svg',
        items: [
        ],
      },
    
    
     /*  {
        routeLink: '',
        label: 'Maquinaria y Equipos',
        icon: 'assets/imgs/navbar/maquinaria-d.svg',
        items: [
          {
            routeLink: './mantenimiento',
            label: 'Compresores',
            icon: '',
            items: [],
          },
          {
            routeLink: './gestion',
            label: 'Variadores',
            icon: '',
            items: [],
          },
        ],
      },
      {
        routeLink: '',
        label: 'Instrumentación y medidores',
        icon: 'assets/imgs/navbar/inst-medidores-d.svg',
        items: [
          {
            routeLink: './mantenimiento',
            label: 'Sensores de Presión',
            icon: '',
            items: [],
          },
          {
            routeLink: './gestion',
            label: 'Medidores',
            icon: '',
            items: [],
          },
        ],
      },
      {
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
      },
      {
        routeLink: './reportes',
        icon: 'assets/imgs/navbar/reporteria-d.svg',
        label: 'Reportes',
        items: [
          // {
          //     routeLink: './reportes',
          //     label: 'Reporte Incidentes',
          //     icon: 'assets/imgs/navbar/reporte-incidente-d.svg',
          // },
        ],
        // roles: ['ADMIN', 'BASIC']
      }, */
    ],
    // roles: ['ADMIN', 'BASIC']
  },
  {
    routeLink: './configuracion',
    icon: 'assets/imgs/navbar/configuracion-d.svg',
    label: 'Configuración',
    items: [],
    // roles: ['ADMIN', 'BASIC']
  },
  {
    routeLink: './usuarios',
    icon: 'assets/imgs/navbar/user.svg',
    label: 'Usuarios',
    items: [],
    // roles: ['ADMIN', 'BASIC']
  },
];
