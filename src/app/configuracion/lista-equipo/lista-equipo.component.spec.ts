import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEquipoComponent } from './lista-equipo.component';

describe('ListaEquipoComponent', () => {
  let component: ListaEquipoComponent;
  let fixture: ComponentFixture<ListaEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEquipoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
