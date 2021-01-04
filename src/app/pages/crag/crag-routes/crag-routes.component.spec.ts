import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragRoutesComponent } from './crag-routes.component';

describe('CragRoutesComponent', () => {
  let component: CragRoutesComponent;
  let fixture: ComponentFixture<CragRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
