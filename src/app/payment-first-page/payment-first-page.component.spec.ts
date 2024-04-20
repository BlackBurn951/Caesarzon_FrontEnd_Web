import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFirstPageComponent } from './payment-first-page.component';

describe('PaymentFirstPageComponent', () => {
  let component: PaymentFirstPageComponent;
  let fixture: ComponentFixture<PaymentFirstPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFirstPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentFirstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
