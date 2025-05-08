import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/env';
import { CookiesService } from '../core/services/cookies.service';
import { EncriptadoService } from '../core/services/encriptacion-aes.service';
import { JWT, ROLES } from '../core/constants/local-store.constants';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl + '/auth';

  constructor(
    private readonly http: HttpClient,
    private readonly _coookiesService: CookiesService,
    private readonly _encriptadoService: EncriptadoService
  ) {}

  login(data: any) {
    const uri = `${this.API}/login`;
    return this.http.post<any>(uri, { ...data }).pipe(
      tap((response) => {
        if (response.accessToken) {
          this.setRoles(response.user.rol);
          this._coookiesService.almacenarCookie(JWT,       
            this._encriptadoService.encriptarInformacionCookie(response.accessToken)
           );
        }
      })
    );
  }

  setRoles(roles: string) {
    this._coookiesService.almacenarCookie(
      ROLES,
      this._encriptadoService.encriptarInformacionCookie(roles)
    );
  }

  hasRole(role: string): boolean {
    const rolesString = this._coookiesService.obtenerCookie(ROLES);
    const roles =
      this._encriptadoService.desencriptarInformacionCookie(rolesString);
    return roles.includes(role);
  }

  getRole(): string {
    const rolesString = this._coookiesService.obtenerCookie(ROLES);
    return this._encriptadoService.desencriptarInformacionCookie(rolesString);
  }
}
