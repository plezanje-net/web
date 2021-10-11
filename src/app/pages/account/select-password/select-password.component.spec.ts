import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPasswordComponent } from './select-password.component';

describe('SelectPasswordComponent', () => {
  let component: SelectPasswordComponent;
  let fixture: ComponentFixture<SelectPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPasswordComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
