import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentOptionsComponent } from './comment-options.component';

describe('CommentOptionsComponent', () => {
  let component: CommentOptionsComponent;
  let fixture: ComponentFixture<CommentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentOptionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
