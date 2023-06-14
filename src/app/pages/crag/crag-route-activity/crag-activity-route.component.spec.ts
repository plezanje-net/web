import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragActivityRouteComponent } from './crag-activity-route.component';

describe('CragActivityRouteComponent', () => {
  let component: CragActivityRouteComponent;
  let fixture: ComponentFixture<CragActivityRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CragActivityRouteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragActivityRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
