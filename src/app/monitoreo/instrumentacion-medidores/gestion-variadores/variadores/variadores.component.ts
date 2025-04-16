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
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './variadores.component.html',
  styleUrl: './variadores.component.scss',
})
export class VariadoresComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _plcData = inject(DataPlcService);
  private readonly _socketService = inject(SocketService);

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
        this._socketService.sendFindPlcData(ip);
      });

      // Escuchar la respuesta del servidor
      this.plcDataSub = this._socketService
        .receivePlcData()
        .subscribe((data) => {
          console.log(data, 'data....');

          this.plcInfo = data;

          //regla de 3 para 60 hz equivale a 3450rpm  a cuanto equivale la de this.plcInfo.frecuencia

          let maxRPM = 1780;

          if (this.plcMedidor?.ip === '172.16.8.9') {
            maxRPM = 3450;
          } else if (this.plcMedidor?.ip === '172.16.107.5') {
            maxRPM = 1785;
          }

          const currentRPM = (this.plcInfo.frecuencia / 60) * maxRPM;
          console.log(currentRPM, 'currentRPM');

          this.updateRPM(currentRPM);

          this.updateLinear(this.plcInfo.potencia);
        });
    }
  }
  obtenerDataHistoricoPlc() {
    // Actualización automática cada 10s
    this.actualizacionInterval = setInterval(() => {
      const ips = [this.plcMedidor.ip];
      if (ips.length > 0) {
        this._socketService.sendFindHistoricoPlcData(ips, 75);
      }
    }, 15000);
  }

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
  actualizacionInterval: any;
  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
    this.plcDataSub?.unsubscribe();
    clearInterval(this.actualizacionInterval);
    console.log('🔌 Socket desconectado desde componente');
  }

  getDataMedidor() {
    this._plcData.getListaEquipos().subscribe({
      next: (resp) => {
        console.log(resp);
        this.plcMedidor = resp.find((plc: any) => plc.ip === this.ip);
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
        });
      },
      error: (err) => {},
    });
  }
  generarGraficosHistoricos(data: any[]) {
    this.otrosChartOptions = [];
    const tipos = ['corriente', 'voltaje', 'potencia', 'frecuencia', 'rpm'];
  
    const bloques = 5;
  
    const agruparYPromediar = (lista: number[]) => {
      const agrupados: number[] = [];
      for (let i = 0; i < lista.length; i += bloques) {
        const grupo = lista.slice(i, i + bloques);
        const promedio =
          grupo.reduce((acc, val) => acc + val, 0) / grupo.length;
        agrupados.push(Number(promedio.toFixed(2)));
      }
      return agrupados;
    };
  
    const fechasReducidas: string[] = [];
    for (let i = 0; i < data.length; i += bloques) {
      const fechaReferencia = new Date(data[i].fecha).toLocaleTimeString();
      fechasReducidas.push(fechaReferencia);
    }
  
    for (const tipo of tipos) {
      const datosOriginales = data.map((d: any) => {
        if (tipo === 'rpm') {
          const maxRPM = this.getMaxRPM(this.ip!);
          return Math.round((d.frecuencia / 60) * maxRPM);
        }
        return d[tipo];
      });
  
      const datosReducidos = agruparYPromediar(datosOriginales);
  
      let guideValue = 0;
      switch (tipo) {
        case 'corriente':
          guideValue = Number(this.plcMedidor?.Inom?.replace(' A', '') || 0);
          break;
        case 'voltaje':
          guideValue = Number(this.plcMedidor?.Vnom?.replace(' V', '') || 0);
          break;
        case 'potencia':
          const hp = Number(this.plcMedidor?.Pnom?.replace(' HP', '') || 0);
          guideValue = Number((hp * 0.7457).toFixed(2));
          break;
        case 'rpm':
          guideValue = Number(this.plcMedidor?.Nnom?.replace(' rpm', '') || 0);
          break;
        case 'frecuencia':
          guideValue = 60;
          break;
      }
  
      // Series comunes
      const equipoSerie = {
        name: this.plcMedidor?.nombre || 'Equipo',
        data: datosReducidos,
      };
  
      const nominalSerie = {
        name: 'Nominal',
        data: Array(datosReducidos.length).fill(guideValue),
      };
  
      const baseSerie = {
        name: 'Base',
        data: Array(datosReducidos.length).fill(0),
        color: 'transparent',
      };
  
      // Series adicionales solo para frecuencia
      const minSerie = {
        name: 'Mínimo permitido (49 Hz)',
        data: Array(datosReducidos.length).fill(49),
        color: '#e74c3c',
      };
  
   
      // Armar el array de series
      const seriesFinal = tipo === 'frecuencia'
        ? [equipoSerie, nominalSerie, minSerie, baseSerie]
        : [equipoSerie, nominalSerie, baseSerie];
  
      this.otrosChartOptions.push({
        series: seriesFinal,
        title: { text: tipo.toUpperCase() },
        chart: {
          type: 'line',
          height: 280,
          animations: { enabled: false },
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
          categories: fechasReducidas,
          labels: { rotate: -45 },
        },
        yaxis: {
          min: tipo === 'frecuencia' ? 49 : ['corriente', 'voltaje', 'potencia'].includes(tipo) ? 0 : undefined,
          max: tipo === 'frecuencia' ? 60 : Math.max(...datosReducidos, guideValue) + 1,
          labels: {
            formatter: (value: number) => value.toFixed(2),
          },
        },
        legend: {
          show: true,
          labels: {
            colors: ['#000'],
          },
          formatter: (seriesName) =>
            seriesName === 'Base' ? '' : seriesName,
        },
        dataLabels: { enabled: false },
      });
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
      nombre: 'GRAFICOS',
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
}
