import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './pages/country/country.component';
import { IceFallComponent } from './pages/ice-fall/ice-fall.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'drzava/slovenija',
    pathMatch: 'full',
  },
  {
    path: 'drzava/:country',
    component: CountryComponent,
  },
  {
    path: 'slap/:icefall',
    component: IceFallComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IceFallsRoutingModule {}
