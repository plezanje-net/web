import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatFormFieldModule,
  MatFormFieldDefaultOptions,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './layout/header/header.component';
import { CragsComponent } from './pages/crags/crags.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { GraphQLModule } from './graphql/graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CragsTocComponent } from './pages/crags/crags-toc/crags-toc.component';
import { CragComponent } from './pages/crag/crag.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordRecoveryComponent } from './auth/password-recovery/password-recovery.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { ConfirmAccountComponent } from './pages/account/confirm-account/confirm-account.component';
import { SelectPasswordComponent } from './pages/account/select-password/select-password.component';
import { MapComponent } from './common/map/map.component';
import { CragRoutesComponent } from './pages/crag/crag-routes/crag-routes.component';
import { CragInfoComponent } from './pages/crag/crag-info/crag-info.component';
import { CragCommentsComponent } from './pages/crag/crag-comments/crag-comments.component';
import {
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { CragGalleryComponent } from './pages/crag/crag-gallery/crag-gallery.component';
import { RouteComponent } from './pages/route/route.component';
import { RouteInfoComponent } from './pages/route/route-info/route-info.component';
import { DistributionChartComponent } from './common/distribution-chart/distribution-chart.component';
import { RouteCommentsComponent } from './pages/route/route-comments/route-comments.component';
import { RouteGradesComponent } from './pages/route/route-grades/route-grades.component';
import { CragImageComponent } from './pages/crag/crag-image/crag-image.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClubMemberFormComponent } from './forms/club-member-form/club-member-form.component';
import { MaterialElevationDirective } from './shared/directives/material-elevation.directive';
import { MatListModule } from '@angular/material/list';
import { ClubComponent } from './pages/club/club.component';
import { ClubMembersComponent } from './pages/club/club-members/club-members.component';
import { ClubActivityRoutesComponent } from './pages/club/club-activity-routes/club-activity-routes.component';
import { ClubFormComponent } from './forms/club-form/club-form.component';
import { SharedModule } from './shared/shared.module';
import { SearchComponent } from './pages/search/search.component';
import { SearchResultsComponent } from './pages/search/search-results/search-results.component';
import { PopularCragsComponent } from './pages/home/popular-crags/popular-crags.component';
import { PopularCragsCardComponent } from './pages/home/popular-crags/popular-crags-card/popular-crags-card.component';
import { LatestTicksComponent } from './pages/home/latest-ticks/latest-ticks.component';
import { LatestImagesComponent } from './pages/home/latest-images/latest-images.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImageFullComponent } from './common/image-full/image-full.component';
import { ExposedWarningsComponent } from './pages/home/exposed-warnings/exposed-warnings.component';
import { CragRoutePreviewComponent } from './pages/crag/crag-route-preview/crag-route-preview.component';
import { ConfirmClubMembershipComponent } from './pages/club/confirm-club-membership/confirm-club-membership.component';
import { SwiperModule } from 'swiper/angular';
import { AlpinismComponent } from './pages/alpinism/alpinism.component';
import { AboutComponent } from './pages/about/about.component';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';

const formFieldAppearance: MatFormFieldDefaultOptions = {
  appearance: 'fill',
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CragsComponent,
    HomeComponent,
    NotFoundComponent,
    BreadcrumbsComponent,
    CragsTocComponent,
    CragComponent,
    LoginComponent,
    ProfileComponent,
    PasswordRecoveryComponent,
    RegisterComponent,
    ConfirmAccountComponent,
    SelectPasswordComponent,
    MapComponent,
    CragRoutesComponent,
    CragInfoComponent,
    CragCommentsComponent,
    CragGalleryComponent,
    RouteComponent,
    RouteInfoComponent,
    DistributionChartComponent,
    RouteCommentsComponent,
    RouteGradesComponent,
    CragImageComponent,
    ClubsComponent,
    ClubMemberFormComponent,
    MaterialElevationDirective,
    ClubComponent,
    ClubMembersComponent,
    ClubActivityRoutesComponent,
    ClubFormComponent,
    SearchComponent,
    SearchResultsComponent,
    PopularCragsComponent,
    PopularCragsCardComponent,
    LatestTicksComponent,
    LatestImagesComponent,
    ImageFullComponent,
    ExposedWarningsComponent,
    CragRoutePreviewComponent,
    ConfirmClubMembershipComponent,
    AlpinismComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    GraphQLModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatCardModule,
    MatListModule,
    NgxMatSelectSearchModule,
    SharedModule,
    MatGridListModule,
    AppRoutingModule,
    SwiperModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    AuthGuard,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: formFieldAppearance,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY',
        },
        display: {
          dateInput: 'DD.MM.YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'sl-SI' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
