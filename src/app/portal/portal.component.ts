import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuPrincipalComponent } from "../shared/menu-principal/menu-principal.component";

@Component({
    selector: 'app-portal',
    standalone: true,
    templateUrl: './portal.component.html',
    styleUrl: './portal.component.scss',
    imports: [RouterModule, MenuPrincipalComponent]
})
export class PortalComponent {

}
