import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  private nLoading = 0;
  private showLoader = new BehaviorSubject<boolean>(false);
  showLoader$ = this.showLoader.asObservable();

  constructor() {}

  pushLoader() {
    this.nLoading++;
    // emit value only when count changes the loading state
    if (this.nLoading == 1) {
      this.showLoader.next(true);
    }
  }

  popLoader() {
    this.nLoading--;
    // emit value only when count changes the loading state
    if (this.nLoading == 0) {
      this.showLoader.next(false);
    }
  }

  resetLoaders() {
    this.nLoading = 0;
    this.showLoader.next(false);
  }
}
