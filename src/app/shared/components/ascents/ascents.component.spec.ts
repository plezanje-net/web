import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscentsComponent } from './ascents.component';

describe('AscentsComponent', () => {
  let component: AscentsComponent;
  let fixture: ComponentFixture<AscentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AscentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
