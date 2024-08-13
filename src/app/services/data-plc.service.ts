import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({
  providedIn: 'root'
})
export class DataPlcService {

constructor(private readonly http:HttpClient) { }

getData(){
  return this.http.get<any>(`${environment.apiUrl}/plc-data`);
}
getDataUltimo(){
  return this.http.get<any>(`${environment.apiUrl}/plc-data/ultimo`);
}

}
