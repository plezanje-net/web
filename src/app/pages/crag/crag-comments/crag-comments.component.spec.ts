import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragCommentsComponent } from './crag-comments.component';

describe('CragCommentsComponent', () => {
  let component: CragCommentsComponent;
  let fixture: ComponentFixture<CragCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
