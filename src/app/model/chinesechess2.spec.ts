import { ChineseChessUI, ChineseChess2Play } from './chinesechess2';

describe('ChineseChess without TestBed', () => {
  let playService: ChineseChess2Play;
  let util: ChineseChessUI;

  beforeEach(() => {
      util = new ChineseChessUI();
      playService = new ChineseChess2Play();
    });

  it('#1. ensure init() run succeed', () => {
    playService.init(util);

    expect(playService.map.length).toBeGreaterThan(0);
  });

  it('#2. ensure init() run succeed', () => {
    playService.init(util);

    expect(playService.map.length).toBeGreaterThan(0);
  });
});
