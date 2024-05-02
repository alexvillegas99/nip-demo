import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoIndustrialComponent } from './equipo-industrial.component';

describe('EquipoIndustrialComponent', () => {
  let component: EquipoIndustrialComponent;
  let fixture: ComponentFixture<EquipoIndustrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipoIndustrialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipoIndustrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
