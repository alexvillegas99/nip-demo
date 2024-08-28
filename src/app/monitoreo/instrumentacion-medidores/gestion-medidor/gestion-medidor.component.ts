import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataPlcService } from '../../../services/data-plc.service';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { SelectComponent } from '../../../shared/components/select/select.component';

@Component({
  selector: 'app-gestion-medidor',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SearchComponent,
    SelectComponent,
  ],
  templateUrl: './gestion-medidor.component.html',
  styleUrl: './gestion-medidor.component.scss',
})
export class GestionMedidorComponent implements OnInit {
  constructor(
    private readonly dataPlc: DataPlcService,
    private readonly toastService: ToastrService
  ) {}
  ngOnInit(): void {
   this.getDataPlc();
  }

  screen1 = true;
  screen2 = false;
  screen3 = false;
  mantenimientoSeleccionado: any;
  getDataPlc() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        console.log('Data:', data);
       this.equipos = data;
       
        
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  

}
fechaActual = new Date();
  equipos:any = [];

  cambiarPantalla(screen: any) {
    if (screen === 1) {
      this.screen1 = true;
      this.screen2 = false;
      this.screen3 = false;
    } else if (screen === 2) {
      this.screen1 = false;
      this.screen2 = true;
      this.screen3 = false;
    } else if (screen === 3) {
      this.screen1 = false;
      this.screen2 = false;
      this.screen3 = true;
    }
  }


  seleccionarMantenimiento(data: any) {
    console.log(data);
    this.mantenimientoSeleccionado = data;
    this.cambiarPantalla(3);
  }
}
