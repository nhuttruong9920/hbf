import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { debounceTime, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appDebounce]',
  standalone: true,
})
export class DebounceDirective implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  @Input() debounceTimeMs: number = 1000;
  @Output() debounceEvent = new EventEmitter<string>();

  private searchSubject = new Subject<string>();

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.ngUnsubscribe))
      .subscribe((value) => this.debounceEvent.emit(value));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
