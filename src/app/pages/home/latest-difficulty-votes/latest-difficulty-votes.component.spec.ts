import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestDifficultyVotesComponent } from './latest-difficulty-votes.component';

describe('LatestDifficultyVotesComponent', () => {
  let component: LatestDifficultyVotesComponent;
  let fixture: ComponentFixture<LatestDifficultyVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestDifficultyVotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestDifficultyVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
