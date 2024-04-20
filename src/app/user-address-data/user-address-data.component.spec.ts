import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddressDataComponent } from './user-address-data.component';

describe('UserAddressDataComponent', () => {
  let component: UserAddressDataComponent;
  let fixture: ComponentFixture<UserAddressDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddressDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAddressDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
