import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IceFallsRoutingModule } from './ice-falls-routing.module';
import { AreasComponent } from './pages/areas/areas.component';
import { IceFallComponent } from './pages/ice-fall/ice-fall.component';
import { SharedModule } from '../shared/shared.module';
import { AreasTocComponent } from './pages/areas/areas-toc/areas-toc.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { AreasLevelComponent } from './pages/areas/areas-level/areas-level.component';
import { NrIceFallsPipe } from './pages/areas/areas-level/nr-ice-falls.pipe';
import { AreaComponent } from './pages/area/area.component';
import { IceFallInfoComponent } from './pages/ice-fall/ice-fall-info/ice-fall-info.component';

@NgModule({
  declarations: [
    AreasComponent,
    IceFallComponent,
    AreasTocComponent,
    AreasLevelComponent,
    NrIceFallsPipe,
    AreaComponent,
    IceFallInfoComponent,
  ],
  imports: [
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    CommonModule,
    SharedModule,
    IceFallsRoutingModule,
  ],
})
export class IceFallsModule {}
