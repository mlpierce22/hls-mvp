import { TestBed } from '@angular/core/testing';

import { FetchStreamService } from './fetch-stream.service';

describe('FetchStreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FetchStreamService = TestBed.get(FetchStreamService);
    expect(service).toBeTruthy();
  });
});
