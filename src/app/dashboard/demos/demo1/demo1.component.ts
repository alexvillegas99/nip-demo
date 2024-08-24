import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Chart, { ScriptableLineSegmentContext } from 'chart.js/auto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from '../../../services/toas.service';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import { DataPlcService } from '../../../services/data-plc.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-demo1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './demo1.component.html',
  styleUrl: './demo1.component.scss',
})
export class Demo1Component implements AfterViewInit, OnDestroy, OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly toastService: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private readonly socketService: SocketService
  ) {}
  tablaDeDatos: any;

  plcData: any;
  historicoPlcData: any;
  private dataSubscription: Subscription;
  private historicoSubscription: Subscription;
  private updateSubscription: Subscription;

 

  ngOnInit() {
    this.startPeriodicUpdates();
    this.dataSubscription = this.socketService.receivePlcData().subscribe(
      (data: any) => {
        console.log('Datos recibidos del servidor:', data);
        this.plcData = data;
      },
      (error) => {
        console.error('Error al recibir datos:', error);
      }
    );

    this.historicoSubscription = this.socketService.receiveHistoricoPlcData().subscribe(
      (data: any) => {
        console.log('Datos históricos recibidos del servidor:', data);
        this.historicoPlcData = data;
      },
      (error) => {
        console.error('Error al recibir datos históricos:', error);
      }
    );
  }

  startPeriodicUpdates() {
    this.updateSubscription = interval(10000).subscribe(() => {
      this.findPlcData();
      this.findHistoricoPlcData();
    });
  }

  findPlcData() {
    this.socketService.sendFindPlcData('192.168.100.80');
  }

  findHistoricoPlcData() {
    this.socketService.sendFindHistoricoPlcData('192.168.100.80', 10);
  }

  ngOnDestroy() {
    // Limpiar suscripciones para evitar fugas de memoria
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.historicoSubscription) {
      this.historicoSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    console.log('Suscripciones canceladas.');
  }
  compresor = true;
  eventos = false;
  title: string = 'COMPRESOR XYZ';
  cambiarScreen(screen: any) {
    if (screen === 1) {
      this.compresor = true;
      this.eventos = false;
      this.title = 'COMPRESOR XYZ';
    } else if (screen === 2) {
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
  rpm: any = undefined;
  kw: any = undefined;
  temperatura: any = 30;
  intervall1: any;
  intervall2: any;

  data: any;
  /*   getTablaDatos() {
    this.dataPlc.getDataUltimo().subscribe({
      next: (data) => {
        console.log(data);
       this.data = data;

  let path: string[] = [];
       this.extractValue(data,path);
        this.setupInterval();
      },
      error: (error) => {
        console.error(error);
        this.setupInterval();
      },
    });
  } */

  // En el componente TypeScript
  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  /*   setupInterval() {
    setTimeout(() => {
      this.getTablaDatos();
    }, 20000);
  } */
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  interval3: any;
  ngAfterViewInit(): void {
    /*    this.intervall1 = setInterval(() => {
      this.updateChart();
    }, 5000); */
    this.intervall2 = setInterval(() => {
      this.hrs = Number((this.hrs + 0.01).toFixed(2));
      this.cdr.detectChanges();
    }, 10000);

    //this.getTablaDatos();

    /*     setTimeout(() => {
     
    }, 1000); */
    this.createChart();
    this.createChart2();
    this.createChart3();
    this.createChart4();
    // this.actualizarGraficos();
  }

  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement; // Afirmación de tipo
    this.chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'rpm',
            data: [],
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
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'Potencia',
            data: [],
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',

              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',

              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
            pointRadius: 0,
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
  }
  /*  createChart() {
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
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
          },
          {
            label: 'kW',
            data: [1100, 1000, 1500, 2000, 1500, 1000, 1200, 1100, 1500, 2000],
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',

              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',

              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
            pointRadius: 0,
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
  } */
  createChart2() {
    const ctx = document.getElementById('myChart2') as HTMLCanvasElement; // Afirmación de tipo
    this.chart2 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'rpm',
            data: [],
            backgroundColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',

              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',

              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
            pointRadius: 0,
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
  }

  createChart3() {
    const ctx = document.getElementById('myChart3') as HTMLCanvasElement; // Afirmación de tipo
    this.chart3 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Voltaje',
            data: [],
            backgroundColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',

              'rgba(255, 159, 64, 1)',
            ],
            borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            pointRadius: 0,
            tension: 0.1,
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
  }
  createChart4() {
    const ctx = document.getElementById('myChart4') as HTMLCanvasElement; // Afirmación de tipo
    this.chart4 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temperatura',
            data: [],
            backgroundColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',

              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 0.1,
            pointRadius: 0,
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
  modalRef?: BsModalRef;
  closeModalPedidos() {
    this.modalRef?.hide();
    this.formPedidos.reset();
  }
  formPedidos = this.fb.group({
    usuario: ['Alex Villegas', Validators.required],
    proveedor: ['', Validators.required],
    observacion: ['', Validators.required],
    tipo: ['Compresor', Validators.required],
    producto: ['', Validators.required],
  });
  guardarPedido() {
    this.toastService.showSuccess(
      'Pedido creado',
      'El pedido ha sido creado correctamente'
    );
    this.closeModalPedidos();
  }
  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, this.configModal);
  }

  configModal = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-xl',
  };

  intervalId: any;

  extractValue(data: any, path: string[]): any {
    const a = path.reduce(
      (acc, key) => (acc && acc[key] ? acc[key] : null),
      data
    );
    console.log(a);
  }
}
