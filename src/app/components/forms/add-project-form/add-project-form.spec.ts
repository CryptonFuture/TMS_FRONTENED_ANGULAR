import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectForm } from './add-project-form';

describe('AddProjectForm', () => {
  let component: AddProjectForm;
  let fixture: ComponentFixture<AddProjectForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
