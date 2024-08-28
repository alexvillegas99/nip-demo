import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { DataPlcService } from '../../../../services/data-plc.service';
import { MENU_PORTAL } from '../../../../core/constants/local-store.constants';

@Component({
  selector: 'app-medidores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SearchComponent,
    SelectComponent,
  ],
  templateUrl: './medidores.component.html',
  styleUrl: './medidores.component.scss',
})
export class MedidoresComponent {

}
