import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPopupComponent } from './all-popup.component';

describe('AllPopupComponent', () => {
  let component: AllPopupComponent;
  let fixture: ComponentFixture<AllPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
