import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMantenimientoComponent } from './gestion-mantenimiento.component';

describe('GestionMantenimientoComponent', () => {
  let component: GestionMantenimientoComponent;
  let fixture: ComponentFixture<GestionMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMantenimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
