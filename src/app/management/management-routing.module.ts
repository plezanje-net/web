import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { CragSectorRoutesComponent } from './pages/crag-sector-routes/crag-sector-routes.component';
import { CragSectorsComponent } from './pages/crag-sectors/crag-sectors.component';
import { CragComponent } from './pages/crag/crag.component';

const routes: Routes = [
  {
    path: 'uredi-plezalisce/:crag',
    component: CragComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'uredi-plezalisce/:crag/sektorji',
    component: CragSectorsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'uredi-sektor/:sector',
    component: CragSectorRoutesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dodaj-plezalisce',
    component: CragComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
