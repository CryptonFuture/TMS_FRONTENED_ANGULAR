import { FormGroup, Validators, FormBuilder } from '@angular/forms'

export function createPermissionForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: [''],
        route: [''],
        role: [''],
        action: fb.array([]),
        description: ['']
    })
}


export function updatePermissionForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: [''],
        route: [''],
        role: [''],
        action: fb.array([]),
        description: [''],
        status: [false]
    })
}