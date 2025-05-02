import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({ providedIn: 'root' })
export class HorometroService {
  private readonly api = environment.apiUrl + '/orometro';

  constructor(private http: HttpClient) {}

  obtenerPorFechas(ips: string[], dias: number = 5) {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - dias);

    return this.http.post<any>(`${this.api}/por-fechas`, {
      ips,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
    });
  }
}
