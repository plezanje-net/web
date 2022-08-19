import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'genderizeVerb',
})
export class GenderizeVerbPipe implements PipeTransform {
  transform(verb: string, gender: string) {
    if (gender == 'F') return verb + 'a';
    if (gender == 'M') return verb;
    return verb + '_a';
  }
}
