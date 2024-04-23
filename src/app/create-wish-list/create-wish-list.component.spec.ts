import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWishListComponent } from './create-wish-list.component';

describe('CreateWishListComponent', () => {
  let component: CreateWishListComponent;
  let fixture: ComponentFixture<CreateWishListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWishListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWishListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
