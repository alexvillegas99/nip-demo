import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVariadorComponent } from './gestion-variador.component';

describe('GestionVariadorComponent', () => {
  let component: GestionVariadorComponent;
  let fixture: ComponentFixture<GestionVariadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionVariadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionVariadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
