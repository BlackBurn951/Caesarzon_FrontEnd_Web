import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementContainerComponent } from './user-management-container.component';

describe('UserManagementContainerComponent', () => {
  let component: UserManagementContainerComponent;
  let fixture: ComponentFixture<UserManagementContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserManagementContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
