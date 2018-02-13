import { Gobang } from './gobang';

describe('Gobang without TestBed', () => {
  let gobang: Gobang;

  beforeEach(() => { gobang = new Gobang(); });

  it('#1. ensure init() run succeed', () => {
    gobang.Dimension = 20;
    gobang.init();

    expect(gobang.cells.length).toBe(gobang.Dimension);
    
    for(let i = 0; i < gobang.Dimension; i++) {
      expect(gobang.cells[i].length).toBe(gobang.Dimension);
    }
  });
});
