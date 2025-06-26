import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataPlcService } from '../../../../services/data-plc.service';
import { SocketService } from '../../../../services/socket.service';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexStroke,
  ApexDataLabels,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import ApexCharts from 'apexcharts';
import { FormsModule } from '@angular/forms';
import { HorometroService } from '../../../../services/horometro.service';
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

export interface GraficoPromedio {
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  series: ApexAxisChartSeries;
  stroke?: ApexStroke;
  colors?: string[];
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
}

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  labels: string[];
  dataLabels: ApexDataLabels;
  fill: ApexFill;
};

export type ChartLinearOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis; // ✅ Agrega esto
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  grid: ApexGrid;
};

export type HistoricoChartOptions = {
  series: ApexAxisChartSeries; // { name, data }[]
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis; // ✅ Agrega esto
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  annotations?: ApexAnnotations; // ✅ solución
};

@Component({
  selector: 'app-variadores',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  templateUrl: './variadores.component.html',
  styleUrl: './variadores.component.scss',
})
export class VariadoresComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _plcData = inject(DataPlcService);
  private readonly _socketService = inject(SocketService);
  constructor(private horometroService: HorometroService) {}

  items = ['Current', 'Power', 'Voltage', 'Power Factor'];

  ip: string | null = null;
  fullUrl: string = '';
  plcInfo: any;
  plcMedidor!: any;
  data: any;
  private intervalSub!: Subscription;
  private plcDataSub!: Subscription;
  ngOnInit(): void {
    this.cambiarMenu(0);
    this.fullUrl = window.location.href;
    console.log(this.fullUrl, 'url completa');
    // Extraer la IP usando una expresión regular
    const ipMatch = this.fullUrl.match(
      /instrumentacion\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/
    );
    if (ipMatch) {
      console.log(ipMatch[1]);
      this.ip = ipMatch[1];
      this.getDataMedidor();

      const ip = this.ip!; // Cambia por la IP que necesitas consultar

      // Emitir solicitud cada 3 segundos
      this.intervalSub = interval(3000).subscribe(() => {
        this._socketService.sendFindPlcData(ip, 'variador');
      });

      // Escuchar la respuesta del servidor
      this.plcDataSub = this._socketService
        .receivePlcData()
        .subscribe((data) => {
          console.log(data, 'data....');

          this.plcInfo = {
            ...data,
            corriente: Math.round(data.corriente * 100) / 100,
            voltaje: Math.round(data.voltaje * 100) / 100,
            potencia: Math.round(data.potencia * 100) / 100,
            frecuencia: Math.round(data.frecuencia * 100) / 100,
          };

          let maxRPM = 1780;
          if (this.plcMedidor?.ip === '172.16.8.9') {
            maxRPM = 3450;
          } else if (this.plcMedidor?.ip === '172.16.107.5') {
            maxRPM = 1785;
          }

          const currentRPM =
            Math.round((this.plcInfo.frecuencia / 60) * maxRPM * 100) / 100;
          console.log(currentRPM, 'currentRPM');

          this.updateRPM(currentRPM);
          this.updateLinear(this.plcInfo.potencia);
        });
    }
  }
  obtenerDataHistoricoPlc() {
    const ip = this.plcMedidor?.ip;
    if (!ip) return;
const inicio = new Date(this.fechaInicio);
inicio.setHours(0, 0, 0, 0);

const fin = new Date(this.fechaFin);
fin.setHours(23, 59, 59, 999);
    // Consulta inicial
    this._socketService.sendFindHistoricoPlcData(
      [this.plcMedidor.ip],
      inicio,
      fin,
      'variador'
    );
  }

  // por defecto las fechas son del día actual
  fechaActual: Date = new Date();
  fechaInicio: Date = new Date(
    this.fechaActual.getTime() - 24 * 60 * 60 * 1000
  ); // hace 24 horas
  fechaFin: Date = new Date(this.fechaActual.getTime() + 24 * 60 * 60 * 1000); // dentro de 24 horas
  @ViewChild('rpmChart', { static: false }) rpmChart!: any;

  updateRPM(currentRPM: number) {
    let maxRPM = 1780;
    if (this.plcMedidor?.ip === '172.16.8.9') maxRPM = 3450;
    else if (this.plcMedidor?.ip === '172.16.107.5') maxRPM = 1785;
    console.log(this.plcMedidor?.ip);
    console.log(currentRPM, 'currentRPM desde updateRPM()');
    const porcentaje = currentRPM / maxRPM;
    console.log(porcentaje, 'porcentaje desde updateRPM()');
    ApexCharts.exec('rpmChartId', 'updateSeries', [porcentaje]);
  }

  @ViewChild('linearChart') linearChart!: ChartComponent;

  updateLinear(currentValue: number) {
    const newSeries = [
      {
        name: 'Motor power',
        data: [currentValue], // Solo un valor para la única barra
      },
    ];

    this.linearChart.updateSeries(newSeries);
  }

  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
    this.plcDataSub?.unsubscribe();

    console.log('🔌 Socket desconectado desde componente');
  }

  getDataMedidor() {
    this._plcData.getListaEquipos().subscribe({
      next: (resp) => {
        console.log(resp);
        this.plcMedidor = resp.find(
          (plc: any) => plc.ip === this.ip && plc.tipo === 'variador'
        );
        this.chartLinear();
        this.chart(0);
        this.obtenerDataHistoricoPlc();
        this._socketService.receiveHistoricoPlcData().subscribe((data) => {
          const historicoEquipo = data.find((item: any) => item.ip === this.ip);
          if (!historicoEquipo) return;

          const datosReversados = [...historicoEquipo.data].reverse();

          this.fechasHistorico = datosReversados.map((d: any) =>
            new Date(d.fecha).toLocaleTimeString()
          );

          this.generarGraficosHistoricos(datosReversados);
          this.buscarHorometro();
        });
      },
      error: (err) => {},
    });
  }
  generarGraficosHistoricos(data: any[]) {
    const colores = (cantidad: number) =>
      Array.from({ length: cantidad }, () => {
        const r = Math.floor(Math.random() * 156) + 100;
        const g = Math.floor(Math.random() * 156) + 100;
        const b = Math.floor(Math.random() * 156) + 100;
        return `rgb(${r}, ${g}, ${b})`;
      });

    const crearGraficoLinea = (titulo: string, key: string, unidad: string) => {
      const { fechas, promedios } = this.dividirBloquesConFechas(data, key);
      return {
        chart: { type: 'line', height: 250, toolbar: { show: true } },
        xaxis: { categories: fechas },
        yaxis: { title: { text: `${titulo} (${unidad})` } },
        series: [{ name: titulo, data: promedios }],
        stroke: { curve: 'smooth' },
        colors: colores(1),
        dataLabels: { enabled: false },
        tooltip: {
          y: {
            formatter: (val: number) => `${val.toFixed(2)} ${unidad}`,
          },
        },
      };
    };

    // 🔌 Voltaje
    this.voltajeChart = crearGraficoLinea('Voltaje', 'voltaje', 'V');

    // ⚡ Corriente
    this.corrienteChart = crearGraficoLinea('Corriente', 'corriente', 'A');

    // 💡 Potencia
    this.potenciaChart = crearGraficoLinea('Potencia', 'potencia', 'kW');

    // ⏱️ Horómetro
    const valoresHorometro = data
      .map((d) => d.horometro)
      .filter((v) => v != null);
    if (valoresHorometro.length) {
      this.horometroPieChart = {
        series: [
          Math.round(
            (valoresHorometro.reduce((a, b) => a + b, 0) /
              valoresHorometro.length) *
              100
          ) / 100,
        ],
        labels: ['Tiempo de uso'],
        chart: {
          type: 'donut',
          height: 300,
          toolbar: { show: true, tools: { download: true } },
        },
        tooltip: {
          y: { formatter: (val) => `${val.toFixed(2)} minutos` },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val.toFixed(1)}%`,
        },
        legend: {
          show: true,
          position: 'right',
          formatter: (label, opts) => {
            const minutos = opts.w.globals.series[opts.seriesIndex];
            const horas = (minutos / 60).toFixed(2);
            return `${label}: ${horas} h`;
          },
        },
      };
    }
  }

  getMaxRPM(ip: string): number {
    const rpmMap: Record<string, number> = {
      '172.16.8.9': 3450,
      '172.16.107.5': 1785,
    };
    return rpmMap[ip] || 1780;
  }

  public chartOptions!: Partial<ChartOptions>;
  chart(currentRPM: number = 0) {
    let maxRPM = 1780; // valor por defecto
    console.log(this.plcMedidor.ip, 'currentRPM desde chart()');
    if (this.plcMedidor?.ip === '172.16.8.9') {
      maxRPM = 3450;
    } else if (this.plcMedidor?.ip === '172.16.107.5') {
      maxRPM = 1785;
    }
    console.log(maxRPM, 'maxRPM desde chart()');

    this.chartOptions = {
      series: [currentRPM / maxRPM],
      chart: {
        id: 'rpmChartId', // nuevo
        height: 280,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: { size: '50%' },
          dataLabels: {
            name: {
              show: true,
              fontSize: '14px',
              offsetY: -10,
              color: '#888',
            },
            value: {
              show: true,
              fontSize: '28px',
              color: '#0D47A1',
              formatter: (val: number) => `${Math.round(val * maxRPM)} rpm`,
            },
          },
        },
      },
      stroke: { lineCap: 'round' },
      fill: { colors: ['#0D47A1'] },
      labels: ['Motor speed'],
    };
  }

  public linearOptions!: Partial<ChartLinearOptions>;
  public chartLinear() {
    this.linearOptions = {
      series: [
        {
          name: 'Potencia Motor',
          data: [0],
        },
      ],
      chart: {
        height: 120,
        type: 'bar',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '40%',
          borderRadius: 5,
        },
      },
      xaxis: {
        min: 0,
        max: 50,
        tickAmount: 6,
        categories: [''], // <== esto es clave para que solo sea 1 barra
        labels: {
          style: {
            fontSize: '12px',
            colors: '#000000',
          },
        },
      },
      yaxis: {
        show: false, // oculta completamente el eje
        labels: {
          show: false,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false, // oculta líneas horizontales
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val} Kw`,
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          colors: ['#000000'],
        },
      },
      fill: {
        colors: ['#0D47A1'],
      },
      stroke: {
        width: 1,
        colors: ['#0D47A1'],
      },
      tooltip: {
        enabled: false,
      },
    };
  }

  getStatusStyle() {
    let color = '#ffc107'; // Amarillo por defecto

    if (this.plcInfo?.FLT === 1) {
      color = '#dc3545'; // Rojo
    }

    if (this.plcInfo?.RUN === 1) {
      color = '#28a745'; // Verde tiene prioridad si está activo
    }

    return {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: color,
    };
  }

  getConexionLabel(plcInfo: any): string {
    if (!plcInfo) return '';

    const ip = plcInfo.IP;
    const loc = plcInfo.LOC;
    // Lista de IPs donde la lógica está invertida
    const ipsInversas = ['172.16.107.5', '172.16.108.2', '172.16.8.9']; // puedes agregar más

    const esInverso = ipsInversas.includes(ip);

    if (esInverso) {
      return loc === 1 ? 'Remota' : 'Local';
    }

    return loc === 1 ? 'Local' : 'Remota';
  }
  menu: any[] = [
    {
      active: false,
      nombre: 'ESTADO DEL VARIADOR',
      isSelected: false,
    },
    {
      active: true,
      nombre: 'INDICADORES',
      isSelected: false,
    },
  ];

  cambiarMenu(index: number) {
    this.menu.forEach((item, i) => {
      if (i === index) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }

  otrosChartOptions: Partial<HistoricoChartOptions>[] = [];
  fechasHistorico: string[] = [];

  trackByIndex(index: number): number {
    return index;
  }

  tiempoHistorico: string = '5m';

  onCambioTiempo(valor: string) {
    this.tiempoHistorico = valor;
    if (valor !== 'personalizado') {
      this.obtenerDataHistoricoPlc();
    }
  }

  voltajeChart: any;

  corrienteChart: any;

  potenciaChart: any;
  horometroPieChart: GraficoPie = {
    series: [],
    chart: {
      type: 'pie',
      height: 300,
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
    },
    labels: [],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} min`,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    legend: {
      show: true,
      position: 'right',
      formatter: (label: string, opts: any) => {
        const minutos = opts.w.globals.series[opts.seriesIndex];
        const horas = (minutos / 60).toFixed(2);
        return `${label}: ${horas} h`;
      },
    },
  };
  datosAgrupadosPorIp: any[] = [];

  buscarHorometro(): void {
    this.horometroService
      .obtenerPorFechas(this.plcMedidor.ip, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => {
          console.log('✅ Datos agrupados por IP:', data);
          this.datosAgrupadosPorIp = data;
          console.log('Datos agrupados por IP:', this.datosAgrupadosPorIp);
          this.generarGraficoHorometroPie();
        },
        error: (err) => console.error('❌ Error al obtener datos:', err),
      });
  }

  generarGraficoHorometroPie(): void {
    const series: number[] = [];
    const labels: string[] = [];

    // Acumular tiempo total por equipo
    for (const ip in this.datosAgrupadosPorIp) {
      const registros = this.datosAgrupadosPorIp[ip];
      const nombre = registros[0]?.nombre || ip;

      const minutosTotales = registros.reduce((sum: number, r: any) => {
        return sum + (r.minutosEncendido || 0);
      }, 0);

      series.push(minutosTotales);
      labels.push(nombre.replace(/^VARIADOR\s*-\s*/i, '').trim());
    }

    // Configurar el gráfico
    this.horometroPieChart = {
      series,
      labels,
      chart: {
        type: 'pie',
        height: 320,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${(val / 60).toFixed(2)} h`,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
      legend: {
        position: 'right',
        fontSize: '14px',
        formatter: (label: string, opts: any) => {
          const minutos = series[opts.seriesIndex] || 0;
          const horas = Math.floor(minutos / 60);
          const min = minutos % 60;
          return `${label}: ${horas}h ${min}min`;
        },
      },
    };
  }

  dividirBloquesConFechas(
  data: any[],
  key: string,
  maxBloques: number = 8
): { fechas: string[]; promedios: (number | null)[] } {
  const datosValidos = data.filter((d) => d[key] != null && !isNaN(d[key]));
  const cantidad = datosValidos.length;

  // Si hay pocos datos, mostrar uno a uno
  if (cantidad <= maxBloques) {
    return {
      fechas: datosValidos.map((d) => {
        const f = new Date(d.fecha);
        return `${f.getMonth() + 1}-${f.getDate()} ${f.getHours()}:${String(f.getMinutes()).padStart(2, '0')}`;
      }),
      promedios: datosValidos.map((d) => Math.round(d[key] * 100) / 100),
    };
  }

  // Agrupar en bloques si hay más de maxBloques datos
  const tamaño = Math.ceil(cantidad / maxBloques);
  const promedios: (number | null)[] = [];
  const fechas: string[] = [];

  for (let i = 0; i < cantidad; i += tamaño) {
    const bloque = datosValidos.slice(i, i + tamaño);
    const valores = bloque.map((d) => d[key]).filter((v) => v != null && !isNaN(v));
    const promedio = valores.length
      ? Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100
      : null;

    promedios.push(promedio);

    const fechaProm = new Date(bloque[Math.floor(bloque.length / 2)].fecha);
    const fechaLabel = `${fechaProm.getMonth() + 1}-${fechaProm.getDate()} ${fechaProm.getHours()}:${String(
      fechaProm.getMinutes()
    ).padStart(2, '0')}`;
    fechas.push(fechaLabel);
  }

  return { fechas, promedios };
}


  agruparYPromediar(arr: number[], chunks: number): number[] {
    const tamaño = Math.ceil(arr.length / chunks);
    const promedios: number[] = [];

    for (let i = 0; i < arr.length; i += tamaño) {
      const grupo = arr
        .slice(i, i + tamaño)
        .filter((v) => v !== null && v !== undefined);
      const promedio = grupo.length
        ? Math.round((grupo.reduce((a, b) => a + b, 0) / grupo.length) * 100) /
          100
        : 0;
      promedios.push(promedio);
    }

    return promedios;
  }
}
