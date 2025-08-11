import { TestBed } from '@angular/core/testing';

import { EndPoints } from './end-points';

describe('EndPoints', () => {
  let service: EndPoints;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndPoints);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
