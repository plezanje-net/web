import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nrIceFalls',
})
export class NrIceFallsPipe implements PipeTransform {
  transform(value: number): string {
    if (value == 0) {
      return '';
    }

    return (
      `${value} slap` +
      (value == 2
        ? 'ova'
        : value == 3 || value == 4
        ? 'ovi'
        : value > 4
        ? 'ov'
        : '')
    );
  }
}
