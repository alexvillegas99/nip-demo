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
  stroke?: {
    width: number;
    curve?: 'smooth' | 'straight' | 'stepline';
  };
  markers?: {
    size: number;
  };
  grid?: {
    show: boolean;
    borderColor?: string;
    strokeDashArray?: number;
  };
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
    const inicio = new Date(this.fechaInicio);
inicio.setHours(0, 0, 0, 0);

const fin = new Date(this.fechaFin);
fin.setHours(23, 59, 59, 999);
    // Consulta inicial
    this.horometroService
      .obtenerPorFechas(this.equiposSeleccionados, inicio, fin)
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

        const inicio = new Date(this.fechaInicio);
inicio.setHours(0, 0, 0, 0);

const fin = new Date(this.fechaFin);
fin.setHours(23, 59, 59, 999);
    const fechaInicioString = new Date(inicio)
      .toISOString()
      .split('T')[0];
    const fechaFinString = new Date(fin).toISOString().split('T')[0];

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



        const inicio = new Date(this.fechaInicio);
inicio.setHours(0, 0, 0, 0);

const fin = new Date(this.fechaFin);
fin.setHours(23, 59, 59, 999);

    this.socketService.sendFindHistoricoPlcData(
      this.equiposSeleccionados,
      inicio,
      fin,
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

/*    extraerFechasYValores(
  data: any[],
  campo: string,
  cantidad: number = 8
): { fechas: string[]; valores: number[] } {
  const filtrados = data.filter((d) => d[campo] !== undefined);
  const n = filtrados.length;

  if (n === 0) return { fechas: [], valores: [] };

  const paso = Math.floor(n / cantidad);
  const fechas: string[] = [];
  const valores: number[] = [];

  for (let i = 0; i < cantidad && i * paso < n; i++) {
    const registro = filtrados[i * paso];
    const fecha = new Date(registro.fecha); // asegúrate de que `fecha` exista y sea válida
    const label = `${fecha.getDate().toString().padStart(2, '0')}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, '0')} ${fecha.getHours().toString().padStart(2, '0')}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    fechas.push(label);
    valores.push(registro[campo]);
  }

  return { fechas, valores };
} */

generarGraficosPm(): void {
  // Corriente
  this.corrienteAChart = this.generarGraficoPorCampo('CORRIENTE_A', 'Corriente Fase A', 'A');
  this.corrienteBChart = this.generarGraficoPorCampo('CORRIENTE_B', 'Corriente Fase B', 'A');
  this.corrienteCChart = this.generarGraficoPorCampo('CORRIENTE_C', 'Corriente Fase C', 'A');
  this.corrienteTotChart = this.generarGraficoPorCampo('CORRIENTE_TOT', 'Corriente Total', 'A');

  // Voltaje
  this.voltajeABChart = this.generarGraficoPorCampo('VOLTAJE_AB', 'Voltaje AB', 'V');
  this.voltajeBCChart = this.generarGraficoPorCampo('VOLTAJE_BC', 'Voltaje BC', 'V');
  this.voltajeCACChart = this.generarGraficoPorCampo('VOLTAJE_CA', 'Voltaje CA', 'V');
  this.voltajeTotChart = this.generarGraficoPorCampo('VOLTAJE_TOT', 'Voltaje Total', 'V');

  // Potencia
  this.potenciaAChart = this.generarGraficoPorCampo('POT_A', 'Potencia Fase A', 'kW');
  this.potenciaBChart = this.generarGraficoPorCampo('POT_B', 'Potencia Fase B', 'kW');
  this.potenciaCChart = this.generarGraficoPorCampo('POT_C', 'Potencia Fase C', 'kW');
  this.potenciaTotChart = this.generarGraficoPorCampo('POT_TOT', 'Potencia Total', 'kW');

  // Frecuencia
  this.frecuenciaAChart = this.generarGraficoPorCampo('FHZ_A', 'Frecuencia Fase A', 'Hz');
  this.frecuenciaBChart = this.generarGraficoPorCampo('FHZ_B', 'Frecuencia Fase B', 'Hz');
  this.frecuenciaCChart = this.generarGraficoPorCampo('FHZ_C', 'Frecuencia Fase C', 'Hz');
  this.frecuenciaTotChart = this.generarGraficoPorCampo('FHZ_TOT', 'Frecuencia Total', 'Hz');

// 🔹 THD Corriente
this.thdCorrienteAChart = this.generarGraficoPorCampo('THD_COR_A', 'THD Corriente Fase A','');
this.thdCorrienteBChart = this.generarGraficoPorCampo('THD_COR_B', 'THD Corriente Fase B','');
this.thdCorrienteCChart = this.generarGraficoPorCampo('THD_COR_C', 'THD Corriente Fase C','');

// 🔹 THD Voltaje
this.thdVoltajeABChart = this.generarGraficoPorCampo('TH_DBA', 'THD Voltaje AB','');
this.thdVoltajeBCChart = this.generarGraficoPorCampo('TH_DBC', 'THD Voltaje BC','');
this.thdVoltajeCAChart = this.generarGraficoPorCampo('TH_DCA', 'THD Voltaje CA','');

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
  let categories: string[] = [];

  const voltajeSeries: ApexAxisChartSeries = [];
  const corrienteSeries: ApexAxisChartSeries = [];
  const potenciaSeries: ApexAxisChartSeries = [];

  for (const equipo of this.historicoData) {
    const nombre = this.plcList.find((p) => p.ip === equipo.ip)?.nombre?.replace(/^VARIADOR\s*-\s*/i, '').trim() || equipo.ip;

    const data = equipo.data;

    const voltaje = this.extraerFechasYValoresTodos(data, 'voltaje');
    const corriente = this.extraerFechasYValoresTodos(data, 'corriente');
    const potencia = this.extraerFechasYValoresTodos(data, 'potencia');

    // Usamos las fechas del primer equipo para las categorías del eje X
    if (categories.length === 0) {
      categories = voltaje.fechas;
    }

    voltajeSeries.push({ name: nombre, data: voltaje.valores });
    corrienteSeries.push({ name: nombre, data: corriente.valores });
    potenciaSeries.push({ name: nombre, data: potencia.valores });
  }

  this.voltajeChart = this.generarGraficoLineas('Voltaje (V)', categories, voltajeSeries, 'V');
  this.corrienteChart = this.generarGraficoLineas('Corriente (A)', categories, corrienteSeries, 'A');
  this.potenciaChart = this.generarGraficoLineas('Potencia (kW)', categories, potenciaSeries, 'kW');
}


generarGraficoLineas(
  titulo: string,
  categories: string[],
  series: ApexAxisChartSeries,
  unidad: string
): GraficoPromedio {
  return {
    chart: {
      type: 'line',
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
      },
      background: '#ffffff',
    },
    stroke: {
      width: 1.5,
      curve: 'smooth',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories,
      labels: {
        show: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      title: { text: titulo },
      labels: {
        formatter: (val: number) => `${val.toFixed(1)} ${unidad}`,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: { show: true },
      y: {
        formatter: (val: number) => `${val.toFixed(2)} ${unidad}`,
      },
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 2,
    },
    series,
  };
}






  private obtenerPuntosDeMuestra(data: number[], cantidad: number = 8): number[] {
  const n = data.length;
  if (n === 0) return new Array(cantidad).fill(0);
  if (n <= cantidad) return [...data]; // si ya tiene pocos

  const paso = Math.floor(n / cantidad);
  const resultado: number[] = [];

  for (let i = 0; i < cantidad; i++) {
    resultado.push(data[i * paso]);
  }
  return resultado;
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

  corrienteAChart: GraficoPromedio;
corrienteBChart: GraficoPromedio;
corrienteCChart: GraficoPromedio;
corrienteTotChart: GraficoPromedio;

voltajeABChart: GraficoPromedio;
voltajeBCChart: GraficoPromedio;
voltajeCACChart: GraficoPromedio;
voltajeTotChart: GraficoPromedio;

potenciaAChart: GraficoPromedio;
potenciaBChart: GraficoPromedio;
potenciaCChart: GraficoPromedio;
potenciaTotChart: GraficoPromedio;

frecuenciaAChart: GraficoPromedio;
frecuenciaBChart: GraficoPromedio;
frecuenciaCChart: GraficoPromedio;
frecuenciaTotChart: GraficoPromedio;

fpAChart: GraficoPromedio;
fpBChart: GraficoPromedio;
fpCChart: GraficoPromedio;
fpTotChart: GraficoPromedio;
 generarGraficoPorCampo(
  campo: string,
  titulo: string,
  unidad: string
): GraficoPromedio {
  let categories: string[] = [];
  const series: ApexAxisChartSeries = [];

  for (const equipo of this.historicoData) {
    const nombre =
      this.plcList.find((p) => p.ip === equipo.ip)?.nombre?.replace(/^PM\s*-\s*/i, '').trim() || equipo.ip;

    const { fechas, valores } = this.extraerFechasYValoresTodos(equipo.data, campo);

    if (categories.length === 0) {
      categories = fechas;
    }

    series.push({ name: nombre, data: valores });
  }

  return this.generarGraficoLineas(titulo, categories, series, unidad);
}

extraerFechasYValoresTodos(
  data: any[],
  campo: string
): { fechas: string[]; valores: number[] } {
  const fechas: string[] = [];
  const valores: number[] = [];

  for (const registro of data) {
    if (registro[campo] === undefined) continue;

    const fecha = new Date(registro.fecha);
    const label = `${fecha.getDate().toString().padStart(2, '0')}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, '0')} ${fecha.getHours().toString().padStart(2, '0')}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    fechas.push(label);
    valores.push(registro[campo]);
  }

  return { fechas, valores };
}

thdCorrienteAChart: GraficoPromedio;
thdCorrienteBChart: GraficoPromedio;
thdCorrienteCChart: GraficoPromedio;

thdVoltajeABChart: GraficoPromedio;
thdVoltajeBCChart: GraficoPromedio;
thdVoltajeCAChart: GraficoPromedio;


}
