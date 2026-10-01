import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdopcionDetalleComponent } from './adopcion-detalle.component';

describe('AdopcionDetalleComponent', () => {
  let component: AdopcionDetalleComponent;
  let fixture: ComponentFixture<AdopcionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdopcionDetalleComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdopcionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
