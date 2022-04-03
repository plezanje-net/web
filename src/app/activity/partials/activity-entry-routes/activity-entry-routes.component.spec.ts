import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityEntryRoutesComponent } from './activity-entry-routes.component';

describe('ActivityEntryRoutesComponent', () => {
  let component: ActivityEntryRoutesComponent;
  let fixture: ComponentFixture<ActivityEntryRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityEntryRoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityEntryRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
