import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { DataPlcService } from '../../../../services/data-plc.service';
import { MENU_PORTAL } from '../../../../core/constants/local-store.constants';

@Component({
  selector: 'app-medidores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SearchComponent,
    SelectComponent,
  ],
  templateUrl: './medidores.component.html',
  styleUrl: './medidores.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MedidoresComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _plcData = inject(DataPlcService);

  items = ['Current', 'Power', 'Voltage', 'Power Factor'];

  ip: string | null = null;
  fullUrl: string = '';
  plcInfo: any;
  plcMedidor!: any;

  ngOnInit(): void {
    this.fullUrl = window.location.href;

    // Extraer la IP usando una expresión regular
    const ipMatch = this.fullUrl.match(
      /instrumentacion-medidores\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/
    );
    if (ipMatch) {
      console.log(ipMatch[1]);
      this.ip = ipMatch[1];
      this.getDataMedidor();
      this.getPlcData();
    }
  }

  getDataMedidor() {
    this._plcData.getListaEquipos().subscribe({
      next: (resp) => {
        console.log(resp);
        this.plcMedidor = resp.find((plc: any) => plc.ip === this.ip);
      },
      error: (err) => {},
    });
  }

  getPlcData() {
    console.log(this.ip, 'Buscando por ip');
    this._plcData.getData({ ip: this.ip }).subscribe((data) => {
      console.log(data, 'data....');
      
      const arrMedidores = [];

      let arregloObjetos = Object.entries(
        data['1s Metering (50/60 Cycles)']
      ).map(([key, value]) => ({ name: key, arreglo: [value] }));

      arregloObjetos.map((obj: any) => {
        return Object.entries(obj).map(([key, value]) => ({
          label: key,
          valor: value,
        }));
      });

      arregloObjetos = arregloObjetos.map((item: any) => ({
        name: item.name,
        arreglo: item.arreglo.flatMap((obj: any) =>
          Object.entries(obj).map(([key, value]) => ({
            label: key,
            valor: value,
          }))
        ),
      }));

      for (let obj of this.items) {
        const existe = arregloObjetos.find((objB: any) => objB.name == obj);
        if (existe) {
          arrMedidores.push(existe);
        }
      }

      this.plcInfo = arrMedidores;
      console.log(this.plcInfo, 'info.....');
    });
  }
}
