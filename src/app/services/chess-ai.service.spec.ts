import { TestBed, inject } from '@angular/core/testing';

import { ChessAiService } from './chess-ai.service';

describe('ChessAiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChessAiService]
    });
  });

  it('should be created', inject([ChessAiService], (service: ChessAiService) => {
    expect(service).toBeTruthy();
  }));
});
