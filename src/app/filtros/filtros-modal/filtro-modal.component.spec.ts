import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FiltroModalComponent } from './filtro-modal.component';

describe('FiltroModalComponent', () => {
  let component: FiltroModalComponent;
  let fixture: ComponentFixture<FiltroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroModalComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { updateSize: jasmine.createSpy('updateSize') },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { contexto: 'galeria', animales: [] },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
