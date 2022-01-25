import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CragRoutePreviewComponent } from './crag-route-preview.component';

describe('CragRoutePreviewComponent', () => {
  let component: CragRoutePreviewComponent;
  let fixture: ComponentFixture<CragRoutePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CragRoutePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CragRoutePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
