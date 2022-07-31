import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { DifficultyVotesComponent } from './pages/difficulty-votes/difficulty-votes.component';
import { AscentsComponent } from './pages/ascents/ascents.component';
import { StatisticsHomeComponent } from './pages/statistics-home/statistics-home.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsHomeComponent,
  },
  {
    path: 'ocene',
    component: DifficultyVotesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vzponi',
    component: AscentsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsRoutingModule {}
