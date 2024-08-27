import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprensoresComponent } from './comprensores.component';

describe('ComprensoresComponent', () => {
  let component: ComprensoresComponent;
  let fixture: ComponentFixture<ComprensoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprensoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComprensoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
