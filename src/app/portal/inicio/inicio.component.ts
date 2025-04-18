import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../env/env';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataPlcService } from '../../services/data-plc.service';
import { NgxGaugeModule } from 'ngx-gauge';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxGaugeModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InicioComponent implements OnInit, OnDestroy {
  map: mapboxgl.Map;
  screen1 = true;
  screen2 = false;
  gaugeValue = 10;
  intervaloPlc: any;

  markers: any[] = [];
  arrayEquipos: any[] = [];
  plcData: any[] = [];

  markerConfig = {
    '50': { color: '#ff0000', type: 'line', size: 10 },
    '70': { color: 'black', type: 'line', size: 10 },
  };

  thresholdConfig = {
    '0': { color: 'green' },
    '40': { color: 'orange' },
    '75': { color: 'red' },
  };

  constructor(
    private readonly dataPlc: DataPlcService,
    private readonly socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.getDataPlc();

    this.socketService.sendFindPlcDataAll();
    this.intervaloPlc = setInterval(() => {
      this.socketService.sendFindPlcDataAll();
    }, 10000);

    this.socketService.receivePlcDataAll().subscribe((data) => {
      this.plcData = data;
      console.log('📡 Datos PLC recibidos:', data);
      this.actualizarEstados(data);
      this.renderMarkers();
    });
  }

  ngOnDestroy(): void {
    if (this.intervaloPlc) clearInterval(this.intervaloPlc);
  }

  getDataPlc() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        this.arrayEquipos = data.map((element: any) => ({
          nombre: element.nombre,
          ip: element.ip,
          ubicacion: 'Ambato',
          tipo: element.tipo,
          imagen: element.imagen,
        }));

        this.markers = data.map((element: any) => ({
          lng: element.ubicacion.split(',')[0],
          lat: element.ubicacion.split(',')[1],
          title: element.nombre,
          description: `${element.tipo} - ${element.modelo} - ${element.serie}`,
          icono: element.imagen,
          tipo: element.tipo,
          ip: element.ip,
        }));

        console.log('Markers:', this.markers);
        this.initMap();
      },
      error: (error) => console.error('Error al obtener equipos:', error),
    });
  }

  actualizarEstados(dataSocket: any[]) {
    this.arrayEquipos = this.arrayEquipos.map((equipo) => {
      if (equipo.tipo === 'variador') {
        const plcInfo = dataSocket.find((p) => p.IP === equipo.ip);
        if (plcInfo) {
          equipo.estado = plcInfo.RUN === 1 ? 'RUN' : plcInfo.FLT === 1 ? 'FALLA' : 'READY';
        } else {
          equipo.estado = 'SIN DATOS';
        }
      }
      return equipo;
    });
    console.log('Estado de los equipos actualizado:', this.arrayEquipos);
  }

  initMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: environment.map.mapbox_style,
      center: [-78.581389, -1.241389],
      zoom: 12,
      accessToken: environment.map.api_key_mapbox,
    });
    this.renderMarkers();
  }

  renderMarkers() {
    if (!this.map) return;

    // Remover todos los marcadores anteriores
    document.querySelectorAll('.mapboxgl-marker').forEach(el => el.remove());

    this.markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = `url(${marker.icono})`;
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.borderRadius = '50%';
      el.style.backgroundSize = 'contain';
      el.style.backgroundPosition = 'center';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.border = '4px solid transparent';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
      el.style.padding = '2px';

      const equipoEstado = this.arrayEquipos.find((e) => e.ip === marker.ip);
      if (marker.tipo === 'variador') {
        if (equipoEstado?.estado === 'RUN') {
          el.style.border = '5px solid #22c55e';
          el.style.boxShadow = '0 0 12px #22c55e88';
        } else if (equipoEstado?.estado === 'FALLA') {
          el.style.border = '5px solid #ef4444';
          el.style.boxShadow = '0 0 12px #ef444488';
        } else {
          el.style.border = '5px solid #facc15';
          el.style.boxShadow = '0 0 12px #facc1588';
        }
      } else {
        el.style.border = '5px solid #22c55e';
        el.style.boxShadow = '0 0 12px #22c55e88';
      }

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map);

      const popup = new mapboxgl.Popup({ closeButton: false, className: 'popup-card' }).setHTML(`
        <div class="popup-card-body">
          <h3 class="popup-card-title">
            <i class="fa fa-map-marker-alt" style="color: #ef4444; margin-right: 6px;"></i> ${marker.title}
          </h3>
          <p class="popup-card-text">${marker.description}</p>
          <p class="popup-card-estado">
            <strong>Estado:</strong> ${equipoEstado?.estado || '---'}
          </p>
        </div>
      `);

      mapMarker.setPopup(popup);

      mapMarker.getElement().addEventListener('mouseenter', () => mapMarker.togglePopup());
      mapMarker.getElement().addEventListener('mouseleave', () => mapMarker.togglePopup());
      mapMarker.getElement().addEventListener('click', () => {
        console.log('Clic en el marcador:', marker);
      });
    });
  }

  addMarker(lng: number, lat: number) {
    console.log('Se hizo clic en el marcador existente:', lng, lat);
  }
}