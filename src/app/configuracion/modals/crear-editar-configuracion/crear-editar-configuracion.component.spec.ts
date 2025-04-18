import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarConfiguracionComponent } from './crear-editar-configuracion.component';

describe('CrearEditarConfiguracionComponent', () => {
  let component: CrearEditarConfiguracionComponent;
  let fixture: ComponentFixture<CrearEditarConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarConfiguracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEditarConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
