import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentDataComponent } from './user-payment-data.component';

describe('UserPaymentDataComponent', () => {
  let component: UserPaymentDataComponent;
  let fixture: ComponentFixture<UserPaymentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPaymentDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPaymentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
