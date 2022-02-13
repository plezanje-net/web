import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IceFallsRoutingModule } from './ice-falls-routing.module';
import { CountryComponent } from './pages/country/country.component';
import { IceFallComponent } from './pages/ice-fall/ice-fall.component';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { IceFallInfoComponent } from './pages/ice-fall/ice-fall-info/ice-fall-info.component';
import { IceFallCommentsComponent } from './pages/ice-fall/ice-fall-comments/ice-fall-comments.component';

@NgModule({
  declarations: [
    CountryComponent,
    IceFallComponent,
    IceFallInfoComponent,
    IceFallCommentsComponent,
  ],
  imports: [
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    CommonModule,
    SharedModule,
    IceFallsRoutingModule,
  ],
})
export class IceFallsModule {}
