import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataPlcService } from '../../../services/data-plc.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-gestion-medidor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './gestion-medidor.component.html',
  styleUrl: './gestion-medidor.component.scss',
})
export class GestionMedidorComponent implements OnInit {
  navegar(item: any) {
    console.log(item);
    console.log(this.id);
    if (!this.id || !item) return;
  
    const ruta =
      this.id === 'variadores'
        ? ['/monitoreo/instrumentacion', item, 'pantalla-variadores','variador']
        : ['/monitoreo/instrumentacion', item, 'pantalla-medidores'];
    console.log(ruta);
    this.router.navigate(ruta);
  }
  
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
    private readonly socketService: SocketService
  ) {}
  id: string | null = null;
  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      const lastSegment = segments[segments.length - 1]?.path;
      console.log('Ruta detectada:', lastSegment);
  
      this.id = lastSegment;
  
      if (this.id !== 'variadores' && this.id !== 'medidores') {
        this.toastService.error('No se encontró el id de la url');
        this.router.navigate(['/portal/home']);
      } else {
        this.getDataPlc(); // 👈 volver a cargar los datos
      }
    });
  }
  

  getDataPlc() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
  
        if (this.id === 'variadores') {
          this.equipos = this.equipos.filter((item: any) => item.tipo === 'variador');
        }
  
        if (this.id === 'medidores') {
          this.equipos = this.equipos.filter((item: any) => item.tipo === 'pm');
        }
  
        // Enviar solicitud al socket y escuchar
        this.socketService.sendFindPlcDataAll();
        this.socketService.receivePlcDataAll().subscribe((plcData: any[]) => {
          this.equipos = this.equipos.map((equipo:any) => {
            const plc = plcData.find((p) => p.IP === equipo.ip);
            if (equipo.tipo === 'variador' && plc) {
              equipo.estado = plc.RUN === 1 ? 'RUN' : plc.FLT === 1 ? 'FALLA' : 'READY';
            } else {
              equipo.estado = 'SIN DATOS';
            }
            return equipo;
          });
        });
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
  


}
