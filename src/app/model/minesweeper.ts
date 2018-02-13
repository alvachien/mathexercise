import { MatrixPosIntf, workoutSlashEx } from './utility';
import { CanvasCellPositionInf } from './uicommon';

// Refer to https://github.com/liusaint/games/tree/master/mine

/**
 * Cell of minesweeper
 */
export class MineSweeperCell {
  isMine: boolean;
  isOpened: boolean;
  tag: number;

  constructor() {
    this.isOpened = false;
    this.tag = 0;
  }
}

/**
 * MineSweeper
 */
export class MineSweeper {
  public cells: MineSweeperCell[][];
  private _width: number;
  private _height: number;
  private _totalmine: number;
  private _inited: boolean;
  private _mineGenerated: boolean;
  private _finished: boolean;
  private _mineleft: number;

  get Width(): number {
    return this._width;
  }
  set Width(width: number) {
    this._width = width;
  }
  get Height(): number {
    return this._height;
  }
  set Height(height: number) {
    this._height = height;
  }
  get Finished(): boolean {
    return this._finished;
  }
  get TotalMines(): number {
    return this._totalmine;
  }
  set TotalMines(tmine: number) {
    this._totalmine = tmine;
  }
  get IsMineGenerated(): boolean {
    return this._mineGenerated;
  }

  constructor() {
    this._inited = false;
    this._mineGenerated = false;
    this._finished = false;
    this._height = 16;
    this._width = 30;

    this._totalmine = 99;
  }

  public init() {
    if (this._inited === true) {
      throw new Error('Alreay inited');
    }

    if (this._width <= 1 || this._height <= 1) {
      throw new Error('Invalid dimension');
    }
    if (this._totalmine <= 0) {
      throw new Error('Set Mine number before start');
    }
    if (this._totalmine >= (this._width * this._height)) {
      throw new Error('Too many mines!');
    }

    // Re-init = reset
    this._finished = false;
    this._mineGenerated = false;
    this.cells = new Array<Array<MineSweeperCell>>();
    for (let y = 0; y < this._width; y++) {
      const row: MineSweeperCell[]  = new Array<MineSweeperCell>();

      for (let x = 0; x < this._height; x++) {
        row.push(new MineSweeperCell());
      }

      this.cells.push(row);
    }
  }

  /**
   * Generate the mines
   * It occurs when the first click, therefore exclude the first position
   * @param excludpos Exclude position
   */
  public generateMines(excludpos: CanvasCellPositionInf) {
    if (this._mineGenerated === true) {
      return;
    }

    let mineItem: CanvasCellPositionInf;
    const arMines: CanvasCellPositionInf[] = [];

    for (let i = 0; i < this._totalmine; i++) {
      do {
        mineItem = { row: Math.floor(Math.random() * this._width), column: Math.floor(Math.random() * this._height) };
      } while (this.isInArray(mineItem, arMines) || (excludpos.row === mineItem.row && excludpos.column === mineItem.column));

      this.cells[mineItem.row][mineItem.column].isMine = true;
      arMines.push(mineItem);
    }

    this._mineGenerated = true;
  }

  /**
   * Check cell is opened or not
   * @param pos Position
   */
  public isCellOpened(pos: CanvasCellPositionInf): boolean {
    if (pos === undefined || !this.isValidCellPosition) {
      throw new Error(`Invalid poisition: ${pos.row}, ${pos.column}`);
    }

    return this.cells[pos.row][pos.column].isOpened;
  }

  /**
   * Check the position is valid for current instnace
   * @param pos Position
   */
  public isValidCellPosition(pos: CanvasCellPositionInf): boolean {
    if (pos.row < 0 || pos.column < 0 || pos.row >= this._height || pos.column >= this._width) {
      return false;
    }

    return true;
  }

  public isAMineCell(pos: CanvasCellPositionInf): boolean {
    if (this.isValidCellPosition(pos) && this.cells[pos.row][pos.column].isMine) {
      return true;
    }

    return false;
  }

  /**
   * Calculate the number of mines around
   * @param pos Position
   */
  public calcNumberOfMinesAround(pos: CanvasCellPositionInf): number {
    const aroundArr = this.getAroundCells(pos);
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      aroundMineNum += this.isAMineCell(aroundArr[i]) ? 1 : 0;
    }

    return aroundMineNum;
  }

  /**
   * Calcuate the unknow cells
   * @param pos Position
   */
  public calcUnknownCellAround(pos: CanvasCellPositionInf): CanvasCellPositionInf[] {
    const unknowArr = [];
    const aroundArr = this.getAroundCells(pos);

    for (let i = 0; i < aroundArr.length; i++) {
      if (this.isValidCellPosition(aroundArr[i]) && this.cells[aroundArr[i].row][aroundArr[i].column].tag === 0
        && this.cells[aroundArr[i].row][aroundArr[i].column].isOpened === false) {
        unknowArr.push(aroundArr[i]);
      }
    }

    return unknowArr;
  }

  /**
   * Get tagged cells' number around
   * @param pos position of the cell
   */
  public calcTaggedCellsAround(pos: CanvasCellPositionInf) {
    const aroundArr = this.getAroundCells(pos);
    let tagNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      if (this.isValidCellPosition(aroundArr[i]) && this.cells[aroundArr[i].row][aroundArr[i].column].tag === 1) {
        tagNum++;
      }
    }

    return tagNum;
  }

  public fetchZeroMinesAround(pos: CanvasCellPositionInf, zeroArr: CanvasCellPositionInf[]) {
    const aroundArr = this.getAroundCells(pos);
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      aroundMineNum = this.calcNumberOfMinesAround(aroundArr[i]);
      if (aroundMineNum === 0 && this.isValidCellPosition(aroundArr[i])
        && this.cells[aroundArr[i].row][aroundArr[i].column].isMine === false
        && !this.isInArray(aroundArr[i], zeroArr)) {
        zeroArr.push(aroundArr[i]);
        this.fetchZeroMinesAround(aroundArr[i], zeroArr);
      }
    }

    return zeroArr;
  }

  /**
   * Get around cells
   * @param pos Current position
   */
  getAroundCells(pos: CanvasCellPositionInf): CanvasCellPositionInf[] {
    return [
      { row: pos.row - 1, column: pos.column - 1, },
      { row: pos.row - 1, column: pos.column, },
      { row: pos.row - 1, column: pos.column + 1, },
      { row: pos.row, column: pos.column - 1, },
      { row: pos.row, column: pos.column + 1, },
      { row: pos.row + 1, column: pos.column - 1, },
      { row: pos.row + 1, column: pos.column, },
      { row: pos.row + 1, column: pos.column + 1, },
    ];
  }

  /**
   * Is item is in array
   * @param posToSearch Position to search
   * @param arrayToSearch Array to search
   */
  private isInArray(posToSearch: CanvasCellPositionInf, arrayToSearch: CanvasCellPositionInf[]): boolean {
    for (let i = 0; i < arrayToSearch.length; i ++) {
      if (arrayToSearch[i].row === posToSearch.row && arrayToSearch[i].column === posToSearch.column) {
        return true;
      }
    }

    return false;
  }
}
