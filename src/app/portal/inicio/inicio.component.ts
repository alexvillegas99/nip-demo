import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../env/env';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataPlcService } from '../../services/data-plc.service';
import { NgxGaugeModule } from 'ngx-gauge';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule,NgxGaugeModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  encapsulation: ViewEncapsulation.None // Para desactivar el encapsulamiento
})
export class InicioComponent implements OnInit {
  map: mapboxgl.Map;
  screen1: boolean = true; 
  screen2: boolean = false;
  gaugeValue =10;
  markerConfig = {
    '50': {color: '#ff0000', type: 'line', size: 10},
    '70': {color: 'black', type: 'line', size: 10}
  };
  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75': {color: 'red'}
  };
  
  constructor(
    private readonly dataPlc:DataPlcService
  ) {}

  cambiarScreen(id: number) {
    if (id === 1) {
      this.screen1 = true;
      this.screen2 = false;
      this.initMap();
    } else if (id === 2) {
      this.screen1 = false;
      this.screen2 = true;
    }
  }

  markers: any[] = [
    {
      lng: -78.454786,
      lat: -0.3431066,
      title: 'Danec',
      description: 'Equipos industriales',
      icono: 'assets/logo.jpg',
    },
  ];
  
  arrayEquipos: any[] = [
    
  ];

  ngOnInit(): void {
    this.initMap();
    this.getIps();
  }
  getIps() {
    console.log('obteniendo ips');
    this.dataPlc.getIps().subscribe({
      next: (data) => {
        console.log('Data:', data);
        this.getDataPlc(data);
      },
      error: (error) => {
        console.error('Error:', error
        );
      }
    })
  }
  getDataPlc(data: any) {
    const ips = data.ip.split(',');
    console.log('Ips:', ips);
    for (let i = 0; i < ips.length; i++) {
      const ip = ips[i];
      console.log('Ip:', ip);
      this.dataPlc.getData({ ip: ip }).subscribe({
        next: (data) => {
          console.log('Data:', data);
          this.arrayEquipos.push({
            nombre: data['Product & Features']['Product & Features']['Meter Name'],
            ubicacion:'Quito',
            tipo: 'Medidor'
          })
          
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    }

  }

  seleccionarIcono(icono: string): string {

      return './assets/imgs/equipo.png';
    
  }

  initMap() {
    setTimeout(() => {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: environment.map.mapbox_style,
        center: [-78.606495, -1.572575], // Centro del ecuador
        zoom: 6.2, // Nivel de zoom inicial
        accessToken: environment.map.api_key_mapbox,
      });

      this.markers.forEach((marker) => {
        const customMarkerElement = document.createElement('div');
        customMarkerElement.className = 'custom-marker';
        customMarkerElement.style.backgroundImage = `url(${marker.icono})`; // Coloca la imagen del marcador
        customMarkerElement.style.width = '50px';
        customMarkerElement.style.height = '50px';
        customMarkerElement.style.borderRadius = '50%';
        customMarkerElement.style.backgroundSize = 'contain'; // Ajusta el tamaño de la imagen
        customMarkerElement.style.backgroundPosition = 'center'; // Centra la imagen
        customMarkerElement.style.backgroundRepeat = 'no-repeat'; // Evita la repetición
        // Crea el marcador con el elemento de imagen personalizado
        const mapMarker = new mapboxgl.Marker(customMarkerElement)
          .setLngLat([marker.lng, marker.lat])
          .addTo(this.map);

        // Define el contenido de la ventana emergente
        const popup = new mapboxgl.Popup({ closeButton: false, className: 'card' })
        .setHTML(`
       
            <div class="card-body">
              <h2 class="card-title">
                <i class="fa fa-map-marker" aria-hidden="true" style="color: red;"></i> ${marker.title}
              </h2>
              <p class="card-text">
                <i class="fa fa-info" aria-hidden="true"></i> ${marker.description}
              </p>
            </div>
      
        `);
      
      

        // Asocia la ventana emergente al marcador
        mapMarker.setPopup(popup);

        // Añade eventos de mouseenter y mouseleave para mostrar y ocultar la ventana emergente
        mapMarker.getElement().addEventListener('mouseenter', () => {
          mapMarker.togglePopup();
        });

        mapMarker.getElement().addEventListener('mouseleave', () => {
          mapMarker.togglePopup();
        });

        mapMarker.getElement().addEventListener('click', () => {
          this.cambiarScreen(2);
          console.log('Clic en el marcador:', marker);
        });
      });

      // Configura el control geocoder para que no agregue automáticamente un marcador
 /*      const geocoder = new MapboxGeocoder({
        accessToken: environment.map.api_key_mapbox,
        placeholder: 'Ingrese una dirección',
        mapboxgl: mapboxgl,
        marker: false, // Deshabilita el marcador
        trackProximity: true, // Deshabilita el seguimiento de la ubicación cercana
      });
      geocoder.on('result', (event) => {
        const lng = event.result.center[0];
        const lat = event.result.center[1];
        this.addMarker(lng, lat);
      });

      this.map.addControl(geocoder); */
    }, 1000);
  }

  addMarker(lng: number, lat: number) {
    console.log('Se hizo clic en el marcador existente:', lng, lat);
  }
}
