import { Component, OnInit } from '@angular/core';
import { DataPlcService } from '../../services/data-plc.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrometroService } from '../../services/orometro.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HorometroService } from '../../services/horometro.service';

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
  buscarHorometro(): void {
    console.log(this.equipos)
    const ips = this.equipos.map((equipo: any) => equipo.ip);
    this.horometroService
      .obtenerPorFechas(ips)
      .subscribe({
        next: (data) => {
          console.log('✅ Datos agrupados por IP:', data);
          this.datosAgrupadosPorIp = data;
          this.calcularTotalPorIp(); // 👈 Aquí se llama
          console.log('Datos agrupados por IP:', this.datosAgrupadosPorIp);
        },
        error: (err) => console.error('❌ Error al obtener datos:', err),
      });
  }
  calcularTotalPorIp(): void {
    for (const ip in this.datosAgrupadosPorIp) {
      const registros = this.datosAgrupadosPorIp[ip];
      const totalMinutos = registros.reduce(
        (acc: number, reg: any) => acc + (reg.minutosEncendido || 0),
        0
      );
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      const totalHoras = `${horas}h ${minutos}min`;
      
      console.log(`🔧 IP: ${ip} | Minutos: ${totalMinutos} | Horas: ${totalHoras}`);
      this.datosAgrupadosPorIp[ip].totalHoras = totalHoras; // 👈 Aquí se agrega el total de horas al objeto
      this.equipos.forEach((equipo: any) => {
        if (equipo.ip === ip) {
          equipo.totalHoras = totalHoras; // 👈 Aquí se agrega el total de horas al objeto del equipo
        }
      })  ;
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



  
}
