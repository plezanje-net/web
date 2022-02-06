import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'ascentType',
})
export class AscentTypePipe implements PipeTransform {
  transform(ascentType: string) {
    switch (ascentType) {
      case 'onsight':
        return 'na pogled';
      case 'flash':
        return 'na flash';
      case 'redpoint':
        return 'z rdečo piko';
      case 'repeat':
        return 'ponovno';
      default:
        return ascentType;
    }
  }
}
