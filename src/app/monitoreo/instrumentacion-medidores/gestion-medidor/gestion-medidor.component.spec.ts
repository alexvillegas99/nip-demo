import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMedidorComponent } from './gestion-medidor.component';

describe('GestionMedidorComponent', () => {
  let component: GestionMedidorComponent;
  let fixture: ComponentFixture<GestionMedidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMedidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionMedidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
