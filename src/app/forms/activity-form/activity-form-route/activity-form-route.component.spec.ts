import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFormRouteComponent } from './activity-form-route.component';

describe('ActivityFormRouteComponent', () => {
  let component: ActivityFormRouteComponent;
  let fixture: ComponentFixture<ActivityFormRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityFormRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFormRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
