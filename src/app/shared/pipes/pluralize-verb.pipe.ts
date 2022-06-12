import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralizeVerb',
})
export class PluralizeVerb implements PipeTransform {
  transform(count: number, verb: string) {
    switch (verb) {
      case 'čakati':
        switch (count % 100) {
          case 1:
            return 'čaka';
          case 2:
            return 'čakata';
          case 3:
          case 4:
            return 'čakajo';
          default:
            return 'čaka';
        }

      // case 'xyz' // add verbs when needed...
      default:
        return verb;
    }
  }
}
