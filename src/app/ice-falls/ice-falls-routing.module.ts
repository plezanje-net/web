import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './pages/country/country.component';
import { IceFallComponent } from './pages/ice-fall/ice-fall.component';

const routes: Routes = [
  {
    path: 'alpinizem/slapovi',
    redirectTo: 'alpinizem/slapovi/drzava/slovenija',
    pathMatch: 'full',
  },
  {
    path: 'alpinizem/slapovi/drzava/:country',
    component: CountryComponent,
  },
  {
    path: 'alpinizem/slapovi/slap/:icefall',
    component: IceFallComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IceFallsRoutingModule {}
