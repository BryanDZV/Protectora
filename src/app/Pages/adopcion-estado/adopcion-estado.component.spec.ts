import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdopcionEstadoComponent } from './adopcion-estado.component';

describe('AdopcionEstadoComponent', () => {
  let component: AdopcionEstadoComponent;
  let fixture: ComponentFixture<AdopcionEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdopcionEstadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdopcionEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
