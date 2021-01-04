import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragWarningsComponent } from './crag-warnings.component';

describe('CragWarningsComponent', () => {
  let component: CragWarningsComponent;
  let fixture: ComponentFixture<CragWarningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragWarningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
