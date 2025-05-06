import {
  Component,
  Inject,
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
import { ChangeDetectorRef } from '@angular/core';

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
type GraficoPromedio = {
  chart: ApexChart;
  xaxis?: any;
  yaxis: ApexYAxis;
  series: ApexAxisChartSeries;
  plotOptions?: any;
  dataLabels?: any;
  tooltip?: any;
  colors?: string[]; // ✅ Agrega esta línea
};
type GraficoPie = {
  series: number[];
  chart: ApexChart;
  labels: string[];
  tooltip: {
    y: { formatter: (val: number) => string };
  };
  dataLabels: {
    enabled: boolean;
    formatter: (val: number) => string;
  };
  legend: ApexLegend;
};
@Component({
  selector: 'app-medidores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgApexchartsModule,
    TabViewModule,
  ],
  templateUrl: './medidores.component.html',
  styleUrl: './medidores.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MedidoresComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _plcData = inject(DataPlcService);
  private readonly _socketService = inject(SocketService);
  constructor(
    private cdr: ChangeDetectorRef
  ) {}
  

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
  historicoData: any;
  getDataMedidor() {
    this._plcData.getListaEquipos().subscribe({
      next: (resp) => {
        this.plcMedidor = resp.find(
          (plc: any) => plc.ip === this.ip && plc.tipo === 'pm'
        );
        this.obtenerDataHistoricoPlc();
        this._socketService.receiveHistoricoPlcData().subscribe((data) => {
          console.log('historico', data);
          const historicoEquipo = data.find((item: any) => item.ip === this.ip);
          if (!historicoEquipo) return;
          this.historicoData = historicoEquipo;
          this.generarGraficosPm();
          this.calcularConsumoEnergia()
        });
      },
      error: (err) => {},
    });
  }




  generarGraficosPm(): void {
    const equipo = this.historicoData;
    const data = equipo.data;
  
    const avg = (arr: number[], ignorarNegativos = false) => {
      const filtrados = arr.filter((v) => v !== undefined && v !== null && (!ignorarNegativos || v >= 0));
      return filtrados.length
        ? Math.round((filtrados.reduce((a, b) => a + b, 0) / filtrados.length) * 100) / 100
        : 0;
    };
    
    const metricas = {
      corriente: ['CORRIENTE_A', 'CORRIENTE_B', 'CORRIENTE_C', 'CORRIENTE_TOT'],
      voltaje: ['VOLTAJE_AB', 'VOLTAJE_BC', 'VOLTAJE_CA', 'VOLTAJE_TOT'],
      potencia: ['POT_A', 'POT_B', 'POT_C', 'POT_TOT'],
      frecuencia: ['FHZ_TOT'],
      fp: ['FPOT_A', 'FPOT_B', 'FPOT_C', 'FPOT_TOT'],
    };
  
    const procesar = (keys: string[]) =>
      keys.map((k) => {
        const valores = data
          .map((d: any) => d[k])
          .filter((v: any) => v !== undefined && v !== null);
    
        const promedio = avg(valores);
    
        console.log(`🔍 Métrica: ${k}`);
        console.log(`   Valores:`, valores);
        console.log(`   Promedio: ${promedio}`);
    
        return promedio;
      });
    
  
    this.corrienteChart = this.generarGraficoBarra(
      'Corriente por Fase (A)',
      ['A', 'B', 'C', 'TOTAL'],
      procesar(metricas.corriente),
      'A'
    );
  
    this.voltajeChart = this.generarGraficoBarra(
      'Voltaje por Fase (V)',
      ['AB', 'BC', 'CA', 'TOTAL'],
      procesar(metricas.voltaje),
      'V'
    );
  
    this.potenciaChart = this.generarGraficoBarra(
      'Potencia por Fase (kW)',
      ['A', 'B', 'C', 'TOTAL'],
      procesar(metricas.potencia),
      'kW'
    );
    console.log('potencia', this.potenciaChart);
  
    this.frecuenciaChart = this.generarGraficoBarra(
      'Frecuencia (Hz)',
      ['TOTAL'],
      procesar(metricas.frecuencia),
      'Hz'
    );
  
    this.fpChart = this.generarGraficoBarra(
      'Factor de Potencia',
      ['A', 'B', 'C', 'TOTAL'],
      procesar(metricas.fp),
      ''
    );
  
    this.cdr.detectChanges();
  }
  
  
  
  generarGraficoBarra(
    titulo: string,
    categorias: string[],
    data: number[],
    unidad: string
  ): GraficoPromedio {
    return {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          autoSelected: 'zoom',
        },
        animations: { enabled: false },
      },
      colors: ['#FF6384', '#36A2EB', '#FFCE56', '#2ECC71'], // ✅ Aquí defines los colores
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
          distributed: true, // ✅ Esto aplica un color por barra
          dataLabels: {
            position: 'top',
          },
        },
      },
      
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
        formatter: (val: number) => `${val.toFixed(2)} ${unidad}`,
      },
      xaxis: {
        categories: categorias,
        labels: {
          rotate: -15,
          style: { fontSize: '12px' },
        },
      },
      yaxis: {
        title: { text: titulo },
        labels: {
          formatter: (val: number) => `${val.toFixed(2)} ${unidad}`,
        },
      },
      series: [
        {
          name: titulo,
          data,
        },
      ],
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(2)} ${unidad}`,
        },
      },
    };
  }
  

    // por defecto las fechas son del día actual
    fechaActual: Date = new Date();
    fechaInicio: Date = new Date(
      this.fechaActual.getTime() - 24 * 60 * 60 * 1000
    ); // hace 24 horas
    fechaFin: Date = new Date(this.fechaActual.getTime() + 24 * 60 * 60 * 1000); // dentro de 24 horas
  obtenerDataHistoricoPlc() {
    clearInterval(this.actualizacionInterval);
    if (!this.plcMedidor?.ip) return;

    this._socketService.sendFindHistoricoPlcData(
      [this.plcMedidor.ip],
      this.fechaInicio,
      this.fechaFin,
      'pm'
    );
  
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
    //validar si fecha es date o string y convertir a string con variable solo const para este caso
    const fechaInicioString = new Date(this.fechaInicio)
      .toISOString()
      .split('T')[0];
    const fechaFinString = new Date(this.fechaFin).toISOString().split('T')[0];

    console.log('📤 Enviando histórico de energía desde');
    console.log(fechaInicioString, 'hasta', fechaFinString);
    const body = {
      ips: [this.plcMedidor.ip],
      desde: fechaInicioString,
      hasta: fechaFinString,
    };

    try {
      this._plcData.getHistoricoEnergia(body).subscribe({
        next: (resultado) => {
          console.log('Resultado:', resultado);
          this.generarGraficoConsumoEnergiaPie(resultado);
        },
        error: (err) => {
          console.error('Error consultando energía:', err);
          this.consumoTotal = null;
          this.costoTotal = null;
        },
      });
    } catch (err) {
      console.error('Error consultando energía:', err);
    }
  }

  generarGraficoConsumoEnergiaPie(resultado: any[]): void {
    const series: number[] = [];
    const labels: string[] = [];
    let totalConsumo = 0;
    let totalCosto = 0;
  
    for (const item of resultado) {
      const consumo = item.dias.reduce((sum: number, d: any) => sum + d.consumo, 0);
      const costo = item.dias.reduce((sum: number, d: any) => sum + d.costo, 0);
  
      if (consumo <= 0) continue;
  
  
  
      series.push(consumo);

  
      totalConsumo += consumo;
      totalCosto += costo;
    }
  
    this.totalEnergiaKwh = totalConsumo.toFixed(2);
    this.totalCostoEnergia = totalCosto.toFixed(2);
  
    this.consumoEnergiaPieChart = {
      series: [totalConsumo],
      labels: ['Energía Consumida (kWh)'],
      chart: {
        type: 'donut',
        height: 320,
        toolbar: {
          show: true,
          tools: { download: true },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number, opts?: any) =>
            opts?.seriesIndex === 1 ? `$${val.toFixed(2)}` : `${val.toFixed(2)} kWh`,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
      legend: {
        position: 'bottom',
        fontSize: '14px',
        formatter: (label: string, opts: any) =>
          opts?.seriesIndex === 1
            ? `${label}: $${opts.w.globals.series[opts.seriesIndex].toFixed(2)}`
            : `${label}: ${opts.w.globals.series[opts.seriesIndex].toFixed(2)} kWh`,
      },
    };
    
  }
  voltajeChart: GraficoPromedio = {
    chart: { type: 'bar', height: 250 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };

  corrienteChart: GraficoPromedio = {
    chart: { type: 'bar', height: 250 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };

  potenciaChart: GraficoPromedio = {
    chart: { type: 'bar', height: 250 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };
  consumoEnergiaPieChart: GraficoPie = {
    series: [],
    chart: { type: 'pie', height: 300 },
    labels: [],
    tooltip: {
      y: { formatter: (val: number) => `${val} kWh` },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    legend: {
      show: true,
      position: 'right',
      formatter: (label: string, opts: any) =>
        `${label}: ${opts.w.globals.series[opts.seriesIndex].toFixed(2)} kWh`,
    },
  };

  frecuenciaChart: GraficoPromedio = {
    chart: { type: 'bar', height: 250 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };
  fpChart: GraficoPromedio = {
    chart: { type: 'bar', height: 250 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };

  totalEnergiaKwh: string;
  totalCostoEnergia: string;

  onTabChange(index: number): void {

    this.getDataMedidor();
   
  }


  
}
