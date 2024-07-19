import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroModalComponent } from './filtro-modal.component';

describe('FiltroModalComponent', () => {
  let component: FiltroModalComponent;
  let fixture: ComponentFixture<FiltroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
