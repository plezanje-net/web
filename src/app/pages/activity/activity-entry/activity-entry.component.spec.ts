import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityEntryComponent } from './activity-entry.component';

describe('ActivityEntryComponent', () => {
  let component: ActivityEntryComponent;
  let fixture: ComponentFixture<ActivityEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
