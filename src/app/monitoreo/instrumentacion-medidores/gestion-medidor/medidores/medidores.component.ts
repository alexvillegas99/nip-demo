import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataPlcService } from '../../../../services/data-plc.service';
import { SocketService } from '../../../../services/socket.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTitleSubtitle,
  ApexLegend,
  ApexDataLabels,
  ApexTooltip,
  ApexGrid,
} from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-medidores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgApexchartsModule,
  ],
  templateUrl: './medidores.component.html',
  styleUrl: './medidores.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MedidoresComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _plcData = inject(DataPlcService);
  private readonly _socketService = inject(SocketService);

  ip: string | null = null;
  plcInfo: any;
  plcMedidor!: any;
  chartOptions: Partial<{
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
  }>[] = [];
  
  fechasHistorico: string[] = [];
  tiempoHistorico: string = '5m';
  refresco: number = 5000;
  actualizacionInterval: any;
  private intervalSub!: Subscription;
  private plcDataSub!: Subscription;
  fechaHoraActual: string = '';

  ngOnInit(): void {
    const ipMatch = window.location.href.match(/instrumentacion\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
    if (ipMatch) {
      this.ip = ipMatch[1];
      this.getDataMedidor();

      this.intervalSub = interval(3000).subscribe(() => {
        this._socketService.sendFindPlcData(this.ip!, 'pm');
      });

      this.plcDataSub = this._socketService.receivePlcData().subscribe((data) => {
        this.plcInfo = this.redondearTodo(data);
      });
    }

    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);
  }

  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
    this.plcDataSub?.unsubscribe();
    clearInterval(this.actualizacionInterval);
  }

  actualizarFechaHora() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-EC');
    const hora = ahora.toLocaleTimeString('es-EC', { hour12: false });
    this.fechaHoraActual = `${fecha} | ${hora}`;
  }

  getDataMedidor() {
    this._plcData.getListaEquipos().subscribe({
      next: (resp) => {
        this.plcMedidor = resp.find((plc: any) => plc.ip === this.ip && plc.tipo === 'pm');
        this.obtenerDataHistoricoPlc();
        this._socketService.receiveHistoricoPlcData().subscribe((data) => {
          const historicoEquipo = data.find((item: any) => item.ip === this.ip);
          if (!historicoEquipo) return;

          const datosReversados = [...historicoEquipo.data].reverse();
          this.generarGraficosHistoricosPM(datosReversados);
        });
      },
      error: (err) => {},
    });
  }

  obtenerDataHistoricoPlc() {
    clearInterval(this.actualizacionInterval);
    if (!this.plcMedidor?.ip) return;

    this._socketService.sendFindHistoricoPlcData([this.plcMedidor.ip], this.tiempoHistorico, 'pm');
    this.actualizacionInterval = setInterval(() => {
      this._socketService.sendFindHistoricoPlcData([this.plcMedidor.ip], this.tiempoHistorico, 'pm');
    }, this.refresco);
  }
  generarGraficosHistoricosPM(data: any[]) {
    const tipos = [
      'corriente_A', 'corriente_B', 'corriente_C',
      'voltaje_AB', 'voltaje_BC', 'voltaje_CA',
      'potencia_A', 'potencia_B', 'potencia_C',
      'frecuencia_A', 'frecuencia_B', 'frecuencia_C',
    ];
  
    const fechas = data.map((d: any) => new Date(d.fecha).toLocaleTimeString());
    this.fechasHistorico = fechas;
  
    if (this.chartOptions.length === 0) {
      this.chartOptions = tipos.map((tipo) => {
        const series = this.generarSerie(tipo, data);
        return this.generarOpcionGrafico(tipo, series);
      });
    } else {
      tipos.forEach((tipo, index) => {
        const nuevasSeries = this.generarSerie(tipo, data);
        const chart = this.chartRefs?.get(index);
        if (chart) {
          chart.updateSeries(nuevasSeries, true);
        }
      });
    }
  }
  generarSerie(tipo: string, data: any[]) {
    const valores = data.map((d: any) => this.redondear(d[tipo]));
  
    return [
      {
        name: this.plcMedidor?.nombre || 'Equipo',
        data: valores,
      },
      {
        name: 'Base',
        data: Array(valores.length).fill(0),
        color: 'transparent',
      },
    ];
  }
  generarOpcionGrafico(tipo: string, series: ApexAxisChartSeries): Partial<{
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
  }> {
    return {
      series,
      title: { text: tipo.replace(/_/g, ' ').toUpperCase() },
      chart: {
        type: 'line' as ChartType, // <- solución aquí
        height: 300,
        animations: { enabled: false },
        toolbar: { show: false },
      },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: this.fechasHistorico },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        tickAmount: 5,
        labels: {
          formatter: (val: number) => val?.toFixed(2) ?? '0',
        },
      },
      legend: {
        show: true,
        labels: { colors: ['#000'] },
        formatter: (name: string) => (name === 'Base' ? '' : name),
      },
      dataLabels: { enabled: false },
    };
  }
  

  redondear(valor: any) {
    return valor !== undefined ? Math.round(valor * 100) / 100 : 0;
  }

  redondearTodo(data: any) {
    const resultado: any = {};
    for (const key in data) {
      if (typeof data[key] === 'number') {
        const valor = data[key];
        if (Math.abs(valor) >= 1e6) {
          resultado[key] = parseFloat((valor / 1e6).toFixed(2));
        } else if (Math.abs(valor) >= 1e3) {
          resultado[key] = parseFloat((valor / 1e3).toFixed(2));
        } else {
          resultado[key] = this.redondear(valor);
        }
      } else {
        resultado[key] = data[key];
      }
    }
    return resultado;
  }

  onCambioTiempo(valor: string) {
    this.tiempoHistorico = valor;
    if (valor !== 'personalizado') {
      this.obtenerDataHistoricoPlc();
    }
  }

  onCambioRefresco() {
    this.obtenerDataHistoricoPlc();
  }

  @ViewChildren('chartRef') chartRefs!: QueryList<any>;

}