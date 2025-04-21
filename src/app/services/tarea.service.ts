import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private readonly API = environment.apiUrl + '/tareas';

  constructor(private readonly http: HttpClient) {}

  getTask() {
    return this.http.get<any>(this.API);
  }

  getSubtask(id: string) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  createTask(data: any) {
    console.log(data, '-data a cre');
    return this.http.post<any>(this.API, data);
  }

  updateTask(id: number, data: any) {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }

  updateSubtask(id: number, data: any) {
    return this.http.put<any>(`${this.API}/subtask/${id}`, data);
  }

  deleteTask(id: string) {
    return this.http.delete<any>(`${this.API}/${id}`);
  }
}
