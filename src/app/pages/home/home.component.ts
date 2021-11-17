import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { Crag, Route } from 'src/generated/graphql';

// const searchGQL = gql`
//   query crags($search: String) {
//     crags(search: $search) {
//       id
//       name
//       country {
//         slug
//       }
//       slug
//     }
//   }
// `;

// const searchRouteGQL = gql`
//   query routes($search: String!) {
//     routes(search: $search) {
//       id
//       name
//     }
//   }
// `;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private layoutService: LayoutService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.layoutService.$breadcrumbs.next([
      {
        name: 'Prva stran',
      },
    ]);
  }

  login() {
    this.authService.openLogin$.next({
      message:
        'Prijavite se za pregled svojega dnevnika ali oddajanje komentarjev.',
    });
  }
}
