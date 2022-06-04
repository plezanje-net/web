import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralizeNoun',
})
export class PluralizeNoun implements PipeTransform {
  transform(count: number, noun: string) {
    switch (noun) {
      case 'smer':
        return count + (count % 100 === 1 ? ' smer' : ' smeri');

      case 'uspešen vzpon':
        switch (count % 100) {
          case 1:
            return `${count} uspešen vzpon`;
          case 2:
            return `${count} uspešna vzpona`;
          case 3:
          case 4:
            return `${count} uspešni vzponi`;
          default:
            return `${count} uspešnih vzponov`;
        }

      case 'poskus':
        switch (count % 100) {
          case 1:
            return `${count} poskus`;
          case 2:
            return `${count} poskusa`;
          case 3:
          case 4:
            return `${count} poskusi`;
          default:
            return `${count} poskusov`;
        }

      case 'plezalec':
        switch (count % 100) {
          case 1:
            return `${count} plezalec`;
          case 2:
            return `${count} plezalca`;
          case 3:
          case 4:
            return `${count} plezalci`;
          default:
            return `${count} plezalcev`;
        }

      // case 'xyz' // add nouns when needed...
      default:
        return count + ' ' + noun;
    }
  }
}
