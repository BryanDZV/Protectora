import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdopcionModalComponent } from './adopcion-modal.component';

describe('AdopcionModalComponent', () => {
  let component: AdopcionModalComponent;
  let fixture: ComponentFixture<AdopcionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdopcionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdopcionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
