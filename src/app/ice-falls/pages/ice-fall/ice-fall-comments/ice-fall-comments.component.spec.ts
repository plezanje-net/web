import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IceFallCommentsComponent } from './ice-fall-comments.component';

describe('IceFallCommentsComponent', () => {
  let component: IceFallCommentsComponent;
  let fixture: ComponentFixture<IceFallCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IceFallCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IceFallCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
