import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookiesService } from '../services/cookies.service';
import { EncriptadoService } from '../services/encriptacion-aes.service';
import { JWT } from '../constants/local-store.constants';

const helper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class EstaLogeadoGuard implements CanActivate {
  constructor(
    private readonly _cookiesService: CookiesService,
    private readonly _router: Router,
    private readonly _encriptadoService: EncriptadoService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const accessTokenString = this._cookiesService.obtenerCookie(JWT);
    if (accessTokenString) {
      const accessToken =
        this._encriptadoService.desencriptarInformacionCookie(
          accessTokenString
        );
      const isExpired = helper.isTokenExpired(accessToken);
      if (!isExpired) {
        return true;
      } else {
        this._cookiesService.eliminarCookieCierreFlujo();
        return false;
      }
    } else {
      this._router.navigate(['/']).then();
      return false;
    }
  }
}
