import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariadoresComponent } from './variadores.component';

describe('VariadoresComponent', () => {
  let component: VariadoresComponent;
  let fixture: ComponentFixture<VariadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariadoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VariadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
