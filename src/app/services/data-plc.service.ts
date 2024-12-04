import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({
  providedIn: 'root',
})
export class DataPlcService {
  constructor(private readonly http: HttpClient) {}

  getData(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/plc-data`, data);
  }
  getHistorico(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/historico-plc`, data);
  }

  getIps() {
    return this.http.get<any>(`${environment.apiUrl}/ip-equipo`);
  }

  getListaEquipos() {
    return this.http.get<any>(`${environment.apiUrl}/lista-equipos`);
  }
}
