import { Component, ElementRef, output, viewChild } from '@angular/core';

@Component({
  selector: 'input-add-image-grid',
  imports: [],
  templateUrl: './input-add-image-grid.html',
})
export class InputAddImageGrid {

  files = output<FileList>();

  inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  shareFiles(){

    const imagesSelected = this.inputElement()?.nativeElement.files;

    if(!imagesSelected) return;

    this.files.emit(imagesSelected);

  }

}
