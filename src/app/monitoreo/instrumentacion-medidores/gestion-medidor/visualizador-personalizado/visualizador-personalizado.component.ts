import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataPlcService } from '../../../../services/data-plc.service';

@Component({
  selector: 'app-visualizador-personalizado',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './visualizador-personalizado.component.html',
  styleUrl: './visualizador-personalizado.component.scss'
})
export class VisualizadorPersonalizadoComponent implements OnInit {
  ip: string | null = null;
  fullUrl: string = '';

  constructor(private route: ActivatedRoute,private readonly plcData:DataPlcService) {}

  ngOnInit(): void {
    // Obtener la URL completa
    this.fullUrl = window.location.href;

    // Extraer la IP usando una expresión regular
    const ipMatch = this.fullUrl.match(/instrumentacion-medidores\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
    if (ipMatch) {
      console.log(ipMatch[1]);
      this.ip = ipMatch[1];
      this.getPlcData();
    }





  }

plcInfo: any ;
  getPlcData(){
    console.log(this.ip,'Buscando por ip');
    this.plcData.getData({ip:this.ip}).subscribe(data => {
      console.log(data);
      this.plcInfo =data;
    });
  }
  getOrderedList(obj: any, parentKey: string = ''): { key: string, value: any }[] {
    const result = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result.push(...this.getOrderedList(obj[key], `${parentKey}${key}.`));
      } else {
        result.push({ key: `${parentKey}${key}`, value: obj[key] });
      }
    }
    return result.sort((a, b) => a.key.localeCompare(b.key));
  }
  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  } 
}