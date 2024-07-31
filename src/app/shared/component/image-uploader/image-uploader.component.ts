import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss',
})
export class ImageUploaderComponent {
  @Input() activeColor: string = 'green';
  @Input() baseColor: string = '#ccc';
  @Input() overlayColor: string = 'rgba(255,255,255,0.5)';

  @Output() imageChanged = new EventEmitter<File>();

  dragging: boolean = false;
  loaded: boolean = false;

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
    const file = e.dataTransfer?.files[0] ?? new File([''], '');
    this.imageChanged.emit(file);
  }

  handleInputChange(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0] ?? new File([''], '');
    this.imageChanged.emit(file);
  }
}
