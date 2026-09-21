import { TestBed } from '@angular/core/testing';
import { Nominatim } from './nominatim';

describe('Nominatim', () => {
  let service: Nominatim;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nominatim);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
