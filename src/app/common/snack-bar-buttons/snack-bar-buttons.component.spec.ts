import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarButtonsComponent } from './snack-bar-buttons.component';

describe('SnackbarButtonsComponent', () => {
  let component: SnackBarButtonsComponent;
  let fixture: ComponentFixture<SnackBarButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnackBarButtonsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
