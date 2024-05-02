import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import Chart, { ScriptableLineSegmentContext } from 'chart.js/auto';


@Component({
  selector: 'app-demo1',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './demo1.component.html',
  styleUrl: './demo1.component.scss',
})
export class Demo1Component implements AfterViewInit, OnDestroy,OnInit {
  constructor() {

  }
  ngOnInit(): void {
    this.intervall1 = setInterval(() => {
      this.updateChart();
    }, 5000);
    this.intervall2 = setInterval(() => {
      this.hrs = Number((this.hrs + 0.01).toFixed(2));
    }, 1000);
    setTimeout(() => {
      this.createChart();
    }, 1000);
    
  }
  compresor = true;
  eventos = false;
  title: string = 'COMPRESOR XYZ';
  cambiarScreen(screen: any) {
    if (screen === 1) {
      this.compresor = true;
      this.eventos = false;
      this.title = 'COMPRESOR XYZ';
    } else if(screen === 2) {
      this.compresor = false;
      this.eventos = true;
      this.title = 'HISTORIAL DE EVENTOS';
    }
  }

  listaDeEventosCompresor = [
    {
      mensaje: 'Temperatura del compresor excesivamente alta',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
    {
      mensaje: 'Presión del compresor demasiado baja',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
    {
      mensaje: 'Altas RPM detectadas en el compresor',
      clase: 'alert alert-warning',
      icon: 'fa fa-exclamation-triangle',
      color: '#664d03',
    },
    {
      mensaje: 'Fuga de gas detectada en el compresor',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
    {
      mensaje: 'Bajo nivel de aceite en el compresor',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
    {
      mensaje: 'Vibraciones anormales en el compresor',
      clase: 'alert alert-warning',
      icon: 'fa fa-exclamation-triangle',
      color: '#664d03',
    },
    {
      mensaje: 'Fallo en el sistema de refrigeración',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
    {
      mensaje: 'Obstrucción en la entrada de aire del compresor',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
    {
      mensaje: 'Fallo en el sistema de control de presión',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
    {
      mensaje: 'Sobrecarga eléctrica en el compresor',
      clase: 'alert alert-danger',
      icon: 'fa fa-exclamation-triangle',
      color: 'red',
    },
  ];

  hrs: any = 1000.91;
  rpm: any = undefined ;
  kw: any = undefined ;
  temperatura: any = 30;
  intervall1: any;
  intervall2: any;
  ngOnDestroy(): void {
    // clearInterval(this.intervall1);
    //clearInterval(this.intervall2);
  }
  ngAfterViewInit(): void {
    
   
  }
  chart1: any;
  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement; // Afirmación de tipo
    this.chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          '17:48:20',
          '17:48:30',
          '17:48:40',
          '17:48:50',
          '17:48:00',
          '17:49:10',
        ],
        datasets: [
          {
            label: 'rpm',
            data: [1000, 1200, 1100, 1500, 2000, 1500, 1000, 1200, 1100, 1500],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
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
          {
            label: 'kW',
            data: [1100, 1000, 1500, 2000, 1500, 1000, 1200, 1100, 1500, 2000],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
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
        plugins: {
          title: {
            text: 'Central eléctrica',
            font: {
              size: 20,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    this.updateChart();
  }
  updateChart() {
    // Obtener la fecha y hora actual
    const currentDate = new Date();

    // Obtener la hora actual en formato HH:mm:ss
    const currentTime = currentDate.toTimeString().split(' ')[0];

    // Actualizar los datos y las etiquetas del gráfico
    this.chart1.data.labels.shift(); // Eliminar el primer elemento del array de etiquetas
    this.chart1.data.labels.push(currentTime); // Agregar la hora actual al final del array de etiquetas

    // Actualizar los datos de las series
    this.chart1.data.datasets.forEach((dataset: any) => {
      dataset.data.shift(); // Eliminar el primer elemento del array de datos de la serie
      // Generar un nuevo dato aleatorio en el rango de 1000 a 2000
      const newData = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
      dataset.data.push(newData); // Agregar el nuevo dato al final del array de datos de la serie
    });
    this.temperatura = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    this.rpm =
      this.chart1.data.datasets[0].data[
        this.chart1.data.datasets[0].data.length - 1
      ];
    this.kw =
      this.chart1.data.datasets[1].data[
        this.chart1.data.datasets[1].data.length - 1
      ];
    // Actualizar el gráfico
    this.chart1.update();
  }
}
