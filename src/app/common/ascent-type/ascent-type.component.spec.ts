import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AscentTypeComponent } from './ascent-type.component';

describe('AscentTypeComponent', () => {
  let component: AscentTypeComponent;
  let fixture: ComponentFixture<AscentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AscentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AscentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
