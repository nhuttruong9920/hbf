import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;
    const phoneRegex = /^0[3-9]\d{8}$/;

    const valid = phoneRegex.test(phoneNumber);

    return valid ? null : { phone: true };
  };
}
