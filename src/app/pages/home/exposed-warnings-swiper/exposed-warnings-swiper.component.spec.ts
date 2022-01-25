import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposedWarningsSwiperComponent } from './exposed-warnings-swiper.component';

describe('ExposedWarningsSwiperComponent', () => {
  let component: ExposedWarningsSwiperComponent;
  let fixture: ComponentFixture<ExposedWarningsSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExposedWarningsSwiperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposedWarningsSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
