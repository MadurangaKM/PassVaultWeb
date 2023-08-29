import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Asynchronous URL validator
export function asyncUrlValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null); // Don't validate empty value
    }

    // Regular expression for URL validation
    const urlPattern = /^(http|https):\/\/[a-z0-9\-\.]+\.[a-z]{2,}(\/.*)?$/i;

    // Simulating an asynchronous validation with a delay
    return of(
      urlPattern.test(control.value) ? null : { invalidUrl: true }
    ).pipe(
      delay(1000) // Simulate async operation
    );
  };
}
