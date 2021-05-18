import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragsTocComponent } from './crags-toc.component';

describe('CragsTocComponent', () => {
  let component: CragsTocComponent;
  let fixture: ComponentFixture<CragsTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CragsTocComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragsTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
