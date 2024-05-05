import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-alarmas',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './alarmas.component.html',
  styleUrl: './alarmas.component.scss',
})
export class AlarmasComponent implements OnInit {
filtrar() {
  const estado = this.filterForm.controls.estado.value;
  console.log(estado)

  if(estado==="" || estado==="3"){
    this.valoresCopia = this.valores;
    return;
  }

  if(estado==="1"){
    this.valoresCopia=this.valores.filter((x:any)=>x.estado==="Atendido");
  }else if(estado==="2"){
    this.valoresCopia=this.valores.filter((x:any)=>x.estado==="Pendiente");
  }


}
  constructor(private readonly fb:FormBuilder){

  }
  ngOnInit(): void {
    this.valoresCopia=this.valores;
  }
   filterForm= this.fb.group(
    {
      evento:[''],
      estado: [''],
     
    }
  )
  ngAfterViewInit() {}
  headers = [
    'Código',
    'Tiempo detección',
    'Condición',
    'Evento',
    'Estado',
    'Valor',
    'Usuario',
    'Aplazamiento',
    'Reconocimiento',
  ];
valoresCopia:any;
valores = [
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Se a detectado una caida de presion critica',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '601',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Pendiente',
      valor: '20',
      usuario: 'Usuario 1',
    },
    {
      codigo: '600',
      tiempo: '10/01/2022 10:00',
      condicion: 'Temperatura',
      evento: 'Temperatura alta',
      estado: 'Atendido',
      valor: '20',
      usuario: 'Usuario 1',
    },
  ];

  estadoAlarma = [
    {
      nombre: 'Atentida',
      code: 1,
    },
    {
      nombre: 'Pendientes',
      code: 2,
    },
    {
      nombre: 'Todas',
      code: 3,
    },
  ];

  eventos=[
    {
      nombre:"Se a detectado una caida de presion critica"
    },
    {
      nombre:"Temperatura alta"
    }
  ]
}
