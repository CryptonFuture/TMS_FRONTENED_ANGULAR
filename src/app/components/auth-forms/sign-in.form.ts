import {FormGroup, Validators, FormBuilder} from '@angular/forms'

export function createLoginForm(fb: FormBuilder): FormGroup {
    return fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(10)]],
        role: ['']
    })
}