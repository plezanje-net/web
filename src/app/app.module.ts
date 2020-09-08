import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { HttpClientModule } from '@angular/common/http';
import { CragsTocComponent } from './pages/crags/crags-toc/crags-toc.component';
import { CragsMapComponent } from './pages/crags/crags-map/crags-map.component';
import { GradeComponent } from './common/grade/grade.component';
import { CragComponent } from './pages/crag/crag.component';



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
    CragComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
