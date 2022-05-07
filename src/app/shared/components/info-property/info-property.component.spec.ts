import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPropertyComponent } from './info-property.component';

describe('InfoPropertyComponent', () => {
  let component: InfoPropertyComponent;
  let fixture: ComponentFixture<InfoPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
