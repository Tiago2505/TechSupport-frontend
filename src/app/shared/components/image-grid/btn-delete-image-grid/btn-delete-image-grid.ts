import { Component, output } from '@angular/core';

@Component({
  selector: 'btn-delete-image-grid',
  imports: [],
  templateUrl: './btn-delete-image-grid.html',
})
export class BtnDeleteImageGrid {


  wasClicked = output<boolean>();

  shareWasClicked(){

    this.wasClicked.emit(true);

  }

}
