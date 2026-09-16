import { Component, input, output } from '@angular/core';

import { BtnRestoreImageGrid } from "../btn-restore-image-grid/btn-restore-image-grid";
import { BtnDeleteImageGrid } from "../btn-delete-image-grid/btn-delete-image-grid";
import { NewIconImage } from "./new-icon-image/new-icon-image";

@Component({
  selector: 'app-image',
  imports: [BtnRestoreImageGrid, BtnDeleteImageGrid, NewIconImage],
  templateUrl: './image.html',
})
export class Image {

  image = input.required<string>();
  isNewImage = input<boolean>(false);
  wasImageDeleted = input.required<boolean>();

  RestoreBtnWasClicked = output<boolean>();
  DeleteBtnWasClicked = output<boolean>();

}
