import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentacionMedidoresComponent } from './instrumentacion-medidores.component';

describe('InstrumentacionMedidoresComponent', () => {
  let component: InstrumentacionMedidoresComponent;
  let fixture: ComponentFixture<InstrumentacionMedidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentacionMedidoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstrumentacionMedidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
