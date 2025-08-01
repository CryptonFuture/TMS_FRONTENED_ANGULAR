import { FormGroup, Validators, FormBuilder } from '@angular/forms'


export function createProjectForm(fb: FormBuilder): FormGroup {
    return fb.group({
        project_code: ['', Validators.required],
        project_name: ['', Validators.required],
        working_hours: ['', Validators.required],
        joc: ['', Validators.required],
        designation: ['', Validators.required],
        project_manager_id: [null],
        client_id: [null],
        manager_id: [null],
        start_date: [''],
        end_date: [''],
        allow_for_off_time: [false],
        description: ['']
    })
}

export function updateProjectForm(fb: FormBuilder): FormGroup {
    return fb.group({
        project_code: ['', Validators.required],
        project_name: ['', Validators.required],
        working_hours: ['', Validators.required],
        joc: ['', Validators.required],
        designation: ['', Validators.required],
        project_manager_id: [null],
        client_id: [null],
        manager_id: [null],
        start_date: [''],
        end_date: [''],
        allow_for_off_time: [false],
        description: [''],
        status: [false],
        projectStatus: ['pending']
    })
}