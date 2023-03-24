import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveSectorFormComponent } from './move-sector-form.component';

describe('MoveSectorFormComponent', () => {
  let component: MoveSectorFormComponent;
  let fixture: ComponentFixture<MoveSectorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveSectorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveSectorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
