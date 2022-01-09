import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasTocComponent } from './areas-toc.component';

describe('AreasTocComponent', () => {
  let component: AreasTocComponent;
  let fixture: ComponentFixture<AreasTocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreasTocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
