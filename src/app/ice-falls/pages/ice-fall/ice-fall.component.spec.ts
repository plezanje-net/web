import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IceFallComponent } from './ice-fall.component';

describe('IceFallComponent', () => {
  let component: IceFallComponent;
  let fixture: ComponentFixture<IceFallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IceFallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IceFallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
