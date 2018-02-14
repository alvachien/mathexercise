import { CanvasCellPositionInf } from './uicommon';
import { MineSweeper } from './minesweeper';

describe('MineSweeper without TestBed', () => {
  let mineService: MineSweeper;

  beforeEach(() => {
    mineService = new MineSweeper();
  });

  it('#1. ensure init() run succeed', () => {
    mineService.init();

    expect(mineService.IsMineGenerated).toBe(false);

    expect(mineService.cells.length).toBe(mineService.Width);

    for (let i = 0; i < mineService.Width; i ++) {
      expect(mineService.cells[i].length).toBe(mineService.Height);
    }
  });

  it('#2. ensure generateMines() with easy mode run succeed', () => {
    mineService.Width = 9;
    mineService.Height = 9;
    mineService.TotalMines = 9;
    mineService.init();

    const firstpos: CanvasCellPositionInf = { row: Math.round(mineService.Width / 2), column: Math.round(mineService.Height / 2) };
    mineService.generateMines(firstpos);

    expect(mineService.IsMineGenerated).toBe(true);

    let minecnt = 0;
    for (let i = 0; i < mineService.Width; i++) {
      for (let j = 0; j < mineService.Height; j++) {
        if (mineService.isAMineCell({row: i, column: j})) {
          minecnt ++;
        }
      }
    }

    expect(minecnt).toBe(mineService.TotalMines);
  });

  it('#3. ensure generateMines() with hard mode run succeed', () => {
    mineService.Width = 30;
    mineService.Height = 16;
    mineService.TotalMines = 99;
    mineService.init();

    const firstpos: CanvasCellPositionInf = { row: Math.round(mineService.Width / 2), column: Math.round(mineService.Height / 2) };
    mineService.generateMines(firstpos);

    expect(mineService.IsMineGenerated).toBe(true);

    let minecnt = 0;
    for (let i = 0; i < mineService.Width; i++) {
      for (let j = 0; j < mineService.Height; j++) {
        if (mineService.isAMineCell({row: i, column: j})) {
          minecnt ++;
        }
      }
    }

    expect(minecnt).toBe(mineService.TotalMines);
  });
});
