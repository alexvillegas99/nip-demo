import { Component, OnInit } from '@angular/core';
import { DataPlcService } from '../../services/data-plc.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrometroService } from '../../services/orometro.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HorometroService } from '../../services/horometro.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-orometro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orometro.component.html',
  styleUrl: './orometro.component.scss',
})
export class OrometroComponent implements OnInit {
  screen1 = true;
  screen2 = false;
  screen3 = false;
  mantenimientoSeleccionado: any;

  equipos: any = [];

  constructor(
    private readonly dataPlc: DataPlcService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    private readonly route: ActivatedRoute, // 👈 nuevo
    private horometroService: HorometroService
  ) {}
  id: string | null = null;
  ngOnInit(): void {
    this.getDataPlc(); // 👈 volver a cargar los datos
  }
  datosAgrupadosPorIp: any = [];
  // por defecto las fechas son del día actual
  fechaActual: Date = new Date();
  fechaInicio: Date = new Date(
    this.fechaActual.getTime() - 24 * 60 * 60 * 1000
  ); // hace 24 horas
  fechaFin: Date = new Date(this.fechaActual.getTime() + 24 * 60 * 60 * 1000); // dentro de 24 horas
  historialHorometros: any;
  buscarHorometro(): void {
    const ips = this.equipos.map((equipo: any) => equipo.ip);

    forkJoin({
      datosPorFecha: this.horometroService.obtenerPorFechas(
        ips,
        this.fechaInicio,
        this.fechaFin
      ),
      historial: this.horometroService.obtenerHistorial(ips),
    }).subscribe({
      next: ({ datosPorFecha, historial }) => {
        console.log('✅ Datos por fecha:', datosPorFecha);
        console.log('📊 Historial:', historial);

        this.datosAgrupadosPorIp = datosPorFecha;
        this.historialHorometros = historial;

        this.calcularTotalPorIp(); // Mantienes tu lógica actual
      },
      error: (err) => console.error('❌ Error al obtener datos:', err),
    });
  }
  calcularTotalPorIp(): void {
    for (const ip in this.datosAgrupadosPorIp) {
      const registros = this.datosAgrupadosPorIp[ip];

      const minutosActuales = registros.reduce(
        (acc: number, reg: any) => acc + (reg.minutosEncendido || 0),
        0
      );

      const historial = this.historialHorometros[ip] || [];
      const minutosHistorial = historial.reduce(
        (acc: number, reg: any) => acc + (reg.minutosEncendido || 0),
        0
      );

      const totalMinutos = minutosActuales + minutosHistorial;

      const horas = Math.floor(minutosActuales / 60);
      const minutos = minutosActuales % 60;
      const formatoActual = `${horas}h ${minutos}min`;

      const horasSuma = Math.floor(totalMinutos / 60);
      const minutosSuma = totalMinutos % 60;
      const formatoSuma = `${horasSuma}h ${minutosSuma}min`;

      console.log(
        `🔧 IP: ${ip} | Actual: ${formatoActual} | Total Suma: ${formatoSuma}`
      );

      // Guardar en datos agrupados
      this.datosAgrupadosPorIp[ip].totalHoras = formatoActual;
      this.datosAgrupadosPorIp[ip].totalHorasSuma = formatoSuma;

      // Guardar también en la lista de equipos
      this.equipos.forEach((equipo: any) => {
        if (equipo.ip === ip) {
          equipo.totalHoras = formatoActual;
          equipo.totalHorasSuma = formatoSuma;
        }
      });
    }
  }

  getDataPlc() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        console.log('Data:', data);
        this.equipos = data;

        this.equipos = this.equipos.filter(
          (item: any) => item.tipo === 'variador'
        );
        this.buscarHorometro();
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  screenOrometro: boolean = false;

  selectedEquipo: any = null;
  orometro: any | null = null;

  reiniciarHorometro(equipo: any) {
    this.selectedEquipo = equipo;
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea reiniciar el horómetro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.horometroService
          .restablecerHorometro(equipo.ip)
          .subscribe((res) => {
            console.log('Respuesta:', res);
            this.toastService.success(
              `Horómetro de ${equipo.nombre} reiniciado correctamente.`,
              'Éxito'
            );
            this.buscarHorometro();
          });
      }
    });
  }
}
