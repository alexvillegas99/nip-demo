import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataPlcService } from '../../../../services/data-plc.service';
import { v4 as uuidv4 } from 'uuid';
import { NgxGaugeModule } from 'ngx-gauge';
@Component({
  selector: 'app-visualizador-personalizado',
  standalone: true,
  imports: [CommonModule,NgxGaugeModule ],
  templateUrl: './visualizador-personalizado.component.html',
  styleUrl: './visualizador-personalizado.component.scss'
})
export class VisualizadorPersonalizadoComponent implements OnInit {
cambiarValorMedidor(_t26: any) {
  if (isNaN(_t26.valor)) {
    return;
  }
this.gaugeValue = _t26.valor;
if(this.gaugeValue <100){
  this.min = 0;
  this.max = 100;
}else{
  this.min = 0;
  this.max = _t26.valor+100;
}
console.log(this.max)
this.actualizarMarkerConfig();
this.label = _t26.campo;
}
actualizarMarkerConfig() {
  const data: { [key: number]: { color: string; type: string; size: number } } = {};

  // Función para generar un color hexadecimal aleatorio
  function generarColorAleatorio(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  for (let i = this.min; i <= this.max; i += 10) {
    data[i] = {
      color: i === this.max ? '#ff0000' : generarColorAleatorio(),
      type: 'line',
      size: 10
    };
  }

  console.log(data);
  this.markerConfig = data;
}

  ip: string | null = null;
  fullUrl: string = '';
  label: string = 'Medidor';
  append: string = '';
  min=0;
  max=100;

  constructor(private route: ActivatedRoute,private readonly plcData:DataPlcService) {}
  titulo: string = 'Visualizador Personalizado';
  gaugeValue =0;
  markerConfig:any = {
    '0': {color: 'black', type: 'line', size: 10},
    '10': {color: 'black', type: 'line', size: 10},
    '20': {color: 'black', type: 'line', size: 10},
    '30': {color: 'black', type: 'line', size: 10},
    '40': {color: 'black', type: 'line', size: 10},
    '50': {color: 'black', type: 'line', size: 10},
    '60': {color: 'black', type: 'line', size: 10},
    '70': {color: 'black', type: 'line', size: 10},
    '80': {color: 'black', type: 'line', size: 10},
    '90': {color: 'black', type: 'line', size: 10},
    '100': {color: 'black', type: 'line', size: 10}
  };
  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'green'},
    '75': {color: 'green'}
  };
  ngOnInit(): void {
    // Obtener la URL completa
    this.fullUrl = window.location.href;
    console.log(this.markerConfig);
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
      
      this.plcInfo =this.mapJsonToStructure(data);
      console.log(  this.plcInfo);
    });
  }
  objectKeys = Object.keys;

  mapJsonToStructure(json: any): any[] {
    const result = [];

    // Recorrer las categorías principales
    for (const [categoryKey, categoryValue] of Object.entries(json)) {
      if (categoryKey === '_id' || categoryKey === 'IP') {
        continue; // Omitir la categoría "_id"
      }
      const category:any = {
        categoria: categoryKey,
        valores: []
      };

      // Recorrer las subcategorías dentro de cada categoría
      for (const [subCategoryKey, subCategoryValue] of Object.entries(categoryValue as object)) {
        const subCategory:any = {
          subcategoria: subCategoryKey,
          valores: []
        };

        // Recorrer los campos dentro de cada subcategoría
        for (const [fieldKey, fieldValue] of Object.entries(subCategoryValue as object)) {
          subCategory.valores.push({
            campo: fieldKey,
            valor: fieldValue
          });
        }

        category.valores.push(subCategory);
      }

      result.push(category);
    }

    return result;
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
    return typeof value === 'object' && value !== null;
  }

  sanitizeId(key: string): string {
    return key.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
  }
  getSections(data: any): { name: string, data: any }[] {
    return Object.keys(data).map(key => ({
      name: key,
      data: data[key]
    }));
  }
  
  getItems(data: any): { key: string, value: any }[] {
    return Object.keys(data).map(key => ({
      key: key,
      value: data[key]
    }));
  }
  getUUID(): string {
    return uuidv4();
  }
  generateUniqueId(base: string, prefix: string = '', suffix: string = ''): string {
    return `${prefix}${base.replace(/\s+/g, '-') // Reemplaza espacios con guiones
                .replace(/[^a-zA-Z0-9\-]/g, '')}${suffix}`;
  }

}