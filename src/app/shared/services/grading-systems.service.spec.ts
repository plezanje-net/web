import { TestBed } from '@angular/core/testing';

import { GradingSystemsService } from './grading-systems.service';

describe('GradingSystemsService', () => {
  let service: GradingSystemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradingSystemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
