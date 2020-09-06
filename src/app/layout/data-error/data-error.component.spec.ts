import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataErrorComponent } from './data-error.component';

describe('DataErrorComponent', () => {
  let component: DataErrorComponent;
  let fixture: ComponentFixture<DataErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
