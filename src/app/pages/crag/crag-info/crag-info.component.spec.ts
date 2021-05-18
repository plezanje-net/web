import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragInfoComponent } from './crag-info.component';

describe('CragInfoComponent', () => {
  let component: CragInfoComponent;
  let fixture: ComponentFixture<CragInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CragInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
