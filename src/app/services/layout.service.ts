import { Injectable } from '@angular/core';
import { Breadcrumb } from '../types/breadcrumb';
import { Subject } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public $breadcrumbs: Subject<Array<Breadcrumb>> = new Subject<
    Array<Breadcrumb>
  >();

  constructor(private title: Title, private meta: Meta) {}

  setTitle(list?: string[] | string): void {
    const siteName = 'Plezanje.net';

    this.title.setTitle(
      list != null
        ? `${Array.isArray(list) ? list.join(' · ') : list} · ${siteName}`
        : `${siteName} · Slovenska plezalna platforma`
    );
  }

  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }
}
