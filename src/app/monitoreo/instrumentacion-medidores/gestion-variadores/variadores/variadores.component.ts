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
  imports: [CommonModule, NgApexchartsModule,FormsModule],
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
    clearInterval(this.actualizacionInterval); // limpiar si ya hay uno
  
    const ip = this.plcMedidor?.ip;
    if (!ip) return;
  
    // Consulta inicial
    this._socketService.sendFindHistoricoPlcData(
      [ip],
      this.tiempoHistorico,
      'variador'
    );
  
    // Auto-actualización
    this.actualizacionInterval = setInterval(() => {
      this._socketService.sendFindHistoricoPlcData(
        [ip],
        this.tiempoHistorico,
        'variador'
      );
    }, this.refresco);
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
  
    const fechasReducidas: string[] = data.map((d: any) =>
      new Date(d.fecha).toLocaleTimeString()
    );
  
    for (const tipo of tipos) {
      const datos = data.map((d: any) => {
        if (tipo === 'rpm') {
          const maxRPM = this.getMaxRPM(this.ip!);
          return Math.round((d.frecuencia / 60) * maxRPM * 100) / 100;
        }
        return Math.round(d[tipo] * 100) / 100;
      });
  
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
  
      const equipoSerie = {
        name: this.plcMedidor?.nombre || 'Equipo',
        data: datos,
      };
  
      const nominalSerie = {
        name: 'Nominal',
        data: Array(datos.length).fill(guideValue),
      };
  
      const baseSerie = {
        name: 'Base',
        data: Array(datos.length).fill(0),
        color: 'transparent',
      };
  
      const minSerie = {
        name: 'Mínimo permitido (49 Hz)',
        data: Array(datos.length).fill(49),
        color: '#e74c3c',
      };
  
      const seriesFinal =
        tipo === 'frecuencia'
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
          min:
            tipo === 'frecuencia'
              ? 49
              : ['corriente', 'voltaje', 'potencia'].includes(tipo)
              ? 0
              : undefined,
          max:
            tipo === 'frecuencia'
              ? 60
              : Math.max(...datos, guideValue) + 1,
          labels: {
            formatter: (value: number) => value.toFixed(2),
          },
        },
        legend: {
          show: true,
          labels: { colors: ['#000'] },
          formatter: (name: string) => (name === 'Base' ? '' : name),
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

  tiempoHistorico: string = '5m';
  
  refresco: number = 5000;
  actualizacionInterval: any;
  

  onCambioTiempo(valor: string) {
    this.tiempoHistorico = valor;
    if (valor !== 'personalizado') {
      this.obtenerDataHistoricoPlc();
    }
  }
  onCambioRefresco() {
    console.log('Nuevo intervalo de refresco:', this.refresco);
    this.obtenerDataHistoricoPlc();
  }


}
