import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CragsComponent } from './pages/crags/crags.component';
import { HomeComponent } from './pages/home/home.component';
import { CragComponent } from './pages/crag/crag.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './pages/account/register/register.component';
import { ConfirmAccountComponent } from './pages/account/confirm-account/confirm-account.component';
import { SelectPasswordComponent } from './pages/account/select-password/select-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'registracija',
    component: RegisterComponent,
  },
  {
    path: 'moj-profil',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'aktivacija/:id/:token',
    component: ConfirmAccountComponent
  },
  {
    path: 'menjava-gesla/:id/:token',
    component: SelectPasswordComponent
  },
  {
    path: 'plezalisca',
    redirectTo: "plezalisca/slovenija",
    pathMatch: "full"
  },
  {
    path: 'plezalisca/:country',
    component: CragsComponent,
  },
  {
    path: 'plezalisca/:country/:crag',
    component: CragComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
