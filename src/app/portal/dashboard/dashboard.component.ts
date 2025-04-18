// Angular + ApexCharts DashboardComponent refactorizado
import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SocketService } from '../../services/socket.service';
import { DataPlcService } from '../../services/data-plc.service';

// Tipado personalizado para las opciones de gráfico
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  colors: string[];
  yaxis: any;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {
  plcList: any[] = [];                          // Lista de todos los equipos
  historicoData: any[] = [];                   // Datos históricos recibidos por WebSocket
  fechas: string[] = [];                       // Etiquetas de eje X (tiempo)
  chartOptions: Partial<ChartOptions>[] = [];  // Configuración de gráficos
  tipoSeleccionado: string = 'variador';       // Tipo actual de equipos seleccionados
  historicoSub!: Subscription;                 // Subscripción al socket
  actualizacionInterval: any;                 // Intervalo de actualización
  equiposSeleccionados: string[] = [];         // Lista de IPs seleccionadas

  @ViewChildren(ChartComponent) chartComponents!: QueryList<ChartComponent>;

  constructor(
    private readonly _socketService: SocketService,
    private readonly dataPlc: DataPlcService
  ) {}

  ngOnInit(): void {
    this.getListaEquipos();

    // Solicitud de datos periódica
    this.actualizacionInterval = setInterval(() => {
      const ips = this.plcList.map((item) => item.ip);
      if (ips.length > 0) {
        this._socketService.sendFindHistoricoPlcData(ips, 10, this.tipoSeleccionado);
      }
    }, 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.actualizacionInterval);
    if (this.historicoSub) this.historicoSub.unsubscribe();
  }

  // Obtener equipos desde el backend
  getListaEquipos() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        this.plcList = data.filter((item: any) => item.tipo === this.tipoSeleccionado);
        this.equiposSeleccionados = this.plcList.map((item) => item.ip);
        const ips = this.plcList.map((item) => item.ip);
        this._socketService.sendFindHistoricoPlcData(ips, 10, this.tipoSeleccionado);
        this.listenHistorico();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  // Escuchar datos históricos por WebSocket
  listenHistorico() {
    if (this.historicoSub) this.historicoSub.unsubscribe();

    this.historicoSub = this._socketService.receiveHistoricoPlcData().subscribe((data) => {
      this.historicoData = data
        .filter((equipo: any) => this.equiposSeleccionados.includes(equipo.ip))
        .map((equipo: any) => ({
          ...equipo,
          data: [...equipo.data].reverse().map((d: any) => this.formatearDatos(d)),
        }));

      const equipoConDatos = this.historicoData.find((e) => e.data && e.data.length > 0);
      this.fechas = equipoConDatos?.data.map((d: any) => new Date(d.fecha).toLocaleTimeString()) || [];

      this.chartOptions.length === 0 ? this.generarGraficos() : this.actualizarGraficos();
    });
  }

  // Formatear y redondear datos
  private formatearDatos(d: any) {
    return {
      ...d,
      frecuencia: this.redondear(d.frecuencia),
      voltaje: this.redondear(d.voltaje),
      corriente: this.redondear(d.corriente),
      potencia: this.redondear(d.potencia),
      rpm: this.redondear(d.rpm),
    };
  }

  private redondear(valor: any) {
    return valor !== undefined ? Math.round(valor * 100) / 100 : null;
  }

  // Construcción de gráficos para cada tipo
  generarGraficos() {
    this.chartOptions = [];

    const tipos = this.tipoSeleccionado === 'variador'
      ? ['corriente', 'voltaje', 'potencia', 'frecuencia', 'rpm']
      : [
          'corriente_A', 'corriente_B', 'corriente_C',
          'voltaje_AB', 'voltaje_BC', 'voltaje_CA',
          'potencia_A', 'potencia_B', 'potencia_C',
          'frecuencia_A', 'frecuencia_B', 'frecuencia_C'
        ];

    for (const tipo of tipos) {
      const series = this.historicoData.map((equipo) => {
        const nombre = this.plcList.find((p) => p.ip === equipo.ip)?.nombre || equipo.ip;
        const datos = equipo.data.map((d: any) =>
          tipo === 'rpm'
            ? this.calcularRPM(equipo.ip, d.frecuencia)
            : this.redondear(d[tipo])
        );
        return { name: nombre, data: datos };
      });

      this.chartOptions.push({
        series: [...series, this.serieBase()],
        title: { text: tipo.replace(/_/g, ' ').toUpperCase() },
        chart: {
          type: 'line',
          height: 300,
          animations: { enabled: false },
          toolbar: { show: false },
        },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: [...this.fechas] },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          tickAmount: 5,
          labels: { formatter: (value: number) => value?.toFixed(2) ?? '0' },
        },
        legend: {
          show: true,
          labels: { colors: ['#000'] },
          formatter: (name) => (name === 'Base' ? '' : name),
        },
        dataLabels: { enabled: false },
      });
    }
  }

  // Actualizar solo los datos del gráfico
  actualizarGraficos() {
    const tipos = this.tipoSeleccionado === 'pm'
      ? [
          'corriente_A', 'corriente_B', 'corriente_C',
          'voltaje_AB', 'voltaje_BC', 'voltaje_CA',
          'potencia_A', 'potencia_B', 'potencia_C',
          'frecuencia_A', 'frecuencia_B', 'frecuencia_C',
        ]
      : ['corriente', 'voltaje', 'potencia', 'frecuencia', 'rpm'];
  
    if (this.chartComponents.length !== tipos.length) {
      console.warn('Gráficos aún no renderizados completamente. Se omite actualización.');
      return;
    }
  
    this.chartComponents.forEach((chart, index) => {
      const tipo = tipos[index];
  
      const nuevasSeries = this.historicoData.map((equipo) => {
        const nombre = this.plcList.find((p) => p.ip === equipo.ip)?.nombre || equipo.ip;
  
        const datos = equipo.data.map((d: any) =>
          tipo === 'rpm'
            ? this.calcularRPM(equipo.ip, d.frecuencia)
            : this.redondear(d[tipo])
        );
  
        return { name: nombre, data: datos };
      });
  
      chart.updateOptions(
        {
          series: [...nuevasSeries, this.serieBase()],
          xaxis: { categories: [...this.fechas] },
          yaxis: {
            min: 0,
            forceNiceScale: true,
            tickAmount: 5,
            labels: {
              formatter: (value: number) => value?.toFixed(2) ?? '0',
            },
          },
          legend: {
            show: true,
            labels: { colors: ['#000'] },
            formatter: (name:any) => (name === 'Base' ? '' : name),
          },
        },
        false,
        true
      );
    });
  }
  

  // Serie invisible para evitar error en gráficos vacíos
  private serieBase() {
    return { name: 'Base', data: Array(this.fechas.length).fill(0), color: 'transparent' };
  }

  // Cálculo específico de RPM según IP y frecuencia
  private calcularRPM(ip: string, frecuencia: number) {
    const maxRPM = this.getMaxRPM(ip);
    return Math.round((frecuencia / 60) * maxRPM * 100) / 100;
  }

  private getMaxRPM(ip: string): number {
    const rpmMap: Record<string, number> = {
      '172.16.8.9': 3450,
      '172.16.107.5': 1785,
    };
    return rpmMap[ip] || 1780;
  }

  // Cambio entre tipo de equipos (variador o pm)
  cambiarTipoEquipo() {
    this.chartOptions = [];
    this.fechas = [];
    this.historicoData = [];
    if (this.historicoSub) this.historicoSub.unsubscribe();
    setTimeout(() => this.getListaEquipos(), 0);
  }

  // Manejo de selección por checkbox
  toggleEquipoSeleccion(ip: string, checked: boolean) {
    this.equiposSeleccionados = checked
      ? [...this.equiposSeleccionados, ip]
      : this.equiposSeleccionados.filter((i) => i !== ip);

    if (this.equiposSeleccionados.length === 0) {
      this.historicoData = [];
      this.chartOptions = [];
      return;
    }

    if (this.historicoSub) this.historicoSub.unsubscribe();

    this._socketService.sendFindHistoricoPlcData(this.equiposSeleccionados, 10, this.tipoSeleccionado);
    this.listenHistorico();
  }

  onCheckboxChange(event: Event, ip: string) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleEquipoSeleccion(ip, checked);
  }
}
