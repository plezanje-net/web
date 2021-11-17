import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragComponent } from './crag.component';

describe('CragComponent', () => {
  let component: CragComponent;
  let fixture: ComponentFixture<CragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
