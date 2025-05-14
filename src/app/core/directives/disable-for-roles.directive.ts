import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[appDisableForRoles]',
  standalone: true,
})
export class DisableForRolesDirective implements OnInit {
  @Input('appDisableForRoles') rolesPermitidos: string[] = [];
  @Input() appDisableForRolesPermisos: string[] = [];

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    const userRole = this.authService.getRole(); // string
    const userPermisos = this.authService.getPermisos(); // string[]

    const tieneRol = this.rolesPermitidos.includes(userRole);
    const tienePermiso = this.appDisableForRolesPermisos.every(p =>
      userPermisos.includes(p)
    );

    if (tieneRol && tienePermiso) {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    }
  }
}
