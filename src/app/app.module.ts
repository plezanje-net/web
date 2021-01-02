import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

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
import { CragsMapComponent } from './pages/crags/crags-map/crags-map.component';
import { GradeComponent } from './common/grade/grade.component';
import { CragComponent } from './pages/crag/crag.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordRecoveryComponent } from './auth/password-recovery/password-recovery.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { ConfirmAccountComponent } from './pages/account/confirm-account/confirm-account.component';
import { SelectPasswordComponent } from './pages/account/select-password/select-password.component';
import { CragFormComponent } from './forms/crag-form/crag-form.component';

const formFieldAppearance: MatFormFieldDefaultOptions = {
  appearance: 'fill'
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
    CragsMapComponent,
    GradeComponent,
    CragComponent,
    LoginComponent,
    ProfileComponent,
    PasswordRecoveryComponent,
    RegisterComponent,
    ConfirmAccountComponent,
    SelectPasswordComponent,
    CragFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [AuthGuard, {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: formFieldAppearance
  }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
