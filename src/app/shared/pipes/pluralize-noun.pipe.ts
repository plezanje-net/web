import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralizeNoun',
})
export class PluralizeNoun implements PipeTransform {
  transform(count: number, noun: string) {
    switch (noun) {
      case 'smer':
        return count + (count % 100 === 1 ? ' smer' : ' smeri');
      // case 'xyz' // add nouns when needed...
      default:
        return count + ' ' + noun;
    }
  }
}
