import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor() {}

  ignoreAccents(searchString: string) {
    searchString = searchString.replace(/[cčć]/gi, '[cčć]');
    searchString = searchString.replace(/[sš]/gi, '[sš]');
    searchString = searchString.replace(/[zž]/gi, '[zž]');
    searchString = searchString.replace(/[aàáâäæãåā]/gi, '[aàáâäæãåā]');
    searchString = searchString.replace(/[eèéêëēėę]/gi, '[eèéêëēėę]');
    searchString = searchString.replace(/[iîïíīįì]/gi, '[iîïíīįì]');
    searchString = searchString.replace(/[oôöòóœøōõ]/gi, '[oôöòóœøōõ]');
    searchString = searchString.replace(/[uûüùúū]/gi, '[uûüùúū]');
    searchString = searchString.replace(/[dđ]/gi, '[dđ]');

    return searchString;
  }

  /**
   * Escapes all regex special characters
   */
  escape(searchString: string) {
    return searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
