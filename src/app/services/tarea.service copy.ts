import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly API = environment.apiUrl + '/perfil';

  constructor(private readonly http: HttpClient) {}

  getPerfil() {
    return this.http.get<any>(this.API);
  }

  getPermiso(id: string) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  createPerfil(data: any) {
    console.log(data, '-data a cre');
    return this.http.post<any>(this.API, data);
  }

  updatePerfil(id: number, data: any) {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }

  updatePermiso(id: number, data: any) {
    return this.http.put<any>(`${this.API}/subtask/${id}`, data);
  }

  deletePerfil(id: string) {
    return this.http.delete<any>(`${this.API}/${id}`);
  }
}
