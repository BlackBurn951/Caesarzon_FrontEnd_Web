import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagementContainerComponent } from './admin-management-container.component';

describe('AdminManagementContainerComponent', () => {
  let component: AdminManagementContainerComponent;
  let fixture: ComponentFixture<AdminManagementContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManagementContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminManagementContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
