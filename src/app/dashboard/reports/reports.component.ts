import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  arrayReportes = [
    {
      name:"Reporte general",
      type: "general",
      descripcion:"Reporte general de todos los controladores",
      image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/1200px-Microsoft_Excel_2013-2019_logo.svg.png",
    },
    {
      name:"Reporte de controladores",
      type: "controladores",
      descripcion:"Reporte de controladores",
      image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/1200px-Microsoft_Excel_2013-2019_logo.svg.png",
    },{
      name:"Reporte de sensores",
      type: "sensores",
      descripcion:"Reporte de sensores",
      image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/1200px-Microsoft_Excel_2013-2019_logo.svg.png",
    },
    {
      name:"Reporte de actuadores",
      type: "actuadores",
      descripcion:"Reporte de actuadores",
      image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/1200px-Microsoft_Excel_2013-2019_logo.svg.png",
    },
    {
      name:"Reporte de alarmas",
      type: "alarmas",
      descripcion:"Reporte de alarmas",
      image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/1200px-Microsoft_Excel_2013-2019_logo.svg.png",
    },{
      name:"Reporte de eventos",
      type: "eventos",
      descripcion:"Reporte de eventos",
      image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microsoft_Excel_2013-2019_logo.svg/1200px-Microsoft_Excel_2013-2019_logo.svg.png",
    }
  ];


}
