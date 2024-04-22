import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSecondPageComponent } from './payment-second-page.component';

describe('PaymentSecondPageComponent', () => {
  let component: PaymentSecondPageComponent;
  let fixture: ComponentFixture<PaymentSecondPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSecondPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentSecondPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
