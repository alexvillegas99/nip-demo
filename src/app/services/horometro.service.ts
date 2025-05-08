import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({ providedIn: 'root' })
export class HorometroService {
  private readonly api = environment.apiUrl + '/orometro';

  constructor(private http: HttpClient) {}

  obtenerPorFechas(ips: string[], fechaInicio: any, fechaFin: any) {
    return this.http.post<any>(`${this.api}/por-fechas`, {
      ips,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    });
  }

  restablecerHorometro(ip: string) {
    return this.http.post<any>(`${this.api}/crear-historial`, {
      ip,
    });
  }

  obtenerHistorial(ips: string[]) {
    return this.http.post<any>(`${this.api}/obtner-historial`, {
      ips,
    });
  }
}
