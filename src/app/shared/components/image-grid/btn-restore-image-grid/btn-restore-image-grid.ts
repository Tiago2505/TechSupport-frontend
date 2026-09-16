import { Component, input, output } from '@angular/core';

@Component({
  selector: 'btn-restore-image-grid',
  imports: [],
  templateUrl: './btn-restore-image-grid.html',
})
export class BtnRestoreImageGrid {

  wasClicked = output<boolean>();

  shareWasClicked(){
    this.wasClicked.emit(true);
  }
}
