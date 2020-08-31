import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CragsComponent } from './pages/crags/crags.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  // {
  //   path: 'plezalisca',
  //   component: CragsCountriesPageComponent,
  // },
  {
    path: 'plezalisca/:country',
    component: CragsComponent,
  },
  // {
  //   path: 'plezalisca/:country/:area/:crag',
  //   component: CragPageComponent,
  // },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
