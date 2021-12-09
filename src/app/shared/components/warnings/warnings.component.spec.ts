import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningsComponent } from './warnings.component';

describe('WarningsComponent', () => {
  let component: WarningsComponent;
  let fixture: ComponentFixture<WarningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarningsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
