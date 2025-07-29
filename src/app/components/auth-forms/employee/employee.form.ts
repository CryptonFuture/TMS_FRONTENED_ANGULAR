import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'

export const passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  const password = form.get('password')?.value;
  const confirmPass = form.get('confirmPass')?.value;
  return password && confirmPass && password !== confirmPass ? { passwordMismatch: true } : null;
};

export function createEmployeeForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(10)]],
        confirmPass: ['', [Validators.required, Validators.minLength(10)]],
        phone: ['', [Validators.required, Validators.pattern(/^\+92\d{10}$/)]],
        address: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        department: ['', [Validators.required]],
        joiningDate: ['', [Validators.required]],
        description: ['']
    } , { validators: passwordMatchValidator })
}

export function updateEmployeeForm(fb: FormBuilder): FormGroup {
    return fb.group({
        name: [''],
        email: [''],
        phone: ['', [Validators.required, Validators.pattern(/^\+92\d{10}$/)]],
        address: ['', [Validators.required]],
        designation: ['', [Validators.required]],
        department: ['', [Validators.required]],
        joiningDate: [''],
        description: [''],
        active: [false],
        is_admin: [false]
    }, { validators: passwordMatchValidator })
}