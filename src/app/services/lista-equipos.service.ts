import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({ providedIn: 'root' })
export class ListaEquiposService {
  private readonly API = environment.apiUrl + '/lista-equipos';

  constructor(private readonly http: HttpClient) {}

  getDevices() {
    return this.http.get<any>(this.API);
  }

  createDevice(data: any) {
    return this.http.post<any>(this.API, data);
  }

  updateDevice(id: number, data: any) {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }

  createValor(data: any) {
    return this.http.post<any>(`${this.API}/create-valor`, data);
  }

  updateValor(id: number, data: any) {
    return this.http.put<any>(`${this.API}/register/${id}`, data);
  }
}
