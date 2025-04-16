import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataPlcService } from '../../../services/data-plc.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-variadores',
  standalone: true,
  imports: [
    CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
  ],
  templateUrl: './gestion-variadores.component.html',
  styleUrl: './gestion-variadores.component.scss'
})
export class GestionVariadoresComponent implements OnInit {
  screen1 = true;
  screen2 = false;
  screen3 = false;
  mantenimientoSeleccionado: any;

  fechaActual = new Date();
  equipos: any = [];

  constructor(
    private readonly dataPlc: DataPlcService
  ) {}
  
  ngOnInit(): void {
    this.getDataPlc();
  }

  getDataPlc() {
    this.dataPlc.getListaEquipos().subscribe({
      next: (data) => {
        console.log('Data:', data);
        this.equipos = data;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }



}
