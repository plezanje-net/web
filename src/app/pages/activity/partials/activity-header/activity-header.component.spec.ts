import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityHeaderComponent } from './activity-header.component';

describe('ActivityHeaderComponent', () => {
  let component: ActivityHeaderComponent;
  let fixture: ComponentFixture<ActivityHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
