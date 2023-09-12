import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragActivityRouteRowComponent } from './crag-activity-route-row.component';

describe('CragActivityRouteRowComponent', () => {
  let component: CragActivityRouteRowComponent;
  let fixture: ComponentFixture<CragActivityRouteRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CragActivityRouteRowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragActivityRouteRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
