import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IceFallInfoComponent } from './ice-fall-info.component';

describe('IceFallInfoComponent', () => {
  let component: IceFallInfoComponent;
  let fixture: ComponentFixture<IceFallInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IceFallInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IceFallInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
