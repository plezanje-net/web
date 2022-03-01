import { Injectable } from '@angular/core';
import moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getItem(key: string): any {
    const prefixedKey = this.getKey(key);

    const item = JSON.parse(localStorage.getItem(prefixedKey));

    if (!item) {
      return;
    }

    // Check that the item is not expired, but only if expiration date is set. Otherwise assume that the item never expires.
    if (
      item.expirationDate &&
      moment(item.expirationDate).isBefore(moment(new Date()))
    ) {
      this.removeItem(key);
      return;
    } else {
      return item.payload;
    }
  }

  setItem(key: string, payload: any, expirationDate?: string): void {
    localStorage.setItem(
      this.getKey(key),
      JSON.stringify({
        expirationDate,
        payload,
      })
    );
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  private getKey(key: string): string {
    return `${environment.storageKeyPrefix}-${key}`;
  }
}
