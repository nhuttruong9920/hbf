import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
  LoadedImage,
} from 'ngx-image-cropper';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


import { BaseApiResponse } from '@shared/type/api.type';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ApiService } from '@shared/service/api.service';

@Component({
  selector: 'app-img-cropper',
  standalone: true,
  imports: [
    ImageCropperComponent,
    ButtonModule,
    ImageUploaderComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './img-cropper.component.html',
  styleUrl: './img-cropper.component.scss',
})
export class ImgCropperComponent implements OnInit {
  imageChangedEvent: Event | null = null;
  originalImage!: File;
  resultFile!: File;

  transform: ImageTransform = {
    translateUnit: 'px',
  };
  canvasRotation = 0;
  translateH = 0;
  translateV = 0;

  imageType!: number;
  imageCollection: string[] = [];

  imageUrl: string = '';
  formData: FormData = new FormData();

  loading: boolean = false;
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.imageType = this.config.data.imageType;
    if (this.imageType !== null && this.imageType !== undefined) {
      this.fetchImageCollection();
    }
  }

  private fetchImageCollection(): void {
    this.apiService
      .get(`/admin/home/imagecollection/${this.imageType}`)
      .subscribe({
        next: (response: BaseApiResponse<string[]>) => {
          if (!response.error) {
            this.imageCollection = response.data ?? [];
          }
        },
      });
  }

  onSelectImageFromCollection(image: string): void {
    this.imageUrl = image;
    this.ref.close(this.imageUrl);
  }

  onFileChange(event: File): void {
    this.canvasRotation = 0;
    this.translateH = 0;
    this.translateV = 0;

    this.originalImage = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    const blob = event.blob;
    if (blob) {
      this.resultFile = new File([blob], this.originalImage.name, {
        lastModified: this.originalImage.lastModified,
        type: this.originalImage.type,
      });
    }
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  rotateLeft() {
    setTimeout(() => {
      this.canvasRotation--;
      this.flipAfterRotate();
    });
  }

  rotateRight() {
    setTimeout(() => {
      this.canvasRotation++;
      this.flipAfterRotate();
    });
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
    this.translateH = 0;
    this.translateV = 0;
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  onConfirmSelection(): void {
    this.loading = true;
    this.formData.append('file', this.resultFile);
    this.apiService
      .post(`/admin/home/uploadimage/${this.imageType}`, this.formData)
      .subscribe({
        next: (response: HttpResponse<BaseApiResponse<string>>) => {
          if (!response?.body?.error) {
            this.imageUrl = response?.body?.data ?? '';
            this.loading = false;
            this.ref.close(this.imageUrl);
          }
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
