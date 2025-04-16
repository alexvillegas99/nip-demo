import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentacionVariadoresComponent } from './instrumentacion-variadores.component';

describe('InstrumentacionVariadoresComponent', () => {
  let component: InstrumentacionVariadoresComponent;
  let fixture: ComponentFixture<InstrumentacionVariadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentacionVariadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstrumentacionVariadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
