import { FormGroup, Validators, FormBuilder } from '@angular/forms'

export function createEmployeeForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(10)]],
        confirmPass: ['', [Validators.required, Validators.minLength(10)]],
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        department: ['', [Validators.required]],
        joiningDate: ['', [Validators.required]],
        description: ['']
    })
}

export function updateEmployeeForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(10)]],
        confirmPass: ['', [Validators.required, Validators.minLength(10)]],
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        department: ['', [Validators.required]],
        joiningDate: ['', [Validators.required]],
        description: [''],
        active: [''],
        admin: ['']
    })
}