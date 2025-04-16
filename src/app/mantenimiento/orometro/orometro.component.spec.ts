import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrometroComponent } from './orometro.component';

describe('OrometroComponent', () => {
  let component: OrometroComponent;
  let fixture: ComponentFixture<OrometroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrometroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrometroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
