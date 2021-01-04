import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragLocationComponent } from './crag-location.component';

describe('CragLocationComponent', () => {
  let component: CragLocationComponent;
  let fixture: ComponentFixture<CragLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
