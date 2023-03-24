import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveRouteFormComponent } from './move-route-form.component';

describe('MoveRouteFormComponent', () => {
  let component: MoveRouteFormComponent;
  let fixture: ComponentFixture<MoveRouteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveRouteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveRouteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
