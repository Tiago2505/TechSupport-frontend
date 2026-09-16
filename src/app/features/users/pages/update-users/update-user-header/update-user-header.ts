import { Component, input } from '@angular/core';

@Component({
  selector: 'update-user-header',
  imports: [],
  templateUrl: './update-user-header.html',
})
export class UpdateUserHeader {
  userId = input.required<number>();
}
