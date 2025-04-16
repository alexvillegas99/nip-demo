import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { DataPlcService } from '../../../../services/data-plc.service';
import { MENU_PORTAL } from '../../../../core/constants/local-store.constants';
import { SocketService } from '../../../../services/socket.service';
import { interval, Subscription } from 'rxjs';

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
export class MedidoresComponent implements OnInit , OnDestroy {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _plcData = inject(DataPlcService);
  private readonly _socketService = inject(SocketService);

  items = ['Current', 'Power', 'Voltage', 'Power Factor'];

  ip: string | null = null;
  fullUrl: string = '';
  plcInfo: any;
  plcMedidor!: any;
  data: any;
  private intervalSub!: Subscription;
  private plcDataSub!: Subscription;
  ngOnInit(): void {
    this.fullUrl = window.location.href;
    console.log(this.fullUrl, 'url completa');
    // Extraer la IP usando una expresión regular
    const ipMatch = this.fullUrl.match(
      /instrumentacion\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/
    );
    if (ipMatch) {
      console.log(ipMatch[1]);
      this.ip = ipMatch[1];
      this.getDataMedidor();
   

      const ip = this.ip!; // Cambia por la IP que necesitas consultar

    // Emitir solicitud cada 3 segundos
    this.intervalSub = interval(3000).subscribe(() => {
      this._socketService.sendFindPlcData(ip);
    });

    // Escuchar la respuesta del servidor 
    this.plcDataSub = this._socketService.receivePlcData().subscribe((data) => {
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

  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
    this.plcDataSub?.unsubscribe();
    console.log('🔌 Socket desconectado desde componente');
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

 
}
