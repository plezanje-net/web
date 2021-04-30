import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteInfoComponent } from './route-info.component';

describe('RouteInfoComponent', () => {
  let component: RouteInfoComponent;
  let fixture: ComponentFixture<RouteInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
