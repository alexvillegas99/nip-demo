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
  colors?: string[];
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
  // por defecto las fechas son del día actual
  fechaActual: Date = new Date();
  fechaInicio: Date = new Date(
    this.fechaActual.getTime() - 24 * 60 * 60 * 1000
  ); // hace 24 horas
  fechaFin: Date = new Date(this.fechaActual.getTime() + 24 * 60 * 60 * 1000); // dentro de 24 horas

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
      formatter: (label: string, opts: any) => `${label}: ${opts.w.globals.series[opts.seriesIndex].toFixed(2)} kWh`,
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
  totalEnergiaKwh: string;
  totalCostoEnergia: string;

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
    this.horometroService
      .obtenerPorFechas(this.equiposSeleccionados)
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

  estadoEquiposChart = {
    series: [] as number[],
    chart: {
      type: 'pie' as ChartType,
      height: 300,
      toolbar: { show: true },
    },

    labels: ['Activo (RUN)', 'Falla', 'Listo (READY)'],
    legend: {
      position: 'bottom' as 'bottom',
    },
    tooltip: {
      y: { formatter: (val: number) => `${val.toFixed(1)}%` },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) =>
        `${opts.w.globals.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`,
    },
  };

  ngOnDestroy(): void {
    this.historicoSub?.unsubscribe();
    clearInterval(this.estadoInterval); // <- DETENER INTERVALO
  }
  estadoEquiposDetalle: {
    ip: string;
    nombre: string;
    estado: 'EN MARCHA' | 'FALLA' | 'DETENIDO';
  }[] = [];
  actualizarEstadoEquipos(): void {
    const estadoCount: Record<'EN MARCHA' | 'FALLA' | 'DETENIDO', number> = {
      'EN MARCHA': 0,
      FALLA: 0,
      DETENIDO: 0,
    };

    // Mapa temporal de resultados por IP
    const resultadosPorIp: Record<
      string,
      { ip: string; nombre: string; estado: 'EN MARCHA' | 'FALLA' | 'DETENIDO' }
    > = {};

    for (const ip of this.equiposSeleccionados) {
      this.socketService.sendFindPlcData(ip, 'variador');
    }

    this.socketService.receivePlcData().subscribe((data) => {
      if (!data || !data.IP) return;

      const ip = data.IP;
      const estado: 'EN MARCHA' | 'FALLA' | 'DETENIDO' =
        data.RUN === 1 ? 'EN MARCHA' : data.FLT === 1 ? 'FALLA' : 'DETENIDO';

      const nombre =
        this.plcList
          .find((e) => e.ip === ip)
          ?.nombre.replace(/^VARIADOR\s*-\s*/i, '')
          .trim() || ip;

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
        ? Object.values(estadoCount).map(
            (v) => Math.round((v / total) * 1000) / 10
          )
        : [0, 0, 0];

      // 🔄 Actualizar solo los datos existentes (sin recrear el array completo)
      for (const equipo of valoresUnicos) {
        const existente = this.estadoEquiposDetalle.find(
          (e) => e.ip === equipo.ip
        );
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
        if (this.tipoSeleccionado === 'variador') {
          this.buscarHorometro();
        } else {
          this.calcularConsumoEnergia();
        }
      },
      error: (err) => console.error('Error al obtener equipos:', err),
    });
  }

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
      ips: [...this.equiposSeleccionados],
      desde: fechaInicioString,
      hasta: fechaFinString,
    };

    try {
      this.dataPlc.getHistoricoEnergia(body).subscribe({
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
  
      const nombre =
        this.plcList.find((e) => e.ip === item.ip)?.nombre.replace(/^PM\s*-\s*/i, '').trim() || item.ip;
  
      series.push(consumo);
      labels.push(`${nombre}: ${consumo.toFixed(2)} kWh - $${costo.toFixed(2)}`);
  
      totalConsumo += consumo;
      totalCosto += costo;
    }
  
    this.totalEnergiaKwh = totalConsumo.toFixed(2);
    this.totalCostoEnergia = totalCosto.toFixed(2);
  
    this.consumoEnergiaPieChart = {
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
        formatter: (label: string) => label, // ya está formateado en `labels`
      },
    };
  }
  
  

  enviarPeticionHistorico(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      console.warn('⚠️ Fecha de inicio o fin no definidas');
      return;
    }

    console.log(
      '📤 Enviando histórico desde',
      this.fechaInicio,
      'hasta',
      this.fechaFin
    );

    this.socketService.sendFindHistoricoPlcData(
      this.equiposSeleccionados,
      this.fechaInicio,
      this.fechaFin,
      this.tipoSeleccionado
    );
    if (this.tipoSeleccionado === 'variador') {
      this.buscarHorometro();
    } else {
      this.calcularConsumoEnergia();
    }
  }

  escucharHistorico(): void {
    this.historicoSub?.unsubscribe();
    this.historicoSub = this.socketService
      .receiveHistoricoPlcData()
      .subscribe((data) => {
        console.log('Datos recibidos:', data);
        this.historicoData = data
          .filter((equipo: any) =>
            this.equiposSeleccionados.includes(equipo.ip)
          )
          .map((equipo: any) => ({
            ...equipo,
            data: [...equipo.data].reverse(),
          }));
       
        console.log('Datos históricos:', this.historicoData);
        if (this.tipoSeleccionado === 'pm') {
          this.generarGraficosPm();
        }else{
          this.generarGraficosSeparados();
        }
      });
  }


  generarGraficoBarra(
    titulo: string,
    categorias: string[],
    data: number[], 
    unidad: string
  ): GraficoPromedio {

    const colores = this.generarColoresAleatorios(data.length); // 🔹 colores dinámicos
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
      colors: colores, 
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
  generarGraficosPm(): void {
    const categorias: string[] = [];
    const corrienteTotales: number[] = [];
    const voltajeTotales: number[] = [];
    const potenciaTotales: number[] = [];
    const frecuenciaTotales: number[] = [];
    const fpTotales: number[] = [];

    for (const equipo of this.historicoData) {
      const nombreCompleto =
        this.plcList.find((p) => p.ip === equipo.ip)?.nombre || equipo.ip;
      const nombreLimpio = nombreCompleto.replace(/^PM\s*-\s*/i, '').trim();
      categorias.push(nombreLimpio);

      const avg = (arr: number[]) =>
        arr.length
          ? Math.round(
              (arr.reduce((a: number, b: number) => a + b, 0) / arr.length) *
                100
            ) / 100
          : 0;

      const data = equipo.data;

      corrienteTotales.push(
        avg(
          data
            .map((d: any) => d.CORRIENTE_TOT)
            .filter((v: number) => v !== undefined)
        )
      );
      voltajeTotales.push(
        avg(
          data
            .map((d: any) => d.VOLTAJE_TOT)
            .filter((v: number) => v !== undefined)
        )
      );
      potenciaTotales.push(
        avg(
          data.map((d: any) => d.POT_TOT).filter((v: number) => v !== undefined)
        )
      );
      frecuenciaTotales.push(
        avg(
          data.map((d: any) => d.FHZ_TOT).filter((v: number) => v !== undefined)
        )
      );
      fpTotales.push(
        avg(
          data
            .map((d: any) => d.FPOT_TOT)
            .filter((v: number) => v !== undefined)
        )
      );
    }

    this.corrienteChart = this.generarGraficoBarra(
      'Corriente Total (A)',
      categorias,
      corrienteTotales,
      'A'
    );
    this.voltajeChart = this.generarGraficoBarra(
      'Voltaje Total (V)',
      categorias,
      voltajeTotales,
      'V'
    );
    this.potenciaChart = this.generarGraficoBarra(
      'Potencia Total (kW)',
      categorias,
      potenciaTotales,
      'kW'
    );
    this.frecuenciaChart = this.generarGraficoBarra(
      'Frecuencia Total (Hz)',
      categorias,
      frecuenciaTotales,
      'Hz'
    );
    this.fpChart = this.generarGraficoBarra(
      'Factor de Potencia Total',
      categorias,
      fpTotales,
      ''
    );
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
          const h = Math.floor(minutos / 60);
          const m = Math.round(minutos % 60);
          return `${label}: ${h}h ${m}min`;
        }
        
      },
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
  private  generarColoresAleatorios(cantidad: number): string[] {
    return Array.from({ length: cantidad }, () => {
      const r = Math.floor(Math.random() * 156) + 100; // evitar colores muy oscuros
      const g = Math.floor(Math.random() * 156) + 100;
      const b = Math.floor(Math.random() * 156) + 100;
      return `rgb(${r}, ${g}, ${b})`;
    });
  }
  
  get metricasPromedio(): string[] {
    return ['voltaje', 'corriente', 'potencia'];
  }
  tiempoPromedioVariadores = 0;

  onTabChange(index: number): void {
    this.tipoSeleccionado = index === 0 ? 'variador' : 'pm';
    this.cambiarTipoEquipo(); // <- ya ejecuta getListaEquipos y toda la lógica
  }
}
