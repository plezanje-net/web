import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultyVotesComponent } from './difficulty-votes.component';

describe('DifficultyVotesComponent', () => {
  let component: DifficultyVotesComponent;
  let fixture: ComponentFixture<DifficultyVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifficultyVotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DifficultyVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
