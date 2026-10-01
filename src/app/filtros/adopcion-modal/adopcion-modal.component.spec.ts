import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { AdopcionModalComponent } from './adopcion-modal.component';

describe('AdopcionModalComponent', () => {
  let component: AdopcionModalComponent;
  let fixture: ComponentFixture<AdopcionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdopcionModalComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdopcionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
