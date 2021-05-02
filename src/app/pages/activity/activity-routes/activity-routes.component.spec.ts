import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRoutesComponent } from './activity-routes.component';

describe('ActivityRoutesComponent', () => {
  let component: ActivityRoutesComponent;
  let fixture: ComponentFixture<ActivityRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
