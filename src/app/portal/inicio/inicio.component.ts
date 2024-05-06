import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../env/env';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  map: mapboxgl.Map;
  screen1: boolean = true;
  screen2: boolean = false;

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
      lng: -79.470567,
      lat: -0.280185,
      title: 'Compresor 532',
      description: 'Compresor de aire 123',
      icono: 'compresor1',
    },
    {
      lng: -79.010628,
      lat: -2.889603,
      title: 'Compreso XYZ',
      description: 'Compresor de aire xyz',
      icono: 'compresor2',
    },
    {
      lng: -80.019348,
      lat: -4.08137,
      title: 'Compresor 532',
      description: 'Compresor de aire 123',
      icono: 'compresor3',
    },
    {
      lng: -78.601154,
      lat: -3.878762,
      title: 'Compreso XYZ',
      description: 'Compresor de aire xyz',
      icono: 'compresor1',
    },
    {
      lng: -76.528239,
      lat: -0.76438,
      title: 'Compresor 532',
      description: 'Compresor de aire 123',
      icono: 'compresor2',
    },
    {
      lng: -78.819907,
      lat: -1.231867,
      title: 'Compresor 532',
      description: 'Compresor de aire 123',
      icono: 'compresor3',
    },
    {
      lng: -79.940999,
      lat: -2.180744,
      title: 'Compreso XYZ',
      description: 'Compresor de aire xyz',
      icono: 'compresor1',
    },
    {
      lng: -78.467853,
      lat: 0.985788,
      title: 'Compresor 532',
      description: 'Compresor de aire 123',
      icono: 'compresor2',
    },
  ];

  ngOnInit(): void {
    this.initMap();
  }

  seleccionarIcono(icono: string): string {
    if (icono === 'compresor1') {
      return './assets/imgs/icons/compresor.png';
    } else if (icono === 'compresor2') {
      return './assets/imgs/icons/compresor2.png';
    } else if (icono === 'compresor3') {
      return './assets/imgs/icons/compresor3.png';
    } else {
      return './assets/imgs/icons/compresor.png';
    }
  }

  initMap() {
    setTimeout(() => {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: environment.map.mapbox_style,
        center: [-78.606495, -1.572575], // Centro del ecuador
        zoom: 5.8, // Nivel de zoom inicial
        accessToken: environment.map.api_key_mapbox,
      });

      this.markers.forEach((marker) => {
        const customMarkerElement = document.createElement('div');
        customMarkerElement.className = 'custom-marker';
        customMarkerElement.style.backgroundImage = `url(${this.seleccionarIcono(
          marker.icono
        )})`; // Coloca la imagen del marcador
        customMarkerElement.style.width = '30px';
        customMarkerElement.style.height = '30px';
        customMarkerElement.style.backgroundSize = 'contain'; // Ajusta el tamaño de la imagen
        customMarkerElement.style.backgroundPosition = 'center'; // Centra la imagen
        customMarkerElement.style.backgroundRepeat = 'no-repeat'; // Evita la repetición
        // Crea el marcador con el elemento de imagen personalizado
        const mapMarker = new mapboxgl.Marker(customMarkerElement)
          .setLngLat([marker.lng, marker.lat])
          .addTo(this.map);

        // Define el contenido de la ventana emergente
        const popup = new mapboxgl.Popup()
          .setHTML(`<div class="card" style="width: 100%; max-width: 23rem;">
              <div class="card-body" ">
                <h2> <i class="fa fa-map-marker" aria-hidden="true" style="color: red;"></i> ${marker.title}</h2>
                <p> <i class="fa fa-align-justify" aria-hidden="true"></i> ${marker.description}</p>
              </div>
            </div>`);

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
      const geocoder = new MapboxGeocoder({
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

      this.map.addControl(geocoder);
    }, 1000);
  }

  addMarker(lng: number, lat: number) {
    console.log('Se hizo clic en el marcador existente:', lng, lat);
  }
}
