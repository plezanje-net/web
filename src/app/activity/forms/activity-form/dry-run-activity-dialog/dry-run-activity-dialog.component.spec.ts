import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DryRunActivityDialogComponent } from './dry-run-activity-dialog.component';

describe('DryRunActivityDialogComponent', () => {
  let component: DryRunActivityDialogComponent;
  let fixture: ComponentFixture<DryRunActivityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DryRunActivityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DryRunActivityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
