// string-to-number.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToNumber',
  standalone: true
})

export class StringToNumberPipe implements PipeTransform {
  transform(value: string): number {
    return Number(value);
  }
}
