import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragsComponent } from './crags.component';

describe('CragsComponent', () => {
  let component: CragsComponent;
  let fixture: ComponentFixture<CragsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
