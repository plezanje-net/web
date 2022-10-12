import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  ASCENT_TYPES,
  PublishOptionsEnum,
} from 'src/app/common/activity.constants';

@Injectable({
  providedIn: 'root',
})
export class ActivityFormService {
  distinctRouteIds: Set<string>;

  allPossibleAscentTypes = new Set(ASCENT_TYPES.map((at) => at.value));

  tickAscentTypes = new Set(
    ASCENT_TYPES.filter((at) => at.tick).map((at) => at.value)
  );

  trTickAscentTypes = new Set(
    ASCENT_TYPES.filter((at) => at.topRopeTick).map((at) => at.value)
  );

  routesBeingLoggedFormArray: FormArray;
  routesPossibleAscentTypes = []; // This is an array of sets of possible ascentTypes for each route that is being logged. Each element (that is a set) of the array belongs to a route at the same index as it appears on the log form. Each set holds all of the currently possible ascent types for this route.

  starRatingVotesForRoutes: {}; // This is an object of routeId=>stars pairs, that is user's possible previous star rating vote on each route.

  constructor() {}

  initialize(routes: FormArray) {
    this.routesBeingLoggedFormArray = routes;
    this.distinctRouteIds = new Set(
      routes.controls.map(
        (routeFormGroup) => routeFormGroup.get('routeId').value
      )
    );
    this.routesPossibleAscentTypes = new Array(this.numOfRoutes).fill(
      new Set()
    );
  }

  get numOfRoutes() {
    return this.routesBeingLoggedFormArray.length;
  }

  logPossible(routeIndex: number, ascentType: string) {
    return this.routesPossibleAscentTypes[routeIndex].has(ascentType);
  }

  revalidateAscentTypes() {
    this.routesBeingLoggedFormArray.controls.forEach(
      (routeFormGroup, currRouteIdx) => {
        const routeId = routeFormGroup.get('routeId').value;

        // Start with all possible ascentTypes
        this.routesPossibleAscentTypes[currRouteIdx] = new Set(
          this.allPossibleAscentTypes
        );

        // Remove repeat, because repeat needs at least one tick before it
        this.routesPossibleAscentTypes[currRouteIdx].delete('repeat');
        this.routesPossibleAscentTypes[currRouteIdx].delete('t_repeat');

        // Check user's log history
        // If the user has tried this route, remove onsight and flash
        if (routeFormGroup.value.tried) {
          this.routesPossibleAscentTypes[currRouteIdx].delete('onsight');
          this.routesPossibleAscentTypes[currRouteIdx].delete('t_onsight');
          this.routesPossibleAscentTypes[currRouteIdx].delete('flash');
          this.routesPossibleAscentTypes[currRouteIdx].delete('t_flash');
        }

        // If the user has ticked the route, remove redpoint and add repeat
        if (routeFormGroup.value.ticked) {
          this.routesPossibleAscentTypes[currRouteIdx].delete('redpoint');
          this.routesPossibleAscentTypes[currRouteIdx].delete('t_redpoint');
          this.routesPossibleAscentTypes[currRouteIdx].add('repeat');
          this.routesPossibleAscentTypes[currRouteIdx].add('t_repeat');
        }

        // If the user has (only) toprope ticked the route she cannot toprope redpoint it again but she can toprope repeat it
        if (routeFormGroup.value.trTicked) {
          this.routesPossibleAscentTypes[currRouteIdx].delete('t_redpoint');
          this.routesPossibleAscentTypes[currRouteIdx].add('t_repeat');
        }

        // One can be logging multiple instances of the same route at once. Loop through all instances preceeding current instance and take them into account as if they were logged
        for (
          let prevRouteIdx = 0;
          prevRouteIdx < currRouteIdx;
          prevRouteIdx++
        ) {
          if (
            routeId !==
            this.routesBeingLoggedFormArray.controls[prevRouteIdx].get(
              'routeId'
            ).value
          ) {
            continue; // This is not another instance of the same route, so skip it.
          }

          const previousAscentType =
            this.routesBeingLoggedFormArray.controls[prevRouteIdx].get(
              'ascentType'
            ).value;

          // Remove onsight and flash right away, because any log preceeding this one is a try
          this.routesPossibleAscentTypes[currRouteIdx].delete('onsight');
          this.routesPossibleAscentTypes[currRouteIdx].delete('t_onsight');
          this.routesPossibleAscentTypes[currRouteIdx].delete('flash');
          this.routesPossibleAscentTypes[currRouteIdx].delete('t_flash');

          // Add repeat and remove redpoint if there is a tick log preceeding this one
          if (this.tickAscentTypes.has(previousAscentType)) {
            this.routesPossibleAscentTypes[currRouteIdx].add('repeat');
            this.routesPossibleAscentTypes[currRouteIdx].add('t_repeat');
            this.routesPossibleAscentTypes[currRouteIdx].delete('redpoint');
            this.routesPossibleAscentTypes[currRouteIdx].delete('t_redpoint');
          }

          // If there is a toprope tick log preceeding this one then toprope redpoint is not possible anymore, and toprope repeat becomes possible
          if (this.trTickAscentTypes.has(previousAscentType)) {
            this.routesPossibleAscentTypes[currRouteIdx].delete('t_redpoint');
            this.routesPossibleAscentTypes[currRouteIdx].add('t_repeat');
          }
        }

        // Check if this route's currently selected ascent type is valid and unset it if it's not
        const currentAscentType = routeFormGroup.get('ascentType').value;
        if (
          currentAscentType &&
          !this.routesPossibleAscentTypes[currRouteIdx].has(currentAscentType)
        ) {
          routeFormGroup.get('ascentType').setValue(null, { emitEvent: false });
        }
      }
    );
  }

  duplicateRoute(routeIndex: number) {
    const routeFormGroupOriginal = <FormGroup>(
      this.routesBeingLoggedFormArray.at(routeIndex)
    );
    const routeFormGroupCopy = this.copyFormGroup(routeFormGroupOriginal);
    this.routesBeingLoggedFormArray.insert(routeIndex + 1, routeFormGroupCopy);
    this.routesPossibleAscentTypes.splice(routeIndex + 1, 0, new Set());

    this.revalidateAscentTypes();
    this.conditionallyDisableVotedDifficultyInputs();
    this.conditionallyDisableVotedStarRatingInputs();
  }

  removeRouteAt(routeIndex: number) {
    this.routesBeingLoggedFormArray.removeAt(routeIndex); // remove the form control group
    this.routesPossibleAscentTypes.splice(routeIndex, 1); // remove the corresponding set of possible ascent types
    this.revalidateAscentTypes();
    this.conditionallyDisableVotedDifficultyInputs();
    this.conditionallyDisableVotedStarRatingInputs();
  }

  moveRoute(routeIndex: number, direction: number) {
    // swap adjacent elements of array
    [
      this.routesBeingLoggedFormArray.controls[routeIndex],
      this.routesBeingLoggedFormArray.controls[routeIndex + direction],
    ] = [
      this.routesBeingLoggedFormArray.controls[routeIndex + direction],
      this.routesBeingLoggedFormArray.controls[routeIndex],
    ];

    [
      this.routesPossibleAscentTypes[routeIndex],
      this.routesPossibleAscentTypes[routeIndex + direction],
    ] = [
      this.routesPossibleAscentTypes[routeIndex + direction],
      this.routesPossibleAscentTypes[routeIndex],
    ];
    this.revalidateAscentTypes();
    this.conditionallyDisableVotedDifficultyInputs();
    this.conditionallyDisableVotedStarRatingInputs();
  }

  private copyFormGroup(formGroupOriginal: FormGroup) {
    const formGroupData = Object.keys(formGroupOriginal.controls).reduce(
      (fgData, key) => {
        fgData[key] = new FormControl(
          formGroupOriginal.get(key).value,
          formGroupOriginal.get(key).validator
        );
        return fgData;
      },
      {}
    );
    return new FormGroup(formGroupData);
  }

  /**
   * Go through all distinct routes being logged.
   * For each of them enable voted difficulty input if it is the first instance with ascent type that is a tick.
   * Disable it in all other cases.
   */
  conditionallyDisableVotedDifficultyInputs() {
    this.distinctRouteIds.forEach((routeId) => {
      let someVDIEnabled = false;
      this.routesBeingLoggedFormArray.controls
        .filter(
          (routeFormGroup) => routeFormGroup.get('routeId').value === routeId
        )
        .forEach((routeFormGroup) => {
          // One can vote on difficulty only if this is a tick. And only on one ascent if multiple of same route being logged at once.
          if (
            this.tickAscentTypes.has(routeFormGroup.get('ascentType').value) &&
            !someVDIEnabled
          ) {
            someVDIEnabled = true;
            routeFormGroup.get('votedDifficulty').enable({ emitEvent: false });
          } else {
            routeFormGroup
              .get('votedDifficulty')
              .setValue(null, { emitEvent: false });
            routeFormGroup.get('votedDifficulty').disable({ emitEvent: false });
          }
        });
    });
  }

  conditionallyDisableVotedStarRatingInputs() {
    // Go through all distinct routes being logged. For each of them enable voted star rating input if it is the first instance of the route being logged and disable it in all other cases.
    this.distinctRouteIds.forEach((routeId) => {
      let someVSRIEnabled = false;
      this.routesBeingLoggedFormArray.controls
        .filter(
          (routeFormGroup) => routeFormGroup.get('routeId').value === routeId
        )
        .forEach((routeFormGroup) => {
          if (!someVSRIEnabled) {
            someVSRIEnabled = true;
            routeFormGroup.get('votedStarRating').enable({ emitEvent: false });
          } else {
            routeFormGroup
              .get('votedStarRating')
              .setValue(null, { emitEvent: false });
            routeFormGroup.get('votedStarRating').disable({ emitEvent: false });
          }
        });
    });
  }
}
