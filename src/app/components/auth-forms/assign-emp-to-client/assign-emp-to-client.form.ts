import { FormGroup, Validators, FormBuilder } from '@angular/forms'

export function createAssignEmpToClientForm(fb: FormBuilder): FormGroup {
    return fb.group({
        emp_id: ['', Validators.required],
        client_id: [null],
    })
}