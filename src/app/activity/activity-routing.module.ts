import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ActivityEntryComponent } from './pages/activity-entry/activity-entry.component';
import { ActivityInputComponent } from './pages/activity-input/activity-input.component';
import { ActivityLogComponent } from './pages/activity-log/activity-log.component';
import { ActivityRoutesComponent } from './pages/activity-routes/activity-routes.component';
import { ActivityStatisticsComponent } from './pages/activity-statistics/activity-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityLogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vzponi',
    component: ActivityRoutesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'statistika',
    component: ActivityStatisticsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vpis',
    component: ActivityInputComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'uredi/:id',
    component: ActivityEntryComponent,
    canActivate: [AuthGuard],
    data: {
      type: 'edit',
    },
  },
  {
    path: ':id',
    component: ActivityEntryComponent,
    canActivate: [AuthGuard],
    data: {
      type: 'view',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}
