import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orientation',
})
export class OrientationPipe implements PipeTransform {
  transform(value: string, display = 'full'): string {
    const sides = {
      N: { full: 'sever', short: 'S' },
      S: { full: 'jug', short: 'J' },
      E: { full: 'vzhod', short: 'V' },
      W: { full: 'zahod', short: 'Z' },
    };

    if (value == null) {
      return '';
    }

    if (value.length == 1) {
      return sides[value][display] || '';
    }

    if (
      value.length == 2 &&
      sides[value[0]][display] != null &&
      sides[value[1]][display] != null
    ) {
      return (
        sides[value[0]][display] +
        (display === 'full' ? 'o' : '') +
        sides[value[1]][display]
      );
    }

    return '';
  }
}
