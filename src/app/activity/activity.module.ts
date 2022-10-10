import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';

import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivityLogComponent } from './pages/activity-log/activity-log.component';
import { ActivityRoutesComponent } from './pages/activity-routes/activity-routes.component';
import { ActivityStatisticsComponent } from './pages/activity-statistics/activity-statistics.component';
import { ActivityEntryComponent } from './pages/activity-entry/activity-entry.component';
import { ActivityInputComponent } from './pages/activity-input/activity-input.component';
import { ActivityHeaderComponent } from './partials/activity-header/activity-header.component';
import { ActivityRouteRowComponent } from './partials/activity-route-row/activity-route-row.component';
import { ActivityRowComponent } from './partials/activity-row/activity-row.component';
import { ActivityFormRouteComponent } from './forms/activity-form/activity-form-route/activity-form-route.component';
import { ActivityFormComponent } from './forms/activity-form/activity-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivityEntryRoutesComponent } from './partials/activity-entry-routes/activity-entry-routes.component';
import { DryRunActivityDialogComponent } from './forms/activity-form/dry-run-activity-dialog/dry-run-activity-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ActivityLogComponent,
    ActivityRoutesComponent,
    ActivityStatisticsComponent,
    ActivityEntryComponent,
    ActivityInputComponent,
    ActivityHeaderComponent,
    ActivityRouteRowComponent,
    ActivityRowComponent,
    ActivityFormComponent,
    ActivityFormRouteComponent,
    ActivityEntryRoutesComponent,
    DryRunActivityDialogComponent,
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
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    SharedModule,
    ReactiveFormsModule,
    ActivityRoutingModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY',
        },
        display: {
          dateInput: 'DD.MM.YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class ActivityModule {}
