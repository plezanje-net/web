import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ASCENT_TYPES } from 'src/app/common/activity.constants';

@Injectable({
  providedIn: 'root',
})
export class ActivityFormService {
  routesBeingLoggedFormArray: FormArray;
  distinctRouteIds: Set<string>;

  allPossibleAscentTypes = new Set(ASCENT_TYPES.map((at) => at.value));

  tickAscentTypes = new Set(
    ASCENT_TYPES.filter((at) => at.tick).map((at) => at.value)
  );

  trTickAscentTypes = new Set(
    ASCENT_TYPES.filter((at) => at.topRopeTick).map((at) => at.value)
  );

  constructor() {}

  initialize(routes: FormArray) {
    this.routesBeingLoggedFormArray = routes;
    this.distinctRouteIds = new Set(
      routes.controls.map(
        (routeFormGroup) => routeFormGroup.get('routeId').value
      )
    );
  }

  get numOfRoutes() {
    return this.routesBeingLoggedFormArray.length;
  }

  logPossible(ascentType: string, routeIndex: number, routeId: string) {
    // should assume that routesBeingLogged array already includes the 'incoming' route which we are checking the possible ascentType for
    // simulate logging the routes in order and adjust possible logs on each step until the target route is reached

    // start with all ascentTypes
    let possibleAscentTypes = new Set(this.allPossibleAscentTypes);
    // remove repeat straight away, because it needs a previous ascent to be possible
    possibleAscentTypes.delete('repeat');
    possibleAscentTypes.delete('t_repeat');

    for (
      let index = 0;
      index < this.routesBeingLoggedFormArray.controls.length;
      index++
    ) {
      const routeFormGroup = this.routesBeingLoggedFormArray.controls[
        index
      ] as FormGroup;

      // if the id of current route is not the same as routeId continue (we only need to check compatibility of multiple logs of the same route)
      if (routeFormGroup.value.routeId !== routeId) {
        continue; // bellow conditions actually dismiss this case just as well...
      }

      // if the id is the same as current route (and index is not the same) that means that the route is being logged more than once in a single log entry, so adjust the possibleAscentTypes set, then continue
      if (routeFormGroup.value.routeId === routeId && index !== routeIndex) {
        // add or remove from possibleAscentTypes

        // remove onsight and flash immediately, since they cannot be logged if any other log(=try) of same route preceeds them
        possibleAscentTypes.delete('onsight');
        possibleAscentTypes.delete('t_onsight');
        possibleAscentTypes.delete('flash');
        possibleAscentTypes.delete('t_flash');

        // add repeat to possible ascent types when we find previous ascent that is considered a tick and remove redpoint
        if (this.tickAscentTypes.has(routeFormGroup.value.ascentType)) {
          possibleAscentTypes.add('repeat');
          possibleAscentTypes.add('t_repeat');
          possibleAscentTypes.delete('redpoint');
          possibleAscentTypes.delete('t_redpoint');
        }

        // if this is (only) a toprope tick, then toprope redpoint is not possible anymore, and toprope repeat becomes possible
        if (this.trTickAscentTypes.has(routeFormGroup.value.ascentType)) {
          possibleAscentTypes.delete('t_redpoint');
          possibleAscentTypes.add('t_repeat');
        }
      }

      // if the passed in route index is the same as the routesFormArray index then we arrived to the route for which we are deciding if a log is possible.
      // check if the passed in ascent type is still possible and return the answer
      if (index === routeIndex) {
        // but first also remove/add ascent types as is dictated by the user's log history

        // if the user has tried this route, remove onsight and flash
        if (routeFormGroup.value.tried) {
          possibleAscentTypes.delete('onsight');
          possibleAscentTypes.delete('t_onsight');
          possibleAscentTypes.delete('flash');
          possibleAscentTypes.delete('t_flash');
        }

        // if the user has already ticked the route, remove redpoint and add repeat
        if (routeFormGroup.value.ticked) {
          possibleAscentTypes.delete('redpoint');
          possibleAscentTypes.delete('t_redpoint');
          possibleAscentTypes.add('repeat');
          possibleAscentTypes.add('t_repeat');
        }

        // if the user already (only) toprope ticked the route she cannot toprope redpoint it again but she can toprope repeat it
        if (routeFormGroup.value.trTicked) {
          possibleAscentTypes.delete('t_redpoint');
          possibleAscentTypes.add('t_repeat');
        }

        // if the passed in ascentType is not possible but route has it currently selected we need to deselect it
        if (
          !possibleAscentTypes.has(ascentType) &&
          routeFormGroup.value.ascentType === ascentType
        ) {
          routeFormGroup.get('ascentType').setValue(null);
        }

        return possibleAscentTypes.has(ascentType);
      }
    }
  }

  conditionallyDisableVotedDifficultyInputs() {
    // Go through all distinct routes being logged. For each of them enable voted difficulty input if it is the first instance with ascent type that is a tick, or disable it in all other cases.
    this.distinctRouteIds.forEach((routeId) => {
      let someVDIEnabled = false;
      this.routesBeingLoggedFormArray.controls
        .filter(
          (routeFormGroup) => routeFormGroup.get('routeId').value === routeId
        )
        .forEach((routeFormGroup) => {
          if (
            this.tickAscentTypes.has(routeFormGroup.get('ascentType').value) &&
            !someVDIEnabled
          ) {
            someVDIEnabled = true;
            routeFormGroup.get('votedDifficulty').enable();
          } else {
            routeFormGroup.get('votedDifficulty').setValue(null);
            routeFormGroup.get('votedDifficulty').disable();
          }
        });
    });
  }
}
