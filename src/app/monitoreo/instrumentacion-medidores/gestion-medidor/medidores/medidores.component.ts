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
  stroke?: ApexStroke;
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
  constructor(private cdr: ChangeDetectorRef) {}
  harmonicosTotalesChart: GraficoPromedio = {
    chart: { type: 'bar', height: 300 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };

  harmonicosDetalleChart: GraficoPromedio = {
    chart: { type: 'bar', height: 300 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };

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
  thdCorrienteChart: GraficoPromedio = {
    chart: { type: 'line', height: 250 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };

  thVoltajeChart: GraficoPromedio = {
    chart: { type: 'line', height: 250 },
    xaxis: { categories: [] },
    yaxis: {},
    series: [],
  };

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
          const datosAgrupados = this.agruparHarmonicosPorFecha(
            this.historicoData.data
          );
          this.generarGraficosHarmonicosPorBloques(datosAgrupados);

          this.calcularConsumoEnergia();
        });
      },
      error: (err) => {},
    });
  }

  generarGraficosPm(): void {
    const data = this.historicoData.data;

    const { fechas: fechasCorr, valores: valCorrA } =
      this.extraerFechasYValores(data, 'CORRIENTE_A');
    const { valores: valCorrB } = this.extraerFechasYValores(
      data,
      'CORRIENTE_B'
    );
    const { valores: valCorrC } = this.extraerFechasYValores(
      data,
      'CORRIENTE_C'
    );
    const { valores: valCorrTot } = this.extraerFechasYValores(
      data,
      'CORRIENTE_TOT'
    );

    this.corrienteChart = this.generarGraficoLineaOriginal(
      'Corriente por Fase (A)',
      [
        { nombre: 'A', datos: valCorrA },
        { nombre: 'B', datos: valCorrB },
        { nombre: 'C', datos: valCorrC },
        { nombre: 'Total', datos: valCorrTot },
      ],
      fechasCorr,
      'A'
    );

    // Voltaje
    const { fechas: fechasVolt, valores: valVoltAB } =
      this.extraerFechasYValores(data, 'VOLTAJE_AB');
    const { valores: valVoltBC } = this.extraerFechasYValores(
      data,
      'VOLTAJE_BC'
    );
    const { valores: valVoltCA } = this.extraerFechasYValores(
      data,
      'VOLTAJE_CA'
    );
    const { valores: valVoltTot } = this.extraerFechasYValores(
      data,
      'VOLTAJE_TOT'
    );

    this.voltajeChart = this.generarGraficoLineaOriginal(
      'Voltaje por Fase (V)',
      [
        { nombre: 'AB', datos: valVoltAB },
        { nombre: 'BC', datos: valVoltBC },
        { nombre: 'CA', datos: valVoltCA },
        { nombre: 'Total', datos: valVoltTot },
      ],
      fechasVolt,
      'V'
    );

    // Potencia
    const { fechas: fechasPot, valores: valPotA } = this.extraerFechasYValores(
      data,
      'POT_A'
    );
    const { valores: valPotB } = this.extraerFechasYValores(data, 'POT_B');
    const { valores: valPotC } = this.extraerFechasYValores(data, 'POT_C');
    const { valores: valPotTot } = this.extraerFechasYValores(data, 'POT_TOT');

    this.potenciaChart = this.generarGraficoLineaOriginal(
      'Potencia por Fase (kW)',
      [
        { nombre: 'A', datos: valPotA },
        { nombre: 'B', datos: valPotB },
        { nombre: 'C', datos: valPotC },
        { nombre: 'Total', datos: valPotTot },
      ],
      fechasPot,
      'kW'
    );

    // Frecuencia
    const { fechas: fechasFreq, valores: valFhzTot } =
      this.extraerFechasYValores(data, 'FHZ_TOT');

    this.frecuenciaChart = this.generarGraficoLineaOriginal(
      'Frecuencia (Hz)',
      [{ nombre: 'Total', datos: valFhzTot }],
      fechasFreq,
      'Hz'
    );

    // Factor de Potencia
    const { fechas: fechasFp, valores: valFpA } = this.extraerFechasYValores(
      data,
      'FPOT_A'
    );
    const { valores: valFpB } = this.extraerFechasYValores(data, 'FPOT_B');
    const { valores: valFpC } = this.extraerFechasYValores(data, 'FPOT_C');
    const { valores: valFpTot } = this.extraerFechasYValores(data, 'FPOT_TOT');

    this.fpChart = this.generarGraficoLineaOriginal(
      'Factor de Potencia',
      [
        { nombre: 'A', datos: valFpA },
        { nombre: 'B', datos: valFpB },
        { nombre: 'C', datos: valFpC },
        { nombre: 'Total', datos: valFpTot },
      ],
      fechasFp,
      ''
    );
    const { valores: thdB } = this.extraerFechasYValores(data, 'THD_COR_B');
    const { valores: thdC } = this.extraerFechasYValores(data, 'THD_COR_C');
    const { fechas: fechasThd, valores: thdA } = this.extraerFechasYValores(
      data,
      'THD_COR_A'
    );
    this.thdCorrienteChart = this.generarGraficoLineaOriginal(
      'THD de Corriente (%)',
      [
        { nombre: 'THD A', datos: thdA },
        { nombre: 'THD B', datos: thdB },
        { nombre: 'THD C', datos: thdC },
      ],
      fechasThd,
      '%'
    );

    // TH Voltaje
    const { fechas: fechasTh, valores: thAB } = this.extraerFechasYValores(
      data,
      'TH_DBA'
    );
    const { valores: thBC } = this.extraerFechasYValores(data, 'TH_DBC');
    const { valores: thCA } = this.extraerFechasYValores(data, 'TH_DCA');

    this.thVoltajeChart = this.generarGraficoLineaOriginal(
      'TH de Voltaje (%)',
      [
        { nombre: 'TH AB', datos: thAB },
        { nombre: 'TH BC', datos: thBC },
        { nombre: 'TH CA', datos: thCA },
      ],
      fechasTh,
      '%'
    );

    this.cdr.detectChanges();
  }

  dividirEnBloquesYPromediar(data: number[], bloques: number = 8): number[] {
    const tamaño = Math.ceil(data.length / bloques);
    const promedios: number[] = [];

    for (let i = 0; i < bloques; i++) {
      const bloque = data.slice(i * tamaño, (i + 1) * tamaño);
      if (bloque.length > 0) {
        const suma = bloque.reduce((a, b) => a + b, 0);
        promedios.push(Math.round((suma / bloque.length) * 100) / 100);
      }
    }

    return promedios;
  }

  generarGraficoLineaPromedios(
    titulo: string,
    seriesData: { nombre: string; datos: number[] }[],
    unidad: string
  ): any {
    const series = seriesData.map((s) => ({
      name: s.nombre,
      data: s.datos,
    }));

    return {
      series,
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: true },
      },
      xaxis: {
        categories: this.calcularFechasBloques(
          this.historicoData.data,
          seriesData[0].datos.length
        ),
        // title: { text: 'Fecha' }, // si no deseas el título, elimínalo
      },
      yaxis: {
        title: { text: unidad },
      },
      tooltip: {
        shared: true,
        y: {
          formatter: (val: number) => `${val} ${unidad}`,
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
    };
  }

  calcularFechasBloques(data: any[], bloques: number = 8): string[] {
    const tamaño = Math.ceil(data.length / bloques);
    const etiquetas: string[] = [];

    for (let i = 0; i < bloques; i++) {
      const bloque = data.slice(i * tamaño, (i + 1) * tamaño);
      if (bloque.length > 0) {
        const fechaProm = new Date(bloque[Math.floor(bloque.length / 2)].fecha);
        const label = `${
          fechaProm.getMonth() + 1
        }-${fechaProm.getDate()} ${fechaProm.getHours()}:${String(
          fechaProm.getMinutes()
        ).padStart(2, '0')}`;
        etiquetas.push(label);
      }
    }

    return etiquetas;
  }

generarGraficoBarra(
  titulo: string,
  categorias: string[],
  data: number[], // solo si se usa 1 serie (se ignora si hay múltiples)
  unidad: string,
  colores?: string[] // <-- opcional
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
    colors: colores, // 👈 personalización
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        // distributed: false → omitido para usar colores por serie
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -15,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#333'],
      },
      formatter: (val: number) => `${val.toFixed(1)} %`,
    },
    xaxis: {
      categories: categorias,
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
        },
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
    const inicio = new Date(this.fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(this.fechaFin);
    fin.setHours(23, 59, 59, 999);
    this._socketService.sendFindHistoricoPlcData(
      [this.plcMedidor.ip],
      inicio,
      fin,
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
      this._plcData.getHistoricoEnergiaFranjas(body).subscribe({
        next: (resultado) => {
          console.log('Resultadoooooo:', resultado);
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

generarGraficoConsumoEnergiaPie(resultado: any): void {
  const series: number[] = [];
  const labels: string[] = [];
  let totalConsumo = 0;
  let totalCosto = 0;

  if (!resultado?.resumen) return;

  for (const item of resultado.resumen) {
    const franja = item.franja;
    const consumo = item.consumo;
    const costo = item.costo;

    if (consumo <= 0) continue;

    labels.push(`${franja} h`);
    series.push(consumo);

    totalConsumo += consumo;
    totalCosto += costo;
  }

  this.totalEnergiaKwh = totalConsumo.toFixed(2);
  this.totalCostoEnergia = totalCosto.toFixed(2);

  this.consumoEnergiaPieChart = {
    series,
    labels,
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
        formatter: (val: number) => `${val.toFixed(2)} kWh`,
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
        `${label}: ${opts.w.globals.series[opts.seriesIndex].toFixed(2)} kWh`,
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

  showHarm = false;
  generarGraficoLineaOriginal(
    titulo: string,
    seriesData: { nombre: string; datos: number[] }[],
    fechas: string[],
    unidad: string
  ): GraficoPromedio {
    return {
      series: seriesData.map((s) => ({
        name: s.nombre,
        data: s.datos.map((d) => parseFloat(d.toFixed(2))), // ✅ redondeo a 2 decimales
      })),
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: true },
      },
      xaxis: {
        categories: fechas,
        labels: {
          show: false, // ✅ oculta las fechas debajo del gráfico
        },
      },
      yaxis: {
        title: { text: unidad },
        labels: {
          formatter: (val: number) => val.toFixed(2), // ✅ eje Y con 2 decimales
        },
      },
      tooltip: {
        shared: true,
        x: {
          show: true,
        },
        y: {
          formatter: (val: number) => `${val.toFixed(2)} ${unidad}`, // ✅ tooltip con 2 decimales
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: { curve: 'smooth' },
    };
  }

  extraerFechasYValores(data: any[], campo: string) {
    const fechas: string[] = [];
    const valores: number[] = [];

    for (const item of data) {
      if (item[campo] !== undefined && item[campo] !== null) {
        const fecha = new Date(item.fecha);
        const label = `${
          fecha.getMonth() + 1
        }-${fecha.getDate()} ${fecha.getHours()}:${String(
          fecha.getMinutes()
        ).padStart(2, '0')}`;
        fechas.push(label);
        valores.push(item[campo]);
      }
    }

    return { fechas, valores };
  }

  generarGraficosHarmonicosPorBloques(data: any[]): void {
    const ordenes = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
    const bloques = [];

    const coloresPorBloque = [
      ['#1E90FF', '#00BFFF', '#87CEFA'], // H3, H5, H7
      ['#FF8C00', '#FFA500', '#FFD700'], // H9, H11, H13
      ['#8A2BE2', '#9370DB', '#DDA0DD'], // H15, H17, H19
      ['#2ECC71'], // H21
    ];

    for (let i = 0; i < ordenes.length; i += 3) {
      bloques.push(ordenes.slice(i, i + 3));
    }

    bloques.forEach((grupo, index) => {
      const categorias = grupo.map((o) => `H${o}`);
      const series = data.map((dia) => ({
        name: dia.fecha,
        data: grupo.map((o) => +(dia[`HARM${o}`] ?? 0).toFixed(2)),
      }));

      const grafico = this.generarGraficoBarra(
        `Armónicos H${grupo.join(', H')}`,
        categorias,
        [],
        '%'
      );

      grafico.series = series;
      grafico.colors = [...(coloresPorBloque[index] || ['#3498db'])];

      if (index === 0) this.harmChart1 = grafico;
      if (index === 1) this.harmChart2 = grafico;
      if (index === 2) this.harmChart3 = grafico;
      if (index === 3) this.harmChart4 = grafico;

      // Gráfico para HARM y HARM_MG
      const categoriasHarmMg = ['HARM', 'HARM_MG'];
      const seriesHarmMg = data.map((dia) => ({
        name: dia.fecha,
        data: [+(dia.HARM ?? 0).toFixed(2), +(dia.HARM_MG ?? 0).toFixed(2)],
      }));

      const graficoHarmMg = this.generarGraficoBarra(
        'Armónicos HARM y HARM_MG',
        categoriasHarmMg,
        [],
        '%'
      );

      graficoHarmMg.series = seriesHarmMg;
      this.harmChart5 = graficoHarmMg;
    });

    this.cdr.detectChanges();
  }

  harmChart1: GraficoPromedio;
  harmChart2: GraficoPromedio;
  harmChart3: GraficoPromedio;
  harmChart4: GraficoPromedio;
  harmChart5: GraficoPromedio;

agruparHarmonicosPorFecha(data: any[]): any[] {
  const mapa = new Map<string, any>();

  for (const item of data) {
    const fecha = new Date(item.fecha).toISOString().split('T')[0];

    if (!mapa.has(fecha)) {
      mapa.set(fecha, { fecha });
    }

    const dia = mapa.get(fecha);
    for (const key of Object.keys(item)) {
      if (key.startsWith('HARM')) {
        dia[key] = dia[key] ?? [];
        dia[key].push(item[key]);
      }
    }
  }

  // Convertir fechas a strings comparables (formato YYYY-MM-DD)
  const desde = new Date(this.fechaInicio).toISOString().split('T')[0];
  const hasta = new Date(this.fechaFin).toISOString().split('T')[0];

  // Agrupar y filtrar solo fechas dentro del rango seleccionado
  const agrupados = Array.from(mapa.values())
    .filter(d => d.fecha >= desde && d.fecha <= hasta)
    .map(dia => {
      const resultado: any = { fecha: dia.fecha };
      for (const key of Object.keys(dia)) {
        if (key !== 'fecha') {
          const arr = dia[key];
          resultado[key] = arr.reduce((a:any, b:any) => a + b, 0) / arr.length;
        }
      }
      return resultado;
    });

  // Tomar como máximo 3 días (los más recientes)
  return agrupados
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-3);
}


}
