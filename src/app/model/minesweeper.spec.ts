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

    expect(mineService.cells.length).toBe(mineService.Height);

    for (let i = 0; i < mineService.Height; i ++) {
      expect(mineService.cells[i].length).toBe(mineService.Width);
    }
  });

  it('#2. ensure generateMines() with easy mode run succeed', () => {
    mineService.Width = 9;
    mineService.Height = 9;
    mineService.TotalMines = 9;
    mineService.init();

    const firstpos: CanvasCellPositionInf = { row: Math.round(mineService.Height / 2), column: Math.round(mineService.Width / 2) };
    mineService.generateMines(firstpos);

    expect(mineService.IsMineGenerated).toBe(true);

    let minecnt = 0;
    for (let i = 0; i < mineService.Height; i++) {
      for (let j = 0; j < mineService.Width; j++) {
        if (mineService.isAMineCell({row: i, column: j,})) {
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

    const firstpos: CanvasCellPositionInf = { row: Math.floor(mineService.Height / 2), column: Math.floor(mineService.Width / 2) };
    mineService.generateMines(firstpos);

    expect(mineService.IsMineGenerated).toBe(true);

    let minecnt = 0;
    for (let i = 0; i < mineService.Height; i++) {
      for (let j = 0; j < mineService.Width; j++) {
        if (mineService.isAMineCell({row: i, column: j})) {
          minecnt ++;
        }
      }
    }

    expect(minecnt).toBe(mineService.TotalMines);

    expect(mineService.isAMineCell(firstpos)).toBe(false);
  });

  it('#4. check getAroundCells() and isInArray()', () => {
    mineService.Width = 30;
    mineService.Height = 16;
    mineService.TotalMines = 99;
    mineService.init();

    const firstpos: CanvasCellPositionInf = { row: 8, column: 15, };
    const aroundposes: CanvasCellPositionInf[] = mineService.getAroundCells(firstpos);

    expect(mineService.isInArray({row: 7, column: 14}, aroundposes)).toBe(true);
    expect(mineService.isInArray({row: 7, column: 15}, aroundposes)).toBe(true);
    expect(mineService.isInArray({row: 7, column: 16}, aroundposes)).toBe(true);
    expect(mineService.isInArray({row: 8, column: 14}, aroundposes)).toBe(true);
    expect(mineService.isInArray({row: 8, column: 16}, aroundposes)).toBe(true);
    expect(mineService.isInArray({row: 9, column: 14}, aroundposes)).toBe(true);
    expect(mineService.isInArray({row: 9, column: 15}, aroundposes)).toBe(true);
    expect(mineService.isInArray({row: 9, column: 16}, aroundposes)).toBe(true);
  });

  it('#5. check calcNumberOfMinesAround()', () => {
    mineService.Width = 30;
    mineService.Height = 16;
    mineService.TotalMines = 99;
    mineService.init();

    const firstpos: CanvasCellPositionInf = { row: 8, column: 15, };
    const aroundposes: CanvasCellPositionInf[] = mineService.getAroundCells(firstpos);
    mineService.generateMines(firstpos);

    let minecnt = 0;
    aroundposes.forEach((value: CanvasCellPositionInf) => {
      if (mineService.isAMineCell(value) === true) {
        minecnt ++;
      }
    });

    expect(mineService.calcNumberOfMinesAround(firstpos)).toBe(minecnt);
  });
});
