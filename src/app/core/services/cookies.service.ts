import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class CookiesService {
  constructor(private readonly _cookieService: CookieService) {}

  /** OBTENER COOKIE DATA JSON */
  obtenerCookieJson<Type>(key: string): Type | undefined {
    if (!this._cookieService.get(key)) {
      return undefined;
    } else {
      return JSON.parse(this._cookieService.get(key)) as Type;
    }
  }

  /** OBTENER COOKIE DATA STRING */
  obtenerCookie(key: string) {
    return this._cookieService.get(key);
  }

  /** ALMACENAR COOKIE DATA STRING */
  almacenarCookie(key: string, value: string | number | Object) {
    if (typeof value === 'string') {
      this._cookieService.set(key, value);
    } else {
      this._cookieService.set(key, JSON.stringify(value), {
        secure: true,
        sameSite: 'None',
      });
    }
  }

  /** ELIMINAR UN VALOR DE COOKIE */
  eliminarCookie(key: string) {
    this._cookieService.delete(key);
  }

  /** ELIMINAR TODOS LOS VALORES DE COOKIE */
  eliminarTodasCookies() {
    this._cookieService.deleteAll();
  }

  /** ELIMINAR COOKIE POR EXPIRACION DE TIEMPO */
  eliminarCookieCierreFlujo() {
    // this._cookieService.delete(COOKIE_JWT_TOKEN);
  }

  /** ALMACENAR EN SESION STORAGE UN VALOR */
  guardarSesionStorage(nombre: string, valor: any) {
    sessionStorage.setItem(nombre, valor);
  }

  /** OBTENER VALOR DE SESION STORAGE */
  obtenerSessionStorage(nombre: string) {
    return sessionStorage.getItem(nombre);
  }
}
