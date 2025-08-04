import { FormGroup, Validators, FormBuilder } from '@angular/forms'


export function createProjectForm(fb: FormBuilder): FormGroup {
    return fb.group({
        project_code: ['', Validators.required],
        project_name: ['', Validators.required],
        working_hours: ['', Validators.required],
        joc: ['', Validators.required],
        designName: ['', Validators.required],
        project_manager_id: [null],
        client_id: [null],
        manager_id: [null],
        start_date: [''],
        end_date: [''],
        allow_for_off_time: [false],
        description: ['']
    })
}

export function approvalProjectForm(fb: FormBuilder): FormGroup {
    return fb.group({
        project_code: [{value: false, disabled: true}],
        project_name: [{value: false, disabled: true}],
        working_hours: [{value: false, disabled: true}],
        joc: [{value: false, disabled: true}],
        designName: [{value: false, disabled: true}],
        project_manager_id: [{value: false, disabled: true}],
        client_id: [{value: false, disabled: true}],
        manager_id: [{value: false, disabled: true}],
        start_date: [{value: false, disabled: true}],
        end_date: [{value: false, disabled: true}],
        allow_for_off_time: [{value: false, disabled: true}],
        description: [{value: false, disabled: true}],
        status: [{value: false, disabled: true}],
        projectStatus: [{value: false, disabled: true}],
        remarks: ['', Validators.required]
    })
}

export function updateProjectForm(fb: FormBuilder): FormGroup {
    return fb.group({
        project_code: ['', Validators.required],
        project_name: ['', Validators.required],
        working_hours: ['', Validators.required],
        joc: ['', Validators.required],
        designName: ['', Validators.required],
        project_manager_id: [null],
        client_id: [null],
        manager_id: [null],
        start_date: [''],
        end_date: [''],
        allow_for_off_time: [false],
        description: [''],
        status: [false],
        projectStatus: ['', Validators.required]
    })
}