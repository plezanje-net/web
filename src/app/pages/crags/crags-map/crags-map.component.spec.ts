import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragsMapComponent } from './crags-map.component';

describe('CragsMapComponent', () => {
  let component: CragsMapComponent;
  let fixture: ComponentFixture<CragsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
