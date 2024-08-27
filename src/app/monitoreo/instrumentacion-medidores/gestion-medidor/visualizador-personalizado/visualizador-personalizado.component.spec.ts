import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorPersonalizadoComponent } from './visualizador-personalizado.component';

describe('VisualizadorPersonalizadoComponent', () => {
  let component: VisualizadorPersonalizadoComponent;
  let fixture: ComponentFixture<VisualizadorPersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizadorPersonalizadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizadorPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
