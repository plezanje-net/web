import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './layout/header/header.component';
import { CragsComponent } from './pages/crags/crags.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { DataErrorComponent } from './layout/data-error/data-error.component';
import { GraphQLModule } from './graphql/graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CragsTocComponent } from './pages/crags/crags-toc/crags-toc.component';
import { GradeComponent } from './common/grade/grade.component';
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
import { CragFormComponent } from './forms/crag-form/crag-form.component';
import { MapComponent } from './common/map/map.component';
import { CragRoutesComponent } from './pages/crag/crag-routes/crag-routes.component';
import { CragInfoComponent } from './pages/crag/crag-info/crag-info.component';
import { CragCommentsComponent } from './pages/crag/crag-comments/crag-comments.component';
import { MomentModule } from 'ngx-moment';
import { CragLocationComponent } from './pages/crag/crag-location/crag-location.component';
import { CragWarningsComponent } from './pages/crag/crag-warnings/crag-warnings.component';
import { SnackBarButtonsComponent } from './common/snack-bar-buttons/snack-bar-buttons.component';
import { ActivityFormComponent } from './forms/activity-form/activity-form.component';
import { ActivityFormRouteComponent } from './forms/activity-form/activity-form-route/activity-form-route.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { CragGalleryComponent } from './pages/crag/crag-gallery/crag-gallery.component';
import { CommentFormComponent } from './forms/comment-form/comment-form.component';
import { EditorComponent } from './forms/editor/editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CommentComponent } from './common/comment/comment.component';
import { CommentOptionsComponent } from './common/comment/comment-options/comment-options.component';
import { ConfirmationDialogComponent } from './common/confirmation-dialog/confirmation-dialog.component';
import { RouteComponent } from './pages/route/route.component';
import { RouteInfoComponent } from './pages/route/route-info/route-info.component';
import { DistributionChartComponent } from './common/distribution-chart/distribution-chart.component';
import { RouteCommentsComponent } from './pages/route/route-comments/route-comments.component';
import { RouteGradesComponent } from './pages/route/route-grades/route-grades.component';
import { ActivityLogComponent } from './pages/activity/activity-log/activity-log.component';
import { ActivityRoutesComponent } from './pages/activity/activity-routes/activity-routes.component';
import { ActivityStatisticsComponent } from './pages/activity/activity-statistics/activity-statistics.component';
import { ActivityHeaderComponent } from './pages/activity/partials/activity-header/activity-header.component';
import { CragImageComponent } from './pages/crag/crag-image/crag-image.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { ClubComponent } from './pages/club/club.component';
import { ClubMemberFormComponent } from './forms/club-member-form/club-member-form.component';
import { AscentTypeComponent } from './common/ascent-type/ascent-type.component';
import { AscentPublishOptionComponent } from './common/ascent-publish-option/ascent-publish-option.component';
import { ActivityRouteRowComponent } from './pages/activity/partials/activity-route-row/activity-route-row.component';
import { ActivityRowComponent } from './pages/activity/partials/activity-row/activity-row.component';
import { MaterialElevationDirective } from './shared/directives/material-elevation.directive';
import { MatListModule } from '@angular/material/list';
import { ActivityEntryComponent } from './pages/activity/activity-entry/activity-entry.component';

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
    LoaderComponent,
    DataErrorComponent,
    CragsTocComponent,
    GradeComponent,
    CragComponent,
    LoginComponent,
    ProfileComponent,
    PasswordRecoveryComponent,
    RegisterComponent,
    ConfirmAccountComponent,
    SelectPasswordComponent,
    CragFormComponent,
    MapComponent,
    CragRoutesComponent,
    CragInfoComponent,
    CragCommentsComponent,
    CragLocationComponent,
    CragWarningsComponent,
    SnackBarButtonsComponent,
    ActivityFormComponent,
    ActivityFormRouteComponent,
    CragGalleryComponent,
    CommentFormComponent,
    EditorComponent,
    CommentComponent,
    CommentOptionsComponent,
    ConfirmationDialogComponent,
    RouteComponent,
    RouteInfoComponent,
    DistributionChartComponent,
    RouteCommentsComponent,
    RouteGradesComponent,
    ActivityLogComponent,
    ActivityRoutesComponent,
    ActivityStatisticsComponent,
    ActivityHeaderComponent,
    CragImageComponent,
    ClubsComponent,
    ClubComponent,
    ClubMemberFormComponent,
    AscentTypeComponent,
    AscentPublishOptionComponent,
    ActivityRouteRowComponent,
    ActivityRowComponent,
    MaterialElevationDirective,
    ActivityEntryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    GraphQLModule,
    HttpClientModule,
    MatMomentDateModule,
    MomentModule,
    MatCardModule,
    EditorModule,
    MatListModule,
  ],
  providers: [
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
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
