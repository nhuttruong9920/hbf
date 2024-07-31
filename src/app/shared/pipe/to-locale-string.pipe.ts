import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocaleString',
  standalone: true,
})
export class ToLocaleStringPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'number') {
      return '';
    }
    return value.toLocaleString();
  }
}
