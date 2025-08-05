import { FormGroup, Validators, FormBuilder } from '@angular/forms'

export function createTaskForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ['', Validators.required],
        description: [''],
        client_id: [null],
    })
}

export function advanceFilterTaskForm(fb: FormBuilder): FormGroup {
    return fb.group({
        status: [''],
        date: [''],
    })
}

export function updateTaskForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ['', Validators.required],
        description: [''],
        status: [false],
        client_id: [null],
    })
}