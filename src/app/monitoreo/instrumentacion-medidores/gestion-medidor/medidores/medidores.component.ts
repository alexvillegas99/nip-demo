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
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-medidores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgApexchartsModule,
    TabViewModule
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
    const ipMatch = window.location.href.match(
      /instrumentacion\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/
    );
    if (ipMatch) {
      this.ip = ipMatch[1];
      this.getDataMedidor();

      this.intervalSub = interval(3000).subscribe(() => {
        this._socketService.sendFindPlcData(this.ip!, 'pm');
      });

      this.plcDataSub = this._socketService
        .receivePlcData()
        .subscribe((data) => {
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
        this.plcMedidor = resp.find(
          (plc: any) => plc.ip === this.ip && plc.tipo === 'pm'
        );
        this.obtenerDataHistoricoPlc();
        this._socketService.receiveHistoricoPlcData().subscribe((data) => {
          const historicoEquipo = data.find((item: any) => item.ip === this.ip);
          if (!historicoEquipo) return;

          const datosReversados = [...historicoEquipo.data].reverse();

          if (this.chartOptions.length === 0) {
            this.generarGraficosHistoricosPM(datosReversados);
          } else {
            console.log('actualizando graficos');
            this.actualizarSeriesGraficosPM(datosReversados);
          }
        });
      },
      error: (err) => {},
    });
  }

  obtenerDataHistoricoPlc() {
    clearInterval(this.actualizacionInterval);
    if (!this.plcMedidor?.ip) return;

    this._socketService.sendFindHistoricoPlcData(
      [this.plcMedidor.ip],
      this.tiempoHistorico,
      'pm'
    );
    this.actualizacionInterval = setInterval(() => {
      this._socketService.sendFindHistoricoPlcData(
        [this.plcMedidor.ip],
        this.tiempoHistorico,
        'pm'
      );
    }, this.refresco);
  }
  generarGraficosHistoricosPM(data: any[]) {
    const categorias: Record<
      string,
      { campos: string[]; total?: string; unidad: string }
    > = {
      Corriente: {
        campos: ['CORRIENTE_A', 'CORRIENTE_B', 'CORRIENTE_C'],
        total: 'CORRIENTE_TOT',
        unidad: 'A',
      },
      Voltaje: {
        campos: ['VOLTAJE_AB', 'VOLTAJE_BC', 'VOLTAJE_CA'],
        total: 'VOLTAJE_TOT',
        unidad: 'V',
      },
      Potencia: {
        campos: ['POT_A', 'POT_B', 'POT_C'],
        total: 'POT_TOT',
        unidad: 'kW',
      },
      Frecuencia: { campos: ['FHZ_TOT'], unidad: 'Hz' },
      'Factor de Potencia': {
        campos: ['FPOT_A', 'FPOT_B', 'FPOT_C'],
        total: 'FPOT_TOT',
        unidad: '',
      },
      Energía: { campos: ['ENERG'], unidad: 'kWh' }, // ✅ agregado
    };

    const fechas = data.map((d: any) => new Date(d.fecha).toLocaleTimeString());
    this.fechasHistorico = fechas;
    this.chartOptions = [];

    for (const [titulo, grupo] of Object.entries(categorias)) {
      const series: any[] = [];

      for (const campo of grupo.campos) {
        series.push({
          name: campo.replace(/_/g, ' '),
          data: data.map((d: any) => this.redondear(d[campo])),
        });
      }

      if (grupo.total) {
        const campoTotal = grupo.total;
        series.push({
          name: campoTotal.replace(/_/g, ' ') + ' (Total)',
          data: data.map((d: any) => this.redondear(d[campoTotal])),
          color: '#FF0000',
        });
      }

      this.chartOptions.push(
        this.generarOpcionGrafico(titulo, series, grupo.unidad)
      );
    }
  }

  actualizarSeriesGraficosPM(data: any[]) {
    this.fechasHistorico = data.map((d: any) =>
      new Date(d.fecha).toLocaleString('es-EC', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );
    

    const categorias: Record<string, { campos: string[]; total?: string }> = {
      Corriente: {
        campos: ['CORRIENTE_A', 'CORRIENTE_B', 'CORRIENTE_C'],
        total: 'CORRIENTE_TOT',
      },
      Voltaje: {
        campos: ['VOLTAJE_AB', 'VOLTAJE_BC', 'VOLTAJE_CA'],
        total: 'VOLTAJE_TOT',
      },
      Potencia: { campos: ['POT_A', 'POT_B', 'POT_C'], total: 'POT_TOT' },
      Frecuencia: { campos: ['FHZ_TOT'] },
      'Factor de Potencia': {
        campos: ['FPOT_A', 'FPOT_B', 'FPOT_C'],
        total: 'FPOT_TOT',
      },
      Energía: { campos: ['ENERG']}, // ✅ agregado
    };

    const titulos = Object.keys(categorias);

    if (this.chartRefs.length !== titulos.length) {
      console.warn(
        'Gráficos aún no renderizados completamente. Se omite actualización.'
      );
      return;
    }

    this.chartRefs.forEach((chart, index) => {
      const { campos, total } = categorias[titulos[index]];
      const nuevasSeries: any[] = [];

      for (const campo of campos) {
        nuevasSeries.push({
          name: campo.replace(/_/g, ' '),
          data: data.map((d: any) => this.redondear(d[campo])),
        });
      }

      if (total) {
        nuevasSeries.push({
          name: total.replace(/_/g, ' ') + ' (Total)',
          data: data.map((d: any) => this.redondear(d[total])),
          color: '#FF0000',
        });
      }

      chart.updateOptions({
        series: nuevasSeries,
        xaxis: {
          categories: this.fechasHistorico,
          tickAmount: 6,
          labels: {
            show: true,
            rotate: -45,
            formatter: (val: string) => val,
          }
        }
      }, false, true);
      
      
      
    });
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
  generarOpcionGrafico(
    titulo: string,
    series: ApexAxisChartSeries,
    unidad: string = ''
  ): Partial<{
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
      title: { text: titulo },
      chart: {
        type: 'line' as ChartType,
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
          formatter: (val: number) =>
            `${val?.toFixed(2)}${unidad ? ' ' + unidad : ''}`,
        },
      },
      legend: {
        show: true,
        labels: { colors: ['#000'] },
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
    this.obtenerDataHistoricoPlc(); // siempre se aplica de inmediato
  }
  

  onCambioRefresco(): void {
    clearInterval(this.actualizacionInterval);
  
    if (this.refresco > 0 && this.plcMedidor?.ip) {
      this.actualizacionInterval = setInterval(() => {
        this._socketService.sendFindHistoricoPlcData(
          [this.plcMedidor.ip],
          this.tiempoHistorico,
          'pm'
        );
      }, this.refresco);
    }
  }
  
  

  @ViewChildren('chartRef') chartRefs!: QueryList<any>;

  showCorriente = false;
  showVoltaje = false;
  showPotencia = false;
  showEnergia = false;
  showFp = false;

  fechaDesde: string = '';
fechaHasta: string = '';
consumoTotal: number | null = null;
costoTotal: number | null = null;


async calcularConsumoEnergia() {
  if (!this.fechaDesde || !this.fechaHasta) return;

  const body = {
    ips: [this.plcMedidor?.ip],
    desde: this.fechaDesde,
    hasta: this.fechaHasta
  };

  try {
    this._plcData.getHistoricoEnergia(body).subscribe({
      next: (resultado) => {
        if (resultado?.length) {
          this.consumoTotal = resultado[0].consumo;
          this.costoTotal = resultado[0].costo;
        } else {
          this.consumoTotal = null;
          this.costoTotal = null;
        }
      },
      error: (err) => {
        console.error('Error consultando energía:', err);
        this.consumoTotal = null;
        this.costoTotal = null;
      }
    })
 
  } catch (err) {
    console.error('Error consultando energía:', err);
  }
}


}
