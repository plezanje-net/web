import { Area, Crag, IceFall } from '../../../generated/graphql';
import { Breadcrumb } from '../../types/breadcrumb';

export class CragAdminBreadcrumbs {
  crag: Crag;

  constructor(crag: Crag) {
    this.crag = crag;
  }

  public build(): Breadcrumb[] {
    return [
      {
        name: 'Plezališča',
        path: '/plezalisca',
      },
      {
        name: this.crag.country.name,
        path: `/plezalisca/${this.crag.country.slug}`,
      },
      {
        name: this.crag.name,
        path: `/plezalisca/${this.crag.country.slug}/${this.crag.slug}`,
      },
      {
        name: 'Urejanje plezališča',
      },
    ];
  }
}
