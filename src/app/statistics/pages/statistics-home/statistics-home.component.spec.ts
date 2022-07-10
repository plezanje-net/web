import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsHomeComponent } from './statistics-home.component';

describe('StatisticsHomeComponent', () => {
  let component: StatisticsHomeComponent;
  let fixture: ComponentFixture<StatisticsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
