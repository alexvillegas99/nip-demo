import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoEnergeticoComponent } from './consumo-energetico.component';

describe('ConsumoEnergeticoComponent', () => {
  let component: ConsumoEnergeticoComponent;
  let fixture: ComponentFixture<ConsumoEnergeticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoEnergeticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumoEnergeticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
