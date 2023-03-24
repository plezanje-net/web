import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { CragComponent } from './pages/crag/crag.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NgxMaskModule } from 'ngx-mask';
import { ContributionsComponent } from './pages/contributions/contributions.component';
import { PublishStatusChangeDialogComponent } from './pages/contributions/publish-status-change-dialog/publish-status-change-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { ContributionComponent } from './pages/contributions/contribution/contribution.component';
import { CountriesComponent } from './pages/countries/countries.component';
import { AreasComponent } from './pages/areas/areas.component';
import { AreaFormComponent } from './forms/area-form/area-form.component';
import { MoveSectorFormComponent } from './forms/move-sector-form/move-sector-form.component';
import { MoveRouteFormComponent } from './forms/move-route-form/move-route-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    CragComponent,
    CragFormComponent,
    SectorFormComponent,
    RouteFormComponent,
    CragSectorsComponent,
    CragSectorRoutesComponent,
    ContributionsComponent,
    PublishStatusChangeDialogComponent,
    ContributionComponent,
    CountriesComponent,
    AreasComponent,
    AreaFormComponent,
    MoveSectorFormComponent,
    MoveRouteFormComponent,
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
    MatAutocompleteModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    NgxMaskModule.forRoot(),
    SharedModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    ManagementRoutingModule,
    MatCardModule,
  ],
})
export class ManagementModule {}
