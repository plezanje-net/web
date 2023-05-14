import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsHistoryComponent } from './comments-history.component';

describe('CommentsHistoryComponent', () => {
  let component: CommentsHistoryComponent;
  let fixture: ComponentFixture<CommentsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
