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
  plcList: any[] = [];
  historicoData: any[] = [];
  fechas: string[] = [];
  chartOptions: Partial<ChartOptions>[] = [];
  tipoSeleccionado: string = 'variador';
  historicoSub!: Subscription;
  actualizacionInterval: any;
  equiposSeleccionados: string[] = [];

  tiempoHistorico: string = '5m';
  refresco: number = 5000;

  @ViewChildren(ChartComponent) chartComponents!: QueryList<ChartComponent>;

  constructor(
    private readonly _socketService: SocketService,
    private readonly dataPlc: DataPlcService
  ) {}

  ngOnInit(): void {
    this.getListaEquipos();
    this.iniciarIntervalo();
  }

  ngOnDestroy(): void {
    clearInterval(this.actualizacionInterval);
    if (this.historicoSub) this.historicoSub.unsubscribe();
  }

  iniciarIntervalo() {
    clearInterval(this.actualizacionInterval);
    if (this.refresco > 0) {
      this.actualizacionInterval = setInterval(() => {
        this._socketService.sendFindHistoricoPlcData(
          this.equiposSeleccionados,
          this.tiempoHistorico,
          this.tipoSeleccionado
        );
      }, this.refresco);
    }
  }

  onCambioRefresco(valor: number) {
    this.refresco = valor;
    this.iniciarIntervalo();
  }

 
  getListaEquipos() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        this.plcList = data.filter((item: any) => item.tipo === this.tipoSeleccionado);
        this.equiposSeleccionados = this.plcList.map((item) => item.ip);
        const ips = this.plcList.map((item) => item.ip);
        this._socketService.sendFindHistoricoPlcData(ips, this.tiempoHistorico, this.tipoSeleccionado);
        this.listenHistorico();
      },
      error: (err) => console.error('Error:', err),
    });
  }

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
      this.fechas = equipoConDatos?.data.map((d: any) =>
        new Date(d.fecha).toLocaleString('es-EC', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      ) || [];
      

      this.chartOptions.length === 0 ? this.generarGraficos() : this.actualizarGraficos();
    });
  }

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

  generarGraficos() {
    this.chartOptions = [];

    const tipos = this.tipoSeleccionado === 'variador'
      ? ['corriente', 'voltaje', 'potencia', 'frecuencia', 'rpm']
      : [
        'CORRIENTE_TOT',
        'VOLTAJE_TOT',
        'POT_TOT',
        'FPOT_TOT',
        'FHZ_TOT',
        'ENERG',
      
        'CORRIENTE_A', 'CORRIENTE_B', 'CORRIENTE_C',
        'VOLTAJE_AB', 'VOLTAJE_BC', 'VOLTAJE_CA',
        'POT_A', 'POT_B', 'POT_C',
        'FPOT_A', 'FPOT_B', 'FPOT_C',
        'THD_COR_A', 'THD_COR_B', 'THD_COR_C',
        'TH_DBA', 'TH_DBC', 'TH_DCA'
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

  actualizarGraficos() {
    const tipos = this.tipoSeleccionado === 'pm'
      ? [
        'CORRIENTE_TOT',
        'VOLTAJE_TOT',
        'POT_TOT',
        'FPOT_TOT',
        'FHZ_TOT',
        'ENERG',
      
        'CORRIENTE_A', 'CORRIENTE_B', 'CORRIENTE_C',
        'VOLTAJE_AB', 'VOLTAJE_BC', 'VOLTAJE_CA',
        'POT_A', 'POT_B', 'POT_C',
        'FPOT_A', 'FPOT_B', 'FPOT_C',
        'THD_COR_A', 'THD_COR_B', 'THD_COR_C',
        'TH_DBA', 'TH_DBC', 'TH_DCA'
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
            formatter: (name: any) => (name === 'Base' ? '' : name),
          },
        },
        false,
        true
      );
    });
  }

  private serieBase() {
    return { name: 'Base', data: Array(this.fechas.length).fill(0), color: 'transparent' };
  }

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

  cambiarTipoEquipo() {
    this.chartOptions = [];
    this.fechas = [];
    this.historicoData = [];
    if (this.historicoSub) this.historicoSub.unsubscribe();
    setTimeout(() => this.getListaEquipos(), 0);
  }

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

    this._socketService.sendFindHistoricoPlcData(this.equiposSeleccionados, this.tiempoHistorico, this.tipoSeleccionado);
    this.listenHistorico();
  }

  onCheckboxChange(event: Event, ip: string) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleEquipoSeleccion(ip, checked);
  }

  cantidadTiempo: number = 1;
unidadTiempo: string = 'h';

onCambioTiempo(valor: string) {
  console.log('Cambio de tiempo:', valor);
  this.tiempoHistorico = valor;

  // No dispares aún si es personalizado
  if (valor !== 'personalizado') {
    this._socketService.sendFindHistoricoPlcData(
      this.equiposSeleccionados,
      this.tiempoHistorico,
      this.tipoSeleccionado
    );
  }
}

  
  onCambioTiempoPersonalizado() {
    if (this.cantidadTiempo > 0 && this.unidadTiempo) {
      this.tiempoHistorico = `${this.cantidadTiempo}${this.unidadTiempo}`;
      console.log('Tiempo personalizado aplicado:', this.tiempoHistorico);
  
      this._socketService.sendFindHistoricoPlcData(
        this.equiposSeleccionados,
        this.tiempoHistorico,
        this.tipoSeleccionado
      );
    }
  }
  
  
  
}