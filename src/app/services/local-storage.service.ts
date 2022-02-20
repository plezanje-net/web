import { Injectable } from '@angular/core';
import moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getItem(key: string): any {
    key = this.getKey(key);

    const item = JSON.parse(localStorage.getItem(key));

    if (!item) {
      return;
    }

    if (moment(item.expirationDate).isBefore(moment(new Date()))) {
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
