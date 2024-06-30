import { AfterViewInit, Component } from '@angular/core';
import Chart, { ScriptableLineSegmentContext } from 'chart.js/auto';
import { SocketService } from '../../services/socket.service';
import { DataPlcService } from '../../services/data-plc.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  constructor(
    //private readonly webSocketService: SocketService,
    private readonly dataPlcService: DataPlcService
  ) {}
  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  chart5: any;
  chart6: any;
  ngAfterViewInit() {
    this.createChart();
    this.createChart2();
    this.createChart3();
    this.createChart4();
    this.createChart5();
    this.createChart6();

    this.obtenerData();

    // this.webSocketService.connect();

    /*   this.webSocketService.receiveMessage('data_plc').subscribe((data: any) => {
      console.log(data);
    });  */
    /*   setInterval(() => {
      this.updateChartData1();
      this.updateChartData2();
      this.updateChartData3();
      this.updateChartData4();
    }, 5000); */
  }

  createChart6() {
    const ctx = document.getElementById('myChart6') as HTMLCanvasElement; // Afirmación de tipo
    this.chart6 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'voltaje',
            data: [],
            backgroundColor: [
             
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  createChart5() {
    const ctx = document.getElementById('myChart5') as HTMLCanvasElement; // Afirmación de tipo
    this.chart5 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'rpm',
            data: [],
            backgroundColor: [
             
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  mostrar = false;
  obtenerData() {
    const data = [
      {
        st_vdf: 5.39,
        potencia: 4.66,
        corriente: 5.04,
        temperatura: 5.84,
        voltaje: 4.96,
        rpm: 3.89,
        createdAt: '2024-04-13T01:33:55.930Z'
      },
      {
        st_vdf: 4.4,
        potencia: 4.71,
        corriente: 5.64,
        temperatura: 5.29,
        voltaje: 4.86,
        rpm: 4.88,
        createdAt: '2024-04-13T01:57:10.062Z'
      },
      {
        st_vdf: 5.79,
        potencia: 5.51,
        corriente: 4.67,
        temperatura: 4.29,
        voltaje: 4.42,
        rpm: 4.73,
        createdAt: '2024-04-13T02:20:08.739Z'
      },
      {
        st_vdf: 5.55,
        potencia: 5.28,
        corriente: 5.61,
        temperatura: 5.18,
        voltaje: 5.59,
        rpm: 5.39,
        createdAt: '2024-04-13T02:22:33.010Z'
      },
      {
        st_vdf: 5.47,
        potencia: 4.51,
        corriente: 6.32,
        temperatura: 5.52,
        voltaje: 4.89,
        rpm: 4.9,
        createdAt: '2024-04-13T02:24:53.215Z'
      },
      {
        st_vdf: 4.97,
        potencia: 5.6,
        corriente: 4.71,
        temperatura: 4.38,
        voltaje: 4.11,
        rpm: 4.92,
        createdAt: '2024-04-13T02:27:13.407Z'
      },
      {
        st_vdf: 5.22,
        potencia: 3.99,
        corriente: 5.25,
        temperatura: 4.42,
        voltaje: 4.44,
        rpm: 4.71,
        createdAt: '2024-04-13T02:29:33.607Z'
      },
      {
        st_vdf: 4.99,
        potencia: 6.09,
        corriente: 5.04,
        temperatura: 4.7,
        voltaje: 4.39,
        rpm: 5.15,
        createdAt: '2024-04-13T02:31:53.819Z'
      },
      {
        st_vdf: 4.14,
        potencia: 5.5,
        corriente: 4.86,
        temperatura: 5.73,
        voltaje: 4.5,
        rpm: 4.94,
        createdAt: '2024-04-13T03:22:47.070Z'
      },
      {
        st_vdf: 5.68,
        potencia: 3.36,
        corriente: 4.57,
        temperatura: 4.76,
        voltaje: 4.42,
        rpm: 4.23,
        createdAt: '2024-04-13T03:55:14.660Z'
      }
    ]
    this.formatearDatos(data);
    /* this.dataPlcService.getData().subscribe({
      next: (data) => {
        console.log(data);
        this.formatearDatos(data);
      },
      error: (error) => {
        console.error('Error-------------', error);
      },
    }); */
  }
  formatearDatos(data: any) {
    this.formatearDatosSTVF(data);
  }
  formatearDatosSTVF(data: any) {
    const st_vdf = [];
    const potencia = [];
    const corriente = [];
    const temperatura = [];
    const voltaje = [];
    const rpm = [];
    const fechas = [];

    // Función para convertir fecha en hora en formato de 12 horas
    function convertirAHoras(fecha: string) {
      let date = new Date(fecha);
      let horas: number = date.getHours();
      let minutos: any = date.getMinutes();
      let ampm: string = horas >= 12 ? 'PM' : 'AM';
      horas = horas % 12;
      horas = horas ? horas : 12; // Hora '0' es '12' en formato de 12 horas
      minutos = minutos < 10 ? '0' + minutos : minutos;
      return horas + ':' + minutos + ' ' + ampm;
    }
    
    // Función para verificar si hay diferentes días y convertir en día y hora
    function verificarDiferentesDias(fechas: string[]) {
      let resultado = [];
      let diaActual = null;
      let fechaActual = null;

      for (let i = 0; i < fechas.length; i++) {
        let fecha = new Date(fechas[i]);
        let dia = fecha.getDate();

     /*    if (dia !== diaActual) {
          diaActual = dia;
          fechaActual = fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
          console.log(fechaActual);
          resultado.push(fechaActual);
        } else { */
          resultado.push(convertirAHoras(fechas[i]));
    /*     } */
      }
      return resultado;
    }

    console.log(data);

    for (let i = 0; i < data.length; i++) {
      st_vdf.push(data[i].st_vdf);
      potencia.push(data[i].potencia);
      corriente.push(data[i].corriente);
      temperatura.push(data[i].temperatura);
      voltaje.push(data[i].voltaje);
      rpm.push(data[i].rpm);
      fechas.push(data[i].createdAt);
    }

    const fechasFormateadas = verificarDiferentesDias(fechas);

    this.chart1.data.datasets[0].data = st_vdf;
    this.chart1.data.labels = fechasFormateadas;

    this.chart2.data.datasets[0].data = potencia;
    this.chart2.data.labels = fechasFormateadas;

    this.chart3.data.datasets[0].data = corriente;
    this.chart3.data.labels = fechasFormateadas;

    this.chart4.data.datasets[0].data = temperatura;
    this.chart4.data.labels = fechasFormateadas;

    this.chart5.data.datasets[0].data = rpm;
    this.chart5.data.labels = fechasFormateadas;

    this.chart6.data.datasets[0].data = voltaje;
    this.chart6.data.labels = fechasFormateadas;


    this.chart1.update();
    this.chart2.update();
    this.chart3.update();
    this.chart4.update();
    this.chart5.update();
    this.chart6.update();
  }
  updateChartData1() {
    this.chart1.data.datasets[0].data = this.updateChartData();
    this.chart1.update();
  }
  updateChartData2() {
    this.chart2.data.datasets[0].data = this.updateChartData();
    this.chart2.update();
  }
  updateChartData3() {
    this.chart3.data.datasets[0].data = this.updateChartData();
    this.chart3.update();
  }
  updateChartData4() {
    this.chart4.data.datasets[0].data = this.updateChartData();
    this.chart4.update();
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement; // Afirmación de tipo
    this.chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'st_vdf',
            data: [],
            backgroundColor: [
             
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  createChart2() {
    const ctx = document.getElementById('myChart2') as HTMLCanvasElement;
    this.chart2 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'potencia',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
          
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  createChart3() {
    const ctx = document.getElementById('myChart3') as HTMLCanvasElement;
    this.chart3 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'corriente',
            data: [],
            backgroundColor: [
             
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  createChart4() {
    const ctx = document.getElementById('myChart4') as HTMLCanvasElement;
    this.chart4 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'temperatura',
            data: [],
            backgroundColor: [
              
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateChartData() {
    console.log('Actualizando data');
    const newData = [];
    for (let i = 0; i < 6; i++) {
      newData.push(Math.floor(Math.random() * 20)); // Generar datos aleatorios entre 0 y 20
    }

    return newData;
  }
}

