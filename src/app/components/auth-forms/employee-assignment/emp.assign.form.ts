import { FormGroup, Validators, FormBuilder } from '@angular/forms'


export function createEmpAssignForm(fb: FormBuilder): FormGroup {
    return fb.group({
        user_id: ['', Validators.required],
        project_id: ['', Validators.required],
        plan_start_date: [''],
        plan_end_date: [''],
        task_id: ['', Validators.required],
        plan_hour: ['', [Validators.required, Validators.max(5)]],
        working_hours: ['', [Validators.required, Validators.max(8)]],
        start_date: [''],
        end_date: [''],
        description: ['']
    })
}


export function updateEmpAssignForm(fb: FormBuilder): FormGroup {
    return fb.group({
        user_id: ['', Validators.required],
        project_id: ['', Validators.required],
        plan_start_date: [''],
        plan_end_date: [''],
        task_id: ['', Validators.required],
        plan_hour: ['', [Validators.required, Validators.max(5)]],
        working_hours: ['', [Validators.required, Validators.max(8)]],
        start_date: [''],
        end_date: [''],
        description: [''],
        status: [false]
    })
}