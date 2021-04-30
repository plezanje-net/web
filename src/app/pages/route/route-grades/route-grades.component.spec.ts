import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteGradesComponent } from './route-grades.component';

describe('RouteGradesComponent', () => {
  let component: RouteGradesComponent;
  let fixture: ComponentFixture<RouteGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
