import { Area, IceFall } from '../../../generated/graphql';
import { Breadcrumb } from '../../types/breadcrumb';

export class IceFallsBreadcrumbs {
  area: Area;
  iceFall: IceFall;

  constructor(area: Area, iceFall?: IceFall) {
    this.area = area;
    this.iceFall = iceFall;
  }

  public build(): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    let area = this.area;
    let country =
      this.iceFall != null ? this.iceFall.country : this.area.country;

    if (this.iceFall != null) {
      breadcrumbs.push({
        name: this.iceFall.name,
        path: `/slapovi/${country.slug}/${area.slug}/${this.iceFall.slug}`,
      });
    }

    breadcrumbs.push({
      name: area.name,
      path: `/slapovi/${country.slug}/${area.slug}`,
    });

    while (area.area != null) {
      area = <Area>area.area;

      breadcrumbs.push({
        name: area.name,
        path: `/slapovi/${country.slug}/${area.slug}`,
      });
    }

    breadcrumbs.push({
      name: country.name,
      path: `/slapovi/${country.slug}`,
    });

    breadcrumbs.push({
      name: 'Slapovi',
      path: '/slapovi',
    });

    return breadcrumbs.reverse();
  }
}
