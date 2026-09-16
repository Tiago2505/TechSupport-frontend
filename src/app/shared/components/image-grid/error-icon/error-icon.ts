import { Component, input } from '@angular/core';

@Component({
  selector: 'error-icon',
  imports: [],
  templateUrl: './error-icon.html',
})
export class ErrorIcon {

  errorText = input.required<string>();

}
