import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CragGalleryComponent } from './crag-gallery.component';

describe('CragGalleryComponent', () => {
  let component: CragGalleryComponent;
  let fixture: ComponentFixture<CragGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CragGalleryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CragGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
