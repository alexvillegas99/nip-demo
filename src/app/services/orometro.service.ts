import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../env/env";

@Injectable({ providedIn: 'root' })
export class OrometroService {
  private api = environment.apiUrl +'/orometro';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  getByIp(ip: string): Observable<any> {
    return this.http.get<any>(`${this.api}/ip/${ip}`);
  }

  create(data: Partial<any>): Observable<any> {
    return this.http.post<any>(this.api, data);
  }

  sumarTiempo(ip: string, segundos: number): Observable<any> {
    return this.http.patch<any>(`${this.api}/sumar-tiempo/${ip}`, { segundos });
  }

  update(ip: string, data: Partial<any>): Observable<any> {
    return this.http.patch<any>(`${this.api}/${ip}`, data);
  }
  


}
