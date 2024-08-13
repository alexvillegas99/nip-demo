import { INavbarData } from "./helper";

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
        routeLink: './configuracion/gestion-documentos',
        icon: 'assets/imgs/navbar/equipos-d.svg',
        label: 'Equipo Industrial',
        items: [
            {
                routeLink: '',
                label: 'Medidor',
                icon: 'assets/imgs/navbar/medidor-d.svg',
                items: [
                    {
                        routeLink: '',
                        label: 'Mantenimiento',
                        icon: 'assets/imgs/navbar/mantenimiento-d.svg',
                    },
                    {
                        routeLink: '',
                        label: 'Gestión',
                        icon: 'assets/imgs/navbar/reportes-d.svg',
                    }
                ]
            },
            {
                routeLink: '',
                label: 'Variadores',
                icon: 'assets/imgs/navbar/medidor-d.svg',
                items: [
                    {
                        routeLink: '',
                        label: 'Mantenimiento',
                        icon: 'assets/imgs/navbar/mantenimiento-d.svg',
                    },
                    {
                        routeLink: '',
                        label: 'Gestión',
                        icon: 'assets/imgs/navbar/reportes-d.svg',
                    }
                ]
            },
        ],
        // roles: ['ADMIN', 'BASIC']
    },
    {
        routeLink: './configuracion/gestion-documentos',
        icon: 'assets/imgs/navbar/consumo-energetico-d.svg',
        label: 'Consumo Energético',
        items: [
            // {
            //     routeLink: './configuracion/gestion-nivel-1',
            //     label: 'Módulos',
            // },
        ],
        // roles: ['ADMIN', 'BASIC']
    },
    {
        routeLink: './configuracion/gestion-documentos',
        icon: 'assets/imgs/navbar/reporteria-d.svg',
        label: 'Reportes',
        items: [
            {
                routeLink: './configuracion/gestion-nivel-1',
                label: 'Reporte Incidentes',
                icon: 'assets/imgs/navbar/reporte-incidente-d.svg',
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
