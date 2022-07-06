import { ViewportScroller } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { asyncScheduler, filter, observeOn, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollPositions: { [K: number]: number } = {}; // event id -> scroll position
  lastEvent: NavigationStart;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private zone: NgZone
  ) {}

  /**
   * Subscribe to NavigationStart events and record all the scroll positions on which the user navigated away.
   * Positions are indexed by the event id.
   */
  startCachingScrollPositions() {
    console.log('starting caching scroll positions');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.scrollPositions[event.id] =
          this.viewportScroller.getScrollPosition()[1];
        this.lastEvent = event; // Keep track of the last event to be able to be able to restore scroll position when restoreScroll is called
      });
  }

  /**
   * If this is enabled, components that do not make their own calls to restoreScroll will always scroll to the top.
   */
  enableDefaultScrollToTop() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((_event) => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  /**
   * Schedule scroll position restoration. Should be done after all sync code completes and views are rendered in the DOM.
   * This is expected to be called from components after they fetch their data.
   */
  restoreScroll() {
    this.zone.onMicrotaskEmpty
      .asObservable()
      .pipe(take(1), observeOn(asyncScheduler))
      .subscribe(() => {
        // If this is a back or a forward click
        if (this.lastEvent.navigationTrigger === 'popstate') {
          this.viewportScroller.scrollToPosition([
            0,
            this.scrollPositions[this.lastEvent.restoredState.navigationId + 1],
          ]);
        }
      });
  }
}
