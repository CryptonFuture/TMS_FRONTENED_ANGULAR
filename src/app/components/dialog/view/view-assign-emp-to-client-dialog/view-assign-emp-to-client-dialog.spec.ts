import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignEmpToClientDialog } from './view-assign-emp-to-client-dialog';

describe('ViewAssignEmpToClientDialog', () => {
  let component: ViewAssignEmpToClientDialog;
  let fixture: ComponentFixture<ViewAssignEmpToClientDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssignEmpToClientDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssignEmpToClientDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
