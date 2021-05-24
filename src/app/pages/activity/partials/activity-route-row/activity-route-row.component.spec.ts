import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRouteRowComponent } from './activity-route-row.component';

describe('ActivityRouteRowComponent', () => {
  let component: ActivityRouteRowComponent;
  let fixture: ComponentFixture<ActivityRouteRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityRouteRowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRouteRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
