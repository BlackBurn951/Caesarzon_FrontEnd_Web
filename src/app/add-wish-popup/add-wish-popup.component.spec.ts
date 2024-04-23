import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWishPopupComponent } from './add-wish-popup.component';

describe('AddWishPopupComponent', () => {
  let component: AddWishPopupComponent;
  let fixture: ComponentFixture<AddWishPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWishPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWishPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
