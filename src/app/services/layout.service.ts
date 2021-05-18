import { Injectable } from '@angular/core';
import { Breadcrumb } from '../types/breadcrumb';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public $breadcrumbs: Subject<Array<Breadcrumb>> = new Subject<
    Array<Breadcrumb>
  >();

  constructor() {}
}
