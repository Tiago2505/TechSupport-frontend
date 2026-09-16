import { Component, input, signal } from '@angular/core';
import { EvidenceEntity } from '@features/tickets/entities';

@Component({
  selector: 'image-gallery',
  imports: [],
  templateUrl: './image-gallery.html',
})
export class ImageGallery {
  images = input.required<EvidenceEntity[]>();

  currentImage = signal(0);

  private touchStartX = 0;

  nextImage(): void {
    this.currentImage.update((index) => (index === this.images.length - 1 ? 0 : index + 1));
  }

  previousImage(): void {
    this.currentImage.update((index) => (index === 0 ? this.images.length - 1 : index - 1));
  }

  selectImage(index: number): void {
    this.currentImage.set(index);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = this.touchStartX - touchEndX;

    if (Math.abs(difference) < 50) {
      return;
    }

    if (difference > 0) {
      this.nextImage();
    } else {
      this.previousImage();
    }
  }
}
