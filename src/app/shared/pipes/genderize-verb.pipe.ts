import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'genderizeVerb',
})
export class GenderizeVerbPipe implements PipeTransform {
  transform(verb: string, gender: string) {
    if (!gender) return verb + '(a)';
    if (gender == 'F') return verb + 'a';
    return verb;
  }
}
