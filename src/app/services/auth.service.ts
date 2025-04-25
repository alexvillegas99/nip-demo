import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl + '/auth';

  constructor(private readonly http: HttpClient) {}

  login(data: any) {
    const uri = `${this.API}/login`;
    return this.http.post<any>(uri, { ...data });
  }
}
