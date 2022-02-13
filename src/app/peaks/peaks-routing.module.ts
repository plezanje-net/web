import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeakCragsComponent } from './peak-crags/peak-crags.component';
import { PeaksCountriesComponent } from './peaks-countries/peaks-countries.component';
import { PeaksCountryComponent } from './peaks-country/peaks-country.component';

const routes: Routes = [
  {
    path: 'drzave',
    component: PeaksCountriesComponent,
  },
  {
    path: 'drzava/:country',
    component: PeaksCountryComponent,
  },
  {
    path: 'vrh/:peak',
    component: PeakCragsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeaksRoutingModule {}
