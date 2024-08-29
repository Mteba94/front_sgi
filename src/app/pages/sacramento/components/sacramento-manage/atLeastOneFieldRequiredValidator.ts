import { AbstractControl, ValidatorFn } from "@angular/forms";

export function atLeastOneFieldRequiredValidator(
    field1Name: string,
    field2Name: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const field1 = formGroup.get(field1Name);
      const field2 = formGroup.get(field2Name);
  
      if (!field1 || !field2) {
        return null;
      }
  
      if (!field1.value && !field2.value) {
        return { atLeastOneFieldRequired: true };
      }
  
      return null;
    };
  }