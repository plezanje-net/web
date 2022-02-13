import { Params } from '@angular/router';

export interface Breadcrumb {
  path?: string;
  params?: Params;
  name: string;
}
