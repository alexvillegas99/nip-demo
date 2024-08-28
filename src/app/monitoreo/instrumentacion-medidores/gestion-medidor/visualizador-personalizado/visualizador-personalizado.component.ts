import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataPlcService } from '../../../../services/data-plc.service';
import { v4 as uuidv4 } from 'uuid';
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