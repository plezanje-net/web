import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  getItem(key: string): any {
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

  setItem(key: string, payload: any, expirationDate: string): void {
    localStorage.setItem(key, JSON.stringify({
      expirationDate,
      payload,
    }));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
