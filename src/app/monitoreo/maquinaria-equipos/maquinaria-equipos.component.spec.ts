import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinariaEquiposComponent } from './maquinaria-equipos.component';

describe('MaquinariaEquiposComponent', () => {
  let component: MaquinariaEquiposComponent;
  let fixture: ComponentFixture<MaquinariaEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaquinariaEquiposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaquinariaEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
