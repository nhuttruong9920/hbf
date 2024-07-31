import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  @Input() fallbackSrc: string = 'https://placehold.co/1x1?text=N/A';
  constructor(private elelement: ElementRef) {}

  @HostListener('error') onError() {
    this.elelement.nativeElement.src = this.fallbackSrc;
  }
}
