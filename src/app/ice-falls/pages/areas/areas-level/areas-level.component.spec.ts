import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasLevelComponent } from './areas-level.component';

describe('AreasLevelComponent', () => {
  let component: AreasLevelComponent;
  let fixture: ComponentFixture<AreasLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreasLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
