import { Gobang } from './gobang';

describe('Gobang without TestBed', () => {
  let gobang: Gobang;

  beforeEach(() => { gobang = new Gobang(); });

  it('#1. ensure init() run succeed', () => {
    gobang.Dimension = 20;
    gobang.init();

    expect(gobang.cells.length).toBe(gobang.Dimension);

    for (let i = 0; i < gobang.Dimension; i++) {
      expect(gobang.cells[i].length).toBe(gobang.Dimension);
    }
  });

  it('#2. Queue position for first user input', () => {
    gobang.Dimension = 20;
    gobang.init();

    gobang.setCellValue(Math.round(gobang.Dimension / 2), Math.round(gobang.Dimension / 2), true);

    expect(gobang.QueuePositions.length).toBe(1);
    expect(gobang.QueuePositions[0].x).toBe(Math.round(gobang.Dimension / 2));
    expect(gobang.QueuePositions[0].y).toBe(Math.round(gobang.Dimension / 2));
  });

  it('#3. Queue position for multiple inputs', () => {
    gobang.Dimension = 20;
    gobang.init();

    gobang.setCellValue(Math.round(gobang.Dimension / 2), Math.round(gobang.Dimension / 2), true);

    expect(gobang.QueuePositions.length).toBe(1);
    expect(gobang.QueuePositions[0].x).toBe(Math.round(gobang.Dimension / 2));
    expect(gobang.QueuePositions[0].y).toBe(Math.round(gobang.Dimension / 2));
  });
});
