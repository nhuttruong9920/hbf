import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocaleTime',
  standalone: true,
})
export class ToLocaleTimePipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'string') {
      return '';
    }
    const date = new Date(value);
    return date.toLocaleString();
  }
}
