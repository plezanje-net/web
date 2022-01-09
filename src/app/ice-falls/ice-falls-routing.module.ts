import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './pages/area/area.component';
import { AreasComponent } from './pages/areas/areas.component';
import { IceFallComponent } from './pages/ice-fall/ice-fall.component';

const routes: Routes = [
  {
    path: 'slapovi',
    redirectTo: 'slapovi/slovenija',
    pathMatch: 'full',
  },
  {
    path: 'slapovi/:country',
    component: AreasComponent,
  },
  {
    path: 'slapovi/:country/:area',
    component: AreaComponent,
  },
  {
    path: 'slapovi/:country/:area/:icefall',
    component: IceFallComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IceFallsRoutingModule {}
