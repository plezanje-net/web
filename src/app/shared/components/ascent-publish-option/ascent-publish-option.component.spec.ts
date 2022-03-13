import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AscentPublishOptionComponent } from './ascent-publish-option.component';

describe('AscentPublishOptionComponent', () => {
  let component: AscentPublishOptionComponent;
  let fixture: ComponentFixture<AscentPublishOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AscentPublishOptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AscentPublishOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
