import { Component, input } from '@angular/core';

@Component({
  selector: 'not-found',
  imports: [],
  templateUrl: './not-found.html',
})
export class NotFound {

  entityNotFoundName = input.required<string>();


}
