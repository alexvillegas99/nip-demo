import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly API =  environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(rol?: string, estado?: string) {
    const params: any = {};
    if (rol && rol !== 'todos') params.rol = rol;
    if (estado && estado !== 'todos') params.estado = estado;
    return this.http.get<any>(this.API, { params });
  }

  createUsuario(data: any) {
    return this.http.post(this.API, data);
  }

  updateUsuario(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  setEstadoUsuario(id: string, estado: boolean) {
    return this.http.put(`${this.API}/${id}/estado/${estado}`, {});
  }
}
