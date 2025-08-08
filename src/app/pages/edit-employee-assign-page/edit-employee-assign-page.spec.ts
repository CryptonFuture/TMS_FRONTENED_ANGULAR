import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeAssignPage } from './edit-employee-assign-page';

describe('EditEmployeeAssignPage', () => {
  let component: EditEmployeeAssignPage;
  let fixture: ComponentFixture<EditEmployeeAssignPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmployeeAssignPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeAssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
