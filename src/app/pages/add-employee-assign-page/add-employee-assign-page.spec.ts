import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeAssignPage } from './add-employee-assign-page';

describe('AddEmployeeAssignPage', () => {
  let component: AddEmployeeAssignPage;
  let fixture: ComponentFixture<AddEmployeeAssignPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmployeeAssignPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeAssignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
