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

    if (moment(item.createdAt).isBefore(moment(new Date()).subtract(1, 'day'))) {
      this.removeItem(key);
      return;
    } else {
      return item.payload;
    }
  }

  setItem(key: string, payload: any): void {
    localStorage.setItem(key, JSON.stringify({
      createdAt: new Date(),
      payload,
    }));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
