import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orientation',
})
export class OrientationPipe implements PipeTransform {
  transform(value: string): string {
    const sides = {
      N: 'sever',
      S: 'jug',
      E: 'vzhod',
      W: 'zahod',
    };

    if (value == null) {
      return '';
    }

    if (value.length == 1) {
      return sides[value] || '';
    }

    if (
      value.length == 2 &&
      sides[value[0]] != null &&
      sides[value[1]] != null
    ) {
      return sides[value[0]] + 'o' + sides[value[1]];
    }

    return '';
  }
}
