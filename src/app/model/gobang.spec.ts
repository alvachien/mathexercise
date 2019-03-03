import { Gobang } from './gobang';
import { MatrixPosIntf } from 'actslib';

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
    expect(gobang.QueuePositions[0].row).toBe(Math.round(gobang.Dimension / 2));
    expect(gobang.QueuePositions[0].column).toBe(Math.round(gobang.Dimension / 2));
  });

  it('#3. Queue position for 5 inputs', () => {
    gobang.Dimension = 20;
    gobang.init();

    const arPos: MatrixPosIntf[] = [];
    let pos: MatrixPosIntf;
    for (let i = 0; i < 5; i ++) {
      do {
        pos = { row: Math.floor(Math.random() * gobang.Dimension), column: Math.floor(Math.random() * gobang.Dimension), };

        const idx: number = arPos.findIndex((value: MatrixPosIntf) => {
          if (value.row === pos.row && value.column === pos.column) {
            return true;
          }
          return false;
        });

        if (idx === -1) {
          arPos.push(pos);
          break;
        }
      } while (true);
    }

    for (let i = 0; i < 5; i ++) {
      gobang.setCellValue(arPos[i].row, arPos[i].column, (i % 2) === 0 ? true : false);
    }

    expect(gobang.QueuePositions.length).toBe(5);
  });

  it('#4. check PlayerAnalysisResult for 1 player input', () => {
    gobang.Dimension = 20;
    gobang.init();

    const pos: MatrixPosIntf = {
      row: 4, column: 6,
    };
    gobang.setCellValue(pos.row, pos.column, true);
    gobang['buildUpAIAnalyis']();

    expect(gobang.PlayerAnalysisResult.length).toBe(4);
  });

  it('#5. check AIAnalysisResult for 1 AI input', () => {
    gobang.Dimension = 20;
    gobang.init();

    const pos: MatrixPosIntf = {
      row: 4, column: 6,
    };
    gobang.setCellValue(pos.row, pos.column, false);
    gobang['buildUpAIAnalyis']();

    expect(gobang.AIAnalysisResult.length).toBe(4);
  });
});
