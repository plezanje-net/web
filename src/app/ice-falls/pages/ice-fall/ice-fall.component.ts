import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  Area,
  Comment,
  IceFall,
  IceFallBySlugGQL,
  IceFallBySlugQuery,
} from '../../../../generated/graphql';
import { LayoutService } from '../../../services/layout.service';
import { DataError } from '../../../types/data-error';
import { IceFallsBreadcrumbs } from '../../utils/ice-falls-breadcrumbs';

@Component({
  selector: 'app-ice-fall',
  templateUrl: './ice-fall.component.html',
  styleUrls: ['./ice-fall.component.scss'],
})
export class IceFallComponent implements OnInit {
  loading: boolean = true;
  error: DataError = null;
  iceFall: IceFall;
  comments: Comment[];
  conditions: Comment[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private iceFallBySlugGQL: IceFallBySlugGQL
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.iceFallBySlugGQL
        .watch({
          slug: params.icefall,
        })
        .valueChanges.subscribe((result) => {
          this.loading = false;

          if (result.errors != null) {
            this.queryError(result.errors);
          } else {
            this.querySuccess(result.data);
          }
        });
    });
  }

  queryError(errors: any): void {
    if (errors.length > 0 && errors[0].message === 'entity_not_found') {
      this.error = {
        message: 'Slap ne obstaja v bazi.',
      };

      return;
    }

    this.error = {
      message: 'Prišlo je do nepričakovane napake pri zajemu podatkov.',
    };
  }

  querySuccess(data: IceFallBySlugQuery): void {
    this.iceFall = <IceFall>data.iceFallBySlug;
    this.comments = this.iceFall?.comments.filter(
      (comment) => comment.type === 'comment'
    );

    this.conditions = this.iceFall?.comments.filter(
      (comment) => comment.type === 'condition'
    );

    this.layoutService.$breadcrumbs.next(
      new IceFallsBreadcrumbs(
        <Area>this.iceFall.area,
        <IceFall>this.iceFall
      ).build()
    );
  }
}
