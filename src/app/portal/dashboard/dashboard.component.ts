import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ChartType,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';

import { SocketService } from '../../services/socket.service';
import { DataPlcService } from '../../services/data-plc.service';
import { HorometroService } from '../../services/horometro.service';

type GraficoPromedio = {
  chart: ApexChart;
  xaxis?: any;
  yaxis: ApexYAxis;
  series: ApexAxisChartSeries;
  plotOptions?: any;
  dataLabels?: any;
  tooltip?: any;
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule, TabViewModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {

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

  tipoSeleccionado: 'variador' | 'pm' = 'variador';
  tiempoHistorico = '5m';
  cantidadTiempo = 1;
  unidadTiempo: 's' | 'm' | 'h' | 'd' = 'h';

  plcList: any[] = [];
  historicoData: any[] = [];
  equiposSeleccionados: string[] = [];

  historicoSub!: Subscription;

  

  visitorType: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
  } = {
    series: [],
    chart: { type: 'bar', height: 250 },
    xaxis: { categories: [] },
  };

  constructor(
    private readonly socketService: SocketService,
    private readonly dataPlc: DataPlcService,
    private horometroService: HorometroService
  ) {}

  ngOnInit(): void {
    this.getListaEquipos();
    this.iniciarEstadoEquiposInterval();
  }

  estadoInterval: any;

iniciarEstadoEquiposInterval(): void {
  this.actualizarEstadoEquipos(); // llamada inmediata
  this.estadoInterval = setInterval(() => {
    this.actualizarEstadoEquipos();
  }, 10000);
}

  datosAgrupadosPorIp: any = {};
  buscarHorometro(): void {
    this.horometroService.obtenerPorFechas(this.equiposSeleccionados).subscribe({
      next: (data) => {
        console.log('✅ Datos agrupados por IP:', data);
        this.datosAgrupadosPorIp = data;
        console.log('Datos agrupados por IP:', this.datosAgrupadosPorIp);
        this.generarGraficoHorometroPie();
      },
      error: (err) => console.error('❌ Error al obtener datos:', err)
    });
  }

  estadoEquiposChart = {
    series: [] as number[],
    chart: {
      type: 'pie' as ChartType,
      height: 300,
      toolbar: { show: true }
    },
    
    labels: ['Activo (RUN)', 'Falla', 'Listo (READY)'],
    legend: {
      position: 'bottom' as 'bottom'
    },
    tooltip: {
      y: { formatter: (val: number) => `${val.toFixed(1)}%` }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) =>
        `${opts.w.globals.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`
    }
  };
  
  ngOnDestroy(): void {
    this.historicoSub?.unsubscribe();
    clearInterval(this.estadoInterval); // <- DETENER INTERVALO
  }
  estadoEquiposDetalle: { ip: string; nombre: string; estado: 'EN MARCHA' | 'FALLA' | 'DETENIDO' }[] = [];
  actualizarEstadoEquipos(): void {
    const estadoCount: Record<'EN MARCHA' | 'FALLA' | 'DETENIDO', number> = {
      'EN MARCHA': 0,
      FALLA: 0,
      DETENIDO: 0,
    };
  
    // Mapa temporal de resultados por IP
    const resultadosPorIp: Record<string, { ip: string; nombre: string; estado: 'EN MARCHA' | 'FALLA' | 'DETENIDO' }> = {};
  
    for (const ip of this.equiposSeleccionados) {
      this.socketService.sendFindPlcData(ip, 'variador');
    }
  
    this.socketService.receivePlcData().subscribe((data) => {
      if (!data || !data.IP) return;
  
      const ip = data.IP;
      const estado: 'EN MARCHA' | 'FALLA' | 'DETENIDO' =
        data.RUN === 1 ? 'EN MARCHA' : data.FLT === 1 ? 'FALLA' : 'DETENIDO';
  
      const nombre =
        this.plcList.find((e) => e.ip === ip)?.nombre.replace(/^VARIADOR\s*-\s*/i, '').trim() || ip;
  
      resultadosPorIp[ip] = { ip, nombre, estado };
  
      // Obtener todos los valores únicos
      const valoresUnicos = Object.values(resultadosPorIp);
  
      // Resetear conteo
      estadoCount['EN MARCHA'] = 0;
      estadoCount.FALLA = 0;
      estadoCount.DETENIDO = 0;
  
      for (const equipo of valoresUnicos) {
        estadoCount[equipo.estado]++;
      }
  
      const total = valoresUnicos.length;
      this.estadoEquiposChart.series = total
        ? Object.values(estadoCount).map((v) => Math.round((v / total) * 1000) / 10)
        : [0, 0, 0];
  
      // 🔄 Actualizar solo los datos existentes (sin recrear el array completo)
      for (const equipo of valoresUnicos) {
        const existente = this.estadoEquiposDetalle.find((e) => e.ip === equipo.ip);
        if (existente) {
          if (existente.estado !== equipo.estado) {
            existente.estado = equipo.estado;
          }
        } else {
          this.estadoEquiposDetalle.push(equipo);
        }
      }
    });
  }
  
  
  
  
  
  onCambioTiempo(valor: string): void {
    this.tiempoHistorico = valor;
    if (valor !== 'personalizado') {
      this.enviarPeticionHistorico();
    }
  }

  onCambioTiempoPersonalizado(): void {
    if (this.cantidadTiempo > 0 && this.unidadTiempo) {
      this.tiempoHistorico = `${this.cantidadTiempo}${this.unidadTiempo}`;
      this.enviarPeticionHistorico();
    }
  }

  cambiarTipoEquipo(): void {
    this.historicoData = [];
   
    this.getListaEquipos();
  }

  getListaEquipos(): void {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        this.plcList = data.filter(
          (item: any) => item.tipo === this.tipoSeleccionado
        );
        this.equiposSeleccionados = this.plcList.map((item) => item.ip);
        this.enviarPeticionHistorico();
        this.escucharHistorico();
        this.buscarHorometro();
      },
      error: (err) => console.error('Error al obtener equipos:', err),
    });
  }

  enviarPeticionHistorico(): void {
    this.socketService.sendFindHistoricoPlcData(
      this.equiposSeleccionados,
      this.tiempoHistorico,
      this.tipoSeleccionado
    );
  }

  escucharHistorico(): void {
    this.historicoSub?.unsubscribe();
    this.historicoSub = this.socketService
      .receiveHistoricoPlcData()
      .subscribe((data) => {
        this.historicoData = data
          .filter((equipo: any) =>
            this.equiposSeleccionados.includes(equipo.ip)
          )
          .map((equipo: any) => ({
            ...equipo,
            data: [...equipo.data].reverse(),
          }));
        this.generarGraficosSeparados();
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
            download: true
          }
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${(val / 60).toFixed(2)} h`
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`
      },
      legend: {
        position: 'right',
        fontSize: '14px',
        formatter: (label: string, opts: any) => {
          const minutos = series[opts.seriesIndex] || 0;
          const horas = (minutos / 60).toFixed(2);
          return `${label}: ${horas} h`;
        }
      }
    };
  }
  

  generarGraficosSeparados(): void {
    const base: {
      chart: ApexChart;
      xaxis: ApexXAxis;
    } = {
      chart: { type: 'bar' as ChartType, height: 250 },
      xaxis: {
        categories: [], // <- Tipado correctamente por ApexXAxis
        labels: {
          rotate: -15,
          style: { fontSize: '12px' },
        },
      },
    };

    const voltajeSeries: number[] = [];
    const corrienteSeries: number[] = [];
    const potenciaSeries: number[] = [];
    const categorias: string[] = [];

    for (const equipo of this.historicoData) {
      const nombreCompleto =
        this.plcList.find((p) => p.ip === equipo.ip)?.nombre || equipo.ip;
      const nombreLimpio = nombreCompleto
        .replace(/^VARIADOR\s*-\s*/i, '')
        .trim();
      categorias.push(nombreLimpio);

      const voltajes = equipo.data
        .map((d: any) => d.voltaje)
        .filter((v: number) => v !== undefined);
      const corrientes = equipo.data
        .map((d: any) => d.corriente)
        .filter((v: number) => v !== undefined);
      const potencias = equipo.data
        .map((d: any) => d.potencia)
        .filter((v: number) => v !== undefined);

      const avg = (arr: number[]) =>
        arr.length
          ? Math.round(
              (arr.reduce((a: number, b: number) => a + b, 0) / arr.length) *
                100
            ) / 100
          : 0;

      voltajeSeries.push(avg(voltajes));
      corrienteSeries.push(avg(corrientes));
      potenciaSeries.push(avg(potencias));
    }

    this.voltajeChart = {
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
            customIcons: [],
          },
          autoSelected: 'zoom',
        },
        animations: { enabled: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
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
        formatter: (val: number) => `${val.toFixed(1)} V`,
      },
      xaxis: {
        categories: categorias,
        labels: {
          rotate: -15,
          style: { fontSize: '12px' },
        },
      },
      yaxis: {
        title: { text: 'Voltaje (V)' },
        labels: { formatter: (val: number) => `${val.toFixed(1)} V` },
      },
      series: [
        {
          name: 'Voltaje promedio',
          data: voltajeSeries,
        },
      ],
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(2)} V`,
        },
      },
    };

    this.corrienteChart = {
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
            customIcons: [],
          },
          autoSelected: 'zoom',
        },
        animations: { enabled: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
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
        formatter: (val: number) => `${val.toFixed(1)} A`,
      },
      yaxis: {
        title: { text: 'Corriente (A)' },
        labels: {
          formatter: (val: number) => `${val.toFixed(1)} A`,
        },
      },
      series: [
        {
          name: 'Corriente promedio',
          data: corrienteSeries,
        },
      ],
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(2)} A`,
        },
      },
      xaxis: {
        categories: categorias,
        labels: {
          rotate: -15,
          style: { fontSize: '12px' },
        },
      },
    };

    this.potenciaChart = {
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
            customIcons: [],
          },
          autoSelected: 'zoom',
        },

        animations: { enabled: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
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
        formatter: (val: number) => `${val.toFixed(2)} kW`,
      },
      yaxis: {
        title: { text: 'Potencia (kW)' },
        labels: {
          formatter: (val: number) => `${val.toFixed(2)} kW`,
        },
      },
      series: [
        {
          name: 'Potencia promedio',
          data: potenciaSeries,
        },
      ],
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(2)} kW`,
        },
      },
      xaxis: {
        categories: categorias,
        labels: {
          rotate: -15,
          style: { fontSize: '12px' },
        },
      },
    };
  }

  get metricasPromedio(): string[] {
    return ['voltaje', 'corriente', 'potencia'];
  }
  tiempoPromedioVariadores = 0;
}
