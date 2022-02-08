import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CragSectorRoutesComponent } from './crag-sector-routes.component';

describe('CragSectorRoutesComponent', () => {
  let component: CragSectorRoutesComponent;
  let fixture: ComponentFixture<CragSectorRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CragSectorRoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CragSectorRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
