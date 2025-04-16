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



  markers: any[] = [
    
   
  ];
  
  arrayEquipos: any[] = [
    
  ];

  ngOnInit(): void {
    this.initMap();
    this.getDataPlc();
  }

  getDataPlc() {
      this.dataPlc.getListaEquipos().subscribe({
        next: (data) => {
          console.log('Data:', data);
         
          data=  data.filter((item: any) => item.tipo === 'variador');
          
          data.forEach((element:any) => {
            this.arrayEquipos.push({
              nombre: element.nombre, 
              ip: element.ip,
              ubicacion:'Ambato',
              tipo: 'Medidor',
              imagen:element.imagen,
            })
          });
          this.markers = data.map((element:any) => ({
            lng: element.ubicacion.split(',')[0],
            lat: element.ubicacion.split(',')[1],
            title: element.nombre,
            description: element.tipo +' - ' + element.modelo + ' - ' + element.serie,
            icono: 'assets/logo.png',

          })
        );
            console.log('Markers:', this.markers);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    

  }

  seleccionarIcono(icono: string): string {

      return './assets/imgs/equipo.png';
    
  }

  initMap() {
    setTimeout(() => {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: environment.map.mapbox_style,
        center: [-78.581389,-1.241389], // Centro del ecuador
        zoom: 12, // Nivel de zoom inicial
        accessToken: environment.map.api_key_mapbox,
      });

      this.markers.forEach((marker) => {
        const customMarkerElement = document.createElement('div');
        customMarkerElement.className = 'custom-marker';
        customMarkerElement.style.backgroundImage = `url(${marker.icono})`; // Coloca la imagen del marcador
        customMarkerElement.style.width = '50px';
        customMarkerElement.style.height = '50px';
        customMarkerElement.style.backgroundColor = 'white'; // Color de fondo del marcador
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
               ${marker.description}
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
