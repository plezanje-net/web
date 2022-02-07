import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragSectorsComponent } from './crag-sectors.component';

describe('CragSectorsComponent', () => {
  let component: CragSectorsComponent;
  let fixture: ComponentFixture<CragSectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CragSectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
