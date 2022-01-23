import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';
import { PeaksRoutingModule } from './peaks-routing.module';
import { PeaksCountriesComponent } from './peaks-countries/peaks-countries.component';
import { PeaksCountryComponent } from './peaks-country/peaks-country.component';
import { PeakCragsComponent } from './peak-crags/peak-crags.component';

@NgModule({
  declarations: [
    PeaksCountriesComponent,
    PeaksCountryComponent,
    PeakCragsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PeaksRoutingModule,
    MatCardModule,
    FlexLayoutModule,
  ],
})
export class PeaksModule {}
