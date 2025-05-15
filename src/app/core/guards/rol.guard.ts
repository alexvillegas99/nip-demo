import { inject, Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { CookiesService } from "../services/cookies.service";
import { EncriptadoService } from "../services/encriptacion-aes.service";
import { AuthService } from "../../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  private _cookiesService = inject(CookiesService);
  private _encriptadoService = inject(EncriptadoService);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  constructor() {}

  canActivate(
    route: ActivatedRouteSnapshot | any,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRoles = route.data.roles;

    let modulo: any = this._authService.getRole();
    console.log(expectedRoles, "modulos", modulo);
    
    const existRol = expectedRoles.includes(modulo);

    if (existRol) {
      return true;
    }

    // Mostrar un mensaje de alerta
    alert('No tienes los permisos necesarios para acceder a esta página.');

    // Navegar a la misma ruta actual para evitar el cambio de ruta
    this._router.navigate(['./menu']);
    return false;
  }
}
