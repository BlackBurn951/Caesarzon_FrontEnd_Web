import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMessagComponent } from './confirm-messag.component';

describe('ConfirmMessagComponent', () => {
  let component: ConfirmMessagComponent;
  let fixture: ComponentFixture<ConfirmMessagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmMessagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmMessagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
