import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePicturesComponent } from './route-pictures.component';

describe('RoutePicturesComponent', () => {
  let component: RoutePicturesComponent;
  let fixture: ComponentFixture<RoutePicturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoutePicturesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
