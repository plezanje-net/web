import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToContributeComponent } from './how-to-contribute.component';

describe('HowToContributeComponent', () => {
  let component: HowToContributeComponent;
  let fixture: ComponentFixture<HowToContributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowToContributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToContributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
