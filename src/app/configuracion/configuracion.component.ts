import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaEquiposService } from '../services/lista-equipos.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertService } from '../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent {

}
