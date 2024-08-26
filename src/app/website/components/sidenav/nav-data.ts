import { INavbarData } from './helper';

export const NAVBARDATA: INavbarData[] = [
  {
    routeLink: './dashboard',
    icon: 'assets/imgs/navbar/portal-d.svg',
    label: 'Portal',
    items: [
      // {
      //     routeLink: './administracion-usuarios/gestion-usuarios',
      //     label: 'Administradores',
      //     icon: 'assets/imgs/navbar/portal-d.svg',
      // }
    ],
    // roles: ['ADMIN']
  },
  {
    routeLink: '',
    icon: 'assets/imgs/navbar/equipos-d.svg',
    label: 'Monitoreo',
    items: [
      {
        routeLink: '',
        label: 'Maquinaria y Equipos',
        icon: 'assets/imgs/navbar/maquinaria-d.svg',
        items: [
          {
            routeLink: './mantenimiento',
            label: 'Compresores',
            icon: '',
            items: [
              {
                routeLink: './reportes',
                icon: '',
                label: 'Compresor 1',
                items: [
                  // {
                  //     routeLink: './reportes',
                  //     label: 'Reporte Incidentes',
                  //     icon: 'assets/imgs/navbar/reporte-incidente-d.svg',
                  // },
                ],
              },
            ],
          },
          {
            routeLink: './gestion',
            label: 'Variadores',
            icon: '',
            items: [
              {
                routeLink: './reportes',
                icon: '',
                label: 'Variadores 1',
                items: [
                  // {
                  //     routeLink: './reportes',
                  //     label: 'Reporte Incidentes',
                  //     icon: 'assets/imgs/navbar/reporte-incidente-d.svg',
                  // },
                ],
              },
            ],
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
            label: 'Sensor de Presión',
            icon: '',
            items: [],
          },
          {
            routeLink: './gestion',
            label: 'Medidores',
            icon: '',
            items: [
              {
                routeLink: './mantenimiento',
                label: 'Medidor 1',
                icon: '',
                items: [],
              },
              {
                routeLink: './mantenimiento',
                label: 'Medidor 2',
                icon: '',
                items: [],
              },
            ],
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
      },
      // {
      //     routeLink: '',
      //     label: 'Variadores',
      //     icon: 'assets/imgs/navbar/medidor-d.svg',
      //     items: [
      //         {
      //             routeLink: './mantenimiento',
      //             label: 'Mantenimiento',
      //             icon: 'assets/imgs/navbar/mantenimiento-d.svg',
      //         },
      //         {
      //             routeLink: './gestion',
      //             label: 'Gestión',
      //             icon: 'assets/imgs/navbar/reportes-d.svg',
      //         }
      //     ]
      // },
    ],
    // roles: ['ADMIN', 'BASIC']
  },
  {
    routeLink: '',
    icon: 'assets/imgs/navbar/mantenimiento-d.svg',
    label: 'Mantenimiento',
    items: [
      {
        routeLink: '',
        label: 'Gestión de Mantenimiento',
        icon: 'assets/imgs/navbar/gest-mantenimiento-d.svg',
        items: [
          {
            routeLink: './gestion',
            label: 'Pedidos',
            icon: '',
            items: [],
          },
          {
            routeLink: './gestion',
            label: 'Tareas',
            icon: '',
            items: [],
          },
        ],
      },
      {
        routeLink: '',
        label: 'Maquinaria y Equipos',
        icon: 'assets/imgs/navbar/maquinaria-d.svg',
        items: [
          {
            routeLink: './mantenimiento',
            label: 'Compresores',
            icon: '',
            items: [
              {
                routeLink: './reportes',
                icon: '',
                label: 'Compresor 1',
                items: [
                  // {
                  //     routeLink: './reportes',
                  //     label: 'Reporte Incidentes',
                  //     icon: 'assets/imgs/navbar/reporte-incidente-d.svg',
                  // },
                ],
              },
            ],
          },
          {
            routeLink: './gestion',
            label: 'Variadores',
            icon: '',
            items: [
              {
                routeLink: './reportes',
                icon: '',
                label: 'Variadores 1',
                items: [
                  // {
                  //     routeLink: './reportes',
                  //     label: 'Reporte Incidentes',
                  //     icon: 'assets/imgs/navbar/reporte-incidente-d.svg',
                  // },
                ],
              },
            ],
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
            label: 'Sensor de Presión',
            icon: '',
            items: [],
          },
          {
            routeLink: './gestion',
            label: 'Medidor de Energía',
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
      },
    ],
    // roles: ['ADMIN', 'BASIC']
  },
  {
    routeLink: './mantenimiento',
    icon: 'assets/imgs/navbar/configuracion-d.svg',
    label: 'Configuración',
    items: [],
    // roles: ['ADMIN', 'BASIC']
  },
];
