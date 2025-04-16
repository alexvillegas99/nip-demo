import { Component, OnInit } from '@angular/core';
import { DataPlcService } from '../../services/data-plc.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrometroService } from '../../services/orometro.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

  fechaActual = new Date();
  equipos: any = [];

  constructor(
    private readonly dataPlc: DataPlcService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    private readonly route: ActivatedRoute, // 👈 nuevo
    private orometroService: OrometroService
  ) {}
  id: string | null = null;
  ngOnInit(): void {
    this.getDataPlc(); // 👈 volver a cargar los datos
  }

  getDataPlc() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        console.log('Data:', data);
        this.equipos = data;

        this.equipos = this.equipos.filter(
          (item: any) => item.tipo === 'variador'
        );
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  screenOrometro: boolean = false;

  selectedEquipo: any = null;
  orometro: any | null = null;

  navegar(ip: string) {
    this.screen1 = false;
    this.screenOrometro = true;

    this.selectedEquipo = this.equipos.find((e: any) => e.ip === ip);

    this.orometroService.getByIp(ip).subscribe({
      next: (data) => {
        this.orometro = data;
        console.log('Orometro:', this.orometro);
        if(this.orometro){

       
        this.orometroData = {
          tiempoTotalSegundos: data.tiempoTotalSegundos,
          proximoMantenimiento: data.proximoMantenimiento?.substring(0, 10), // para input date
          tareaProgramada: data.tareaProgramada,
        };
      }else{
        this.orometroData = {
          tiempoTotalSegundos: 0,
          proximoMantenimiento: '',
          tareaProgramada: '',
        };
      }
      },
      error: () => {
        console.log('No se encontró orómetro para este equipo');
        this.orometro = null;
        this.orometroData = {
          tiempoTotalSegundos: 0,
          proximoMantenimiento: '',
          tareaProgramada: '',
        };
      },
    });
    
  }
  orometroData = {
    tiempoTotalSegundos: 0,
    proximoMantenimiento: '',
    tareaProgramada: '',
  };

  guardarOrometro() {
    const ip = this.selectedEquipo.ip;
  
    if (this.orometro) {
      this.orometroService.update(ip, this.orometroData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'El orómetro fue actualizado correctamente.',
          confirmButtonColor: '#007bff',
        });
      });
    } else {
      this.orometroService
        .create({ ip, ...this.orometroData })
        .subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: '¡Creado!',
            text: 'El orómetro fue creado exitosamente.',
            confirmButtonColor: '#007bff',
          });
        });
    }
  }
  
}
