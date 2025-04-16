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
import { SocketService } from '../../services/socket.service';
import { DataPlcService } from '../../services/data-plc.service';

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
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {
  plcList: any[] = [];
  historicoData: any[] = [];
  fechas: string[] = [];
  actualizacionInterval: any;

  chartOptions: Partial<ChartOptions>[] = [];
  chartTitles = ['Corriente', 'Voltaje', 'Potencia', 'Frecuencia', 'RPM'];

  @ViewChildren(ChartComponent) chartComponents!: QueryList<ChartComponent>;

  constructor(
    private readonly _socketService: SocketService,
    private readonly dataPlc: DataPlcService
  ) {}

  ngOnInit(): void {
    this.getListaEquipos();

    // Actualización automática cada 10s
    this.actualizacionInterval = setInterval(() => {
      const ips = this.plcList.map((item) => item.ip);
      if (ips.length > 0) {
        this._socketService.sendFindHistoricoPlcData(ips, 10);
      }
    }, 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.actualizacionInterval);
  }

  getListaEquipos() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        this.plcList = data.filter((item: any) => item.tipo === 'variador');
        const ips = this.plcList.map((item) => item.ip);
        this._socketService.sendFindHistoricoPlcData(ips, 10);
        this.listenHistorico();
      },
      error: (err) => console.error('Error:', err),
    });
  }

  listenHistorico() {
    this._socketService.receiveHistoricoPlcData().subscribe((data) => {
      this.historicoData = data.map((equipo: any) => ({
        ...equipo,
        data: [...equipo.data].reverse(),
      }));

      this.fechas = this.historicoData[0]?.data.map((d: any) =>
        new Date(d.fecha).toLocaleTimeString()
      ) || [];

      if (this.chartOptions.length === 0) {
        this.generarGraficos();
      } else {
        this.actualizarGraficos();
      }
    });
  }

  generarGraficos() {
    const tipos = ['corriente', 'voltaje', 'potencia', 'frecuencia', 'rpm'];
  
    for (const tipo of tipos) {
      const series = this.historicoData.map((equipo) => {
        const nombre = this.plcList.find(p => p.ip === equipo.ip)?.nombre || equipo.ip;
  
        const datos = tipo === 'rpm'
          ? equipo.data.map((d: any) => {
              const maxRPM = this.getMaxRPM(equipo.ip);
              return Math.round((d.frecuencia / 60) * maxRPM);
            })
          : equipo.data.map((d: any) => d[tipo]);
  
        return { name: nombre, data: datos };
      });
  
      // ✅ Serie invisible con valores 0
      const baseSerie = {
        name: 'Base',
        data: Array(this.fechas.length).fill(0),
        color: 'transparent',
      };
  
      this.chartOptions.push({
        series: [...series, baseSerie],
        title: { text: tipo.toUpperCase() },
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
          labels: {
            formatter: (value: number) => value.toFixed(2),
          },
        },
        legend: {
          show: true,
          labels: { colors: ['#000'] },
          formatter: (seriesName: string) => seriesName === 'Base' ? '' : seriesName,
        },
        dataLabels: { enabled: false },
      });
      
      
    }
  }
  

  getMaxRPM(ip: string): number {
    const rpmMap: Record<string, number> = {
      '172.16.8.9': 3450,
      '172.16.107.5': 1785,
      // Puedes agregar más IPs aquí
    };
    console.log(rpmMap[ip] )
    return rpmMap[ip] || 1780; // por defecto 1780 si no está en el mapa
  }
  



  actualizarGraficos() {
    const tipos = ['corriente', 'voltaje', 'potencia', 'frecuencia', 'rpm'];
  
    this.chartComponents.forEach((chart, index) => {
      const tipo = tipos[index];
      const nuevasSeries = this.historicoData.map((equipo) => {
        const ip = equipo.ip;
        const maxRPM = this.getMaxRPM(ip);
        const nombre = this.plcList.find(p => p.ip === ip)?.nombre || ip;
  
        const datos = equipo.data.map((d: any) => {
          if (tipo === 'rpm') {
            return Math.round((d.frecuencia / 60) * maxRPM);
          }
          return d[tipo];
        });
  
        return { name: nombre, data: datos };
      });
  
      const baseSerie = {
        name: 'Base',
        data: Array(this.fechas.length).fill(0),
        color: 'transparent',
      };
      
      chart.updateOptions(
        {
          series: [...nuevasSeries, baseSerie],
          xaxis: { categories: [...this.fechas] },
          yaxis: {
            min: 0,
            forceNiceScale: true,
            tickAmount: 5,
            labels: {
              formatter: (value: number) => value.toFixed(2),
            },
          },
          legend: {
            show: true,
            labels: { colors: ['#000'] },
            formatter: (seriesName: string) =>
              seriesName === 'Base' ? '' : seriesName,
          },
        },
        false,
        true
      );
      
    });
  }
  
}
