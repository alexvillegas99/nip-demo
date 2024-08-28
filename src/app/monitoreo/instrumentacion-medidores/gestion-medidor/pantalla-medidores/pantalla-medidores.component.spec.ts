import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaMedidoresComponent } from './pantalla-medidores.component';

describe('PantallaMedidoresComponent', () => {
  let component: PantallaMedidoresComponent;
  let fixture: ComponentFixture<PantallaMedidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaMedidoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PantallaMedidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
