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
    console.log(data, '-data a cre');
    return this.http.post<any>(this.API, data);
  }

  updateDevice(id: number, data: any) {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }
}
