import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteCommentsComponent } from './route-comments.component';

describe('RouteCommentsComponent', () => {
  let component: RouteCommentsComponent;
  let fixture: ComponentFixture<RouteCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
