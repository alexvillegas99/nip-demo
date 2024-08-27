import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { ToastrService } from '../../services/toas.service';
import { DataPlcService } from '../../services/data-plc.service';
import { firstValueFrom, Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private intervalId: any;
  chart1!: any;
  chart2!: any;
  chart3!: any;
  chart4!: any;

  constructor(
    private readonly toastService: ToastrService,
    private readonly dataPlc: DataPlcService
  ) {
    //this.getDataPLC();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Intervalo cancelado.');
    }
  }

  async getDataPLC() {
    try {
  /*     const data = await firstValueFrom(this.dataPlc.getData());
      return data; */
    } catch (error) {
      throw error; // Esto es opcional, dependiendo de si quieres manejar el error más arriba en la cadena de llamadas.
    }
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.createEnergyConsumptionChart();
    this.createPressureChart();
    this.createStatusChart();
    this.actualizarGraficos();
  }

  async actualizarGraficos() {
  /*   const data = await this.getDataPLC();
    // console.log(data, 'data dashboard...');

    const st_vdfArray = data.map((item: any) => item.st_vdf);
    const potenciaArray = data.map((item: any) => item.potencia);
    const corrienteArray = data.map((item: any) => item.corriente);
    const temperaturaArray = data.map((item: any) => item.temperatura);
    const voltajeArray = data.map((item: any) => item.voltaje);
    const rpmArray = data.map((item: any) => item.rpm);
    const createdAtArray = data.map(
      (item: any) =>
        item.createdAt.split('T')[0] +
        ' ' +
        item.createdAt.split('T')[1].split('.')[0]
    );
    console.log(temperaturaArray);

    //chart1
    this.chart1.data.labels = createdAtArray;

    this.chart1.data.datasets[0].data = temperaturaArray;

    //chart2
    const numeros = potenciaArray.map((cadena: any) => parseFloat(cadena));

    // Especificar los tipos para el acumulador y el valorActual
    const suma = numeros.reduce(
      (acumulador: number, valorActual: number) => acumulador + valorActual,
      0
    );

    const promedio = suma / numeros.length;
    console.log(promedio.toFixed(2));
    this.chart2.data.datasets[0].data = promedio.toFixed(2);
    // Actualizar el gráfico

    //chart4
    this.chart4.data.labels = createdAtArray;

    this.chart4.data.datasets[0].data = potenciaArray;

    this.chart1.update();
    this.chart2.update();
    this.chart4.update();
    this.intervalId = setInterval(async () => {
      this.actualizarGraficos();
    }, 10000); // Ejecutar cada 5 segundos */
  }

  /*   createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Compresor 1',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 0, // Tamaño de los puntos
            pointHoverRadius: 5, // Tamaño de los puntos al pasar el ratón
            fill: false, // No rellenar el área bajo la línea
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'Compresor 2',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'Compresor 3',
            data: [],
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'Compresor 4',
            data: [],
            borderColor: 'rgba(75, 12, 192, 1)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Temperatura de los compresores',
            font: {
              size: 20,
            },
          },
          legend: {
            display: true, // Mostrar leyenda
            position: 'bottom', // Posición de la leyenda
          },
          tooltip: {
            mode: 'index', // Modo de visualización
            intersect: false, // No mostrar tooltips en la intersección de puntos
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value',
            },
          },
        },
      },
    });

    // Agregar evento de clic al gráfico

    // Generar 8 valores iniciales
    for (let i = 0; i < 11; i++) {
      // Obtener la fecha actual del sistema
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString(); // Obtener la hora actual

      // Actualizar las etiquetas con la nueva hora
      this.chart1.data.labels.push(currentTime);

      // Generar nuevos valores de temperatura para cada compresor (solo para demostración)
      for (let j = 0; j < 4; j++) {
        const newTemperature = Math.floor(Math.random() * (40 - 30 + 1)) + 30; // Generar una temperatura aleatoria entre 30 y 40 grados
        this.chart1.data.datasets[j].data.push(newTemperature);
      }
    }

    // Función para actualizar el gráfico cada 5 segundos
    setInterval(() => {
      // Obtener la fecha actual del sistema
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString(); // Obtener la hora actual

      // Actualizar las etiquetas con la nueva hora
      this.chart1.data.labels.push(currentTime);

      // Generar nuevos valores de temperatura para cada compresor (solo para demostración)
      for (let i = 0; i < 4; i++) {
        const newTemperature = Math.floor(Math.random() * (40 - 30 + 1)) + 30; // Generar una temperatura aleatoria entre 30 y 40 grados
        this.chart1.data.datasets[i].data.push(newTemperature);
      }

      // Si hay más de 8 datos, eliminar el primer dato
      if (this.chart1.data.labels.length > 8) {
        this.chart1.data.labels.shift();
        for (let i = 0; i < 4; i++) {
          this.chart1.data.datasets[i].data.shift();
        }
      }

      // Actualizar el gráfico
      this.chart1.update();
    }, 5000); // Ejecutar cada 5 segundos
    this.chart1.canvas.addEventListener('click', (event: any) => {
      const bar = this.chart1.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      )[0];
      if (bar) {
        const dataIndex = bar.index;
        const datasetIndex = bar.datasetIndex;
        const label = this.chart1.data.datasets[datasetIndex].label;
        const value = this.chart1.data.datasets[datasetIndex].data[dataIndex];
        this.toastService.showInfo(`Click en: ${label} con el valor: ${value}`);
      }
    });
  } */

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Compresor 1',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 0, // Tamaño de los puntos
            pointHoverRadius: 5, // Tamaño de los puntos al pasar el ratón
            fill: false, // No rellenar el área bajo la línea
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Temperatura de los compresores',
            font: {
              size: 20,
            },
          },
          legend: {
            display: true, // Mostrar leyenda
            position: 'bottom', // Posición de la leyenda
          },
          tooltip: {
            mode: 'index', // Modo de visualización
            intersect: false, // No mostrar tooltips en la intersección de puntos
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
          },
        },
      },
    });

    this.chart1.canvas.addEventListener('click', (event: any) => {
      const bar = this.chart1.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      )[0];
      if (bar) {
        const dataIndex = bar.index;
        const datasetIndex = bar.datasetIndex;
        const label = this.chart1.data.datasets[datasetIndex].label;
        const value = this.chart1.data.datasets[datasetIndex].data[dataIndex];
        this.toastService.showInfo(`Click en: ${label} con el valor: ${value}`);
      }
    });
  }

  /*   createPressureChart() {
    const ctx = document.getElementById('myChart2') as HTMLCanvasElement;
    this.chart2 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Compresor 1', 'Compresor 2', 'Compresor 3', 'Compresor 4'],
        datasets: [
          {
            label: 'Presión (psi)',
            data: [110, 105, 115, 112],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 12, 192, 0.2)',
            ],
            borderColor: [
              '#E1B5BE',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 12, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },

      options: {
        plugins: {
          title: {
            display: true,
            text: 'Presión de los compresores',
            font: {
              size: 20,
            },
          },
          legend: {
            display: true, // Mostrar leyenda
            position: 'bottom', // Posición de la leyenda
          },
          tooltip: {
            mode: 'index', // Modo de visualización
            intersect: false, // No mostrar tooltips en la intersección de puntos
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });

    // Función para actualizar el gráfico cada 5 segundos
    setInterval(() => {
      const numbers = this.generateRandomNumbers(4, 80, 120);
      this.chart2.data.datasets[0].data = numbers;

      // Actualizar el gráfico
      this.chart2.update();
    }, 5000); // Ejecutar cada 5 segundos

    this.chart2.canvas.addEventListener('click', (event: any) => {
      const bar = this.chart2.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      )[0];
      if (bar) {
        const dataIndex = bar.index;
        const datasetIndex = bar.datasetIndex;
        const label = this.chart2.data.labels[dataIndex];
        const value = this.chart2.data.datasets[datasetIndex].data[dataIndex];
        this.toastService.showInfo(`Click en: ${label} con el valor: ${value}`);
      }
    });
  }
 */

  createPressureChart() {
    const ctx = document.getElementById('myChart2') as HTMLCanvasElement;
    this.chart2 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Compresor 1'],
        datasets: [
          {
            label: 'Presión (psi)',
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 12, 192, 0.2)',
            ],
            borderColor: [
              '#E1B5BE',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 12, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },

      options: {
        plugins: {
          title: {
            display: true,
            text: 'Presión de los compresores',
            font: {
              size: 20,
            },
          },
          legend: {
            display: true, // Mostrar leyenda
            position: 'bottom', // Posición de la leyenda
          },
          tooltip: {
            mode: 'index', // Modo de visualización
            intersect: false, // No mostrar tooltips en la intersección de puntos
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });

    this.chart2.canvas.addEventListener('click', (event: any) => {
      const bar = this.chart2.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      )[0];
      if (bar) {
        const dataIndex = bar.index;
        const datasetIndex = bar.datasetIndex;
        const label = this.chart2.data.labels[dataIndex];
        const value = this.chart2.data.datasets[datasetIndex].data[dataIndex];
        this.toastService.showInfo(`Click en: ${label} con el valor: ${value}`);
      }
    });
  }

  generateRandomNumbers(count: number, min: number, max: number): number[] {
    const randomNumbers: number[] = [];

    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      randomNumbers.push(randomNumber);
    }

    return randomNumbers;
  }

  createStatusChart() {
    const ctx = document.getElementById('myChart3') as HTMLCanvasElement;
    this.chart3 = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Normal', 'Advertencia', 'Fallo'],
        datasets: [
          {
            label: 'Estado del Compresor',
            data: [90, 7, 3],
            backgroundColor: [
              '#72FE7F',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              '#33FF46',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Historial de estados',
            font: {
              size: 20,
            },
          },
          legend: {
            display: true, // Mostrar leyenda
            position: 'bottom', // Posición de la leyenda
          },
          tooltip: {
            mode: 'index', // Modo de visualización
            intersect: false, // No mostrar tooltips en la intersección de puntos
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    this.chart3.canvas.addEventListener('click', (event: any) => {
      const bar = this.chart3.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      )[0];
      if (bar) {
        const dataIndex = bar.index;
        const datasetIndex = bar.datasetIndex;
        const label = this.chart3.data.labels[dataIndex];
        const value = this.chart3.data.datasets[datasetIndex].data[dataIndex];
        this.toastService.showInfo(`Click en: ${label} con el valor: ${value}`);
      }
    });
  }

  /*   createEnergyConsumptionChart() {
    const ctx = document.getElementById('myChart4') as HTMLCanvasElement;
    this.chart4 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Compresor 1',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 0, // Tamaño de los puntos
            pointHoverRadius: 5, // Tamaño de los puntos al pasar el ratón
            fill: false, // No rellenar el área bajo la línea
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'Compresor 2',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'Compresor 3',
            data: [],
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'Compresor 4',
            data: [],
            borderColor: 'rgba(75, 12, 192, 1)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Consumo de energía Kwh',
            font: {
              size: 20,
            },
          },
          legend: {
            display: true, // Mostrar leyenda
            position: 'bottom', // Posición de la leyenda
          },
          tooltip: {
            mode: 'index', // Modo de visualización
            intersect: false, // No mostrar tooltips en la intersección de puntos
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    // Generar 8 valores iniciales
    for (let i = 0; i < 10; i++) {
      // Obtener la fecha actual del sistema
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString(); // Obtener la hora actual

      // Actualizar las etiquetas con la nueva hora
      this.chart4.data.labels.push(currentTime);

      // Generar nuevos valores de temperatura para cada compresor (solo para demostración)
      for (let j = 0; j < 4; j++) {
        const newConsumo = Math.floor(Math.random() * (150 - 50 + 1)) + 50; // Generar un consumo aleatorio entre 50 y 150 kWh

        this.chart4.data.datasets[j].data.push(newConsumo);
      }
    }

    // Función para actualizar el gráfico cada 5 segundos
    setInterval(() => {
      // Obtener la fecha actual del sistema
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString(); // Obtener la hora actual

      this.chart4.data.labels.push(currentTime);

      for (let i = 0; i < 4; i++) {
        const newConsumo = Math.floor(Math.random() * (150 - 50 + 1)) + 50; // Generar un consumo aleatorio entre 50 y 150 kWh

        this.chart4.data.datasets[i].data.push(newConsumo);
      }

      // Si hay más de 8 datos, eliminar el primer dato
      if (this.chart4.data.labels.length > 8) {
        this.chart4.data.labels.shift();
        for (let i = 0; i < 4; i++) {
          this.chart4.data.datasets[i].data.shift();
        }
      }

      // Actualizar el gráfico
      this.chart4.update();
    }, 5000); // Ejecutar cada 5 segundos

    this.chart4.canvas.addEventListener('click', (event: any) => {
      const bar = this.chart4.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      )[0];
      if (bar) {
        const dataIndex = bar.index;
        const datasetIndex = bar.datasetIndex;
        const label = this.chart4.data.datasets[datasetIndex].label;
        const value = this.chart4.data.datasets[datasetIndex].data[dataIndex];
        this.toastService.showInfo(`Click en: ${label} con el valor: ${value}`);
      }
    });
  } */

  createEnergyConsumptionChart() {
    const ctx = document.getElementById('myChart4') as HTMLCanvasElement;
    
    this.chart4 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Compresor 1',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 0, // Tamaño de los puntos
            pointHoverRadius: 5, // Tamaño de los puntos al pasar el ratón
            fill: false, // No rellenar el área bajo la línea
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Potencia de los compresores',
            font: {
              size: 20,
            },
          },
          legend: {
            display: true, // Mostrar leyenda
            position: 'bottom', // Posición de la leyenda
          },
          tooltip: {
            mode: 'index', // Modo de visualización
            intersect: false, // No mostrar tooltips en la intersección de puntos
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });

    this.chart4.canvas.addEventListener('click', (event: any) => {
      const bar = this.chart4.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      )[0];
      if (bar) {
        const dataIndex = bar.index;
        const datasetIndex = bar.datasetIndex;
        const label = this.chart4.data.datasets[datasetIndex].label;
        const value = this.chart4.data.datasets[datasetIndex].data[dataIndex];
        this.toastService.showInfo(`Click en: ${label} con el valor: ${value}`);
      }
    });
  }
}
