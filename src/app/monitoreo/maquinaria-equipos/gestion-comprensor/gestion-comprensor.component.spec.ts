import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionComprensorComponent } from './gestion-comprensor.component';

describe('GestionComprensorComponent', () => {
  let component: GestionComprensorComponent;
  let fixture: ComponentFixture<GestionComprensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionComprensorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionComprensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
