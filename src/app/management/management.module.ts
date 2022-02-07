import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { CragComponent } from './pages/crag/crag.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { SectorFormComponent } from './forms/sector-form/sector-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouteFormComponent } from './forms/route-form/route-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { CragFormComponent } from './forms/crag-form/crag-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CragSectorsComponent } from './pages/crag-sectors/crag-sectors.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { CragSectorRoutesComponent } from './pages/crag-sector-routes/crag-sector-routes.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';

@NgModule({
  declarations: [
    CragComponent,
    CragFormComponent,
    SectorFormComponent,
    RouteFormComponent,
    CragSectorsComponent,
    CragSectorRoutesComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    NgxMaskModule.forRoot(),
    SharedModule,
    DragDropModule,
    ReactiveFormsModule,
    ManagementRoutingModule,
  ],
})
export class ManagementModule {}
