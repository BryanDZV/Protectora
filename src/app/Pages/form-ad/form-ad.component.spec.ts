import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdComponent } from './form-ad.component';

describe('FormAdComponent', () => {
  let component: FormAdComponent;
  let fixture: ComponentFixture<FormAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
