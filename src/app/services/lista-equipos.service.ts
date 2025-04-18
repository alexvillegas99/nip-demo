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
}
