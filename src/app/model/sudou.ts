
/**
 * Constants
 */
export const SudouUnitSize = 3;
export const SudouSize = 9;

/**
 * Row for Sudou unit
 */
export class SudouUnitRow {
  private _dataCells: number[] = [];
  constructor() {
    for (let i = 0; i < SudouUnitSize; i++) {
      this._dataCells.push(0);
    }
  }

  getCell(cidx: number): number {
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    return this._dataCells[cidx];
  }

  setCell(cidx: number, val: number) {
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    this._dataCells[cidx] = val;
  }

  public toString(): string {
    return this._dataCells.join(' ');
  }

  /**
   * Print it content
   */
  public print2Log() {
    console.log(this.toString());
  }
}

/**
 * Sudou unit is a 3*3 matrix
 */
export class SudouUnit {
  private _dataRows: SudouUnitRow[] = [];

  /**
   * Geenrate valid Sudou unit
   */
  public static generateValidOne(): SudouUnit {
    const unit: SudouUnit = new SudouUnit();

    const arInitOne: number[] = [];
    for (let i = 0; i < SudouSize; i++) {
      arInitOne.push(0);
    }

    for (let i = 0; i < SudouSize; i++) {
      let jpos = Math.round(Math.random() * (SudouSize - 1) + 1);
      if (arInitOne[jpos] === 0) {
        arInitOne[jpos] = i + 1;
      } else {
        jpos = 0;
        while (jpos < SudouSize) {
          if (arInitOne[jpos] === 0) {
            arInitOne[jpos] = i + 1;
            break;
          }
          jpos++;
        }

        if (jpos > SudouSize) {
          throw new Error('Failed to initialize a 3*3!');
        }
      }
    }

    // console.log(arInitOne.join(' '));
    for (let i = 0; i < SudouSize; i++) {
      unit.setCell(Math.floor(i / 3), Math.floor(i % 3), arInitOne[i]);
    }

    return unit;
  }

  constructor() {
    for (let i = 0; i < SudouUnitSize; i++) {
      const row: SudouUnitRow = new SudouUnitRow();
      this._dataRows.push(row);
    }
  }

  public getRow(ridx: number): SudouUnitRow {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    return this._dataRows[ridx];
  }

  public setRow(ridx: number, row: SudouUnitRow) {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }
    if (row === null || row === undefined) {
      throw new Error('Unit row is not assigned');
    }

    this._dataRows[ridx] = row;
  }

  public getCell(ridx: number, cidx: number): number {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    const row: SudouUnitRow = this._dataRows[ridx];
    return row.getCell(cidx);
  }

  public setCell(ridx: number, cidx: number, val: number) {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    const row: SudouUnitRow = this._dataRows[ridx];
    row.setCell(cidx, val);
  }

  /**
   * Swap two rows
   * @param ridx1 First row
   * @param ridx2 Second row
   */
  public swapRows(ridx1: number, ridx2: number): SudouUnit {
    if (ridx1 < 0 || ridx1 >= SudouUnitSize
      || ridx2 < 0 || ridx2 >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    const rst: SudouUnit = new SudouUnit();

    for (let i = 0; i < SudouUnitSize; i++) {
      for (let j = 0; j < SudouUnitSize; j++) {
        if (i === ridx1) {
          rst.setCell(ridx2, j, this.getCell(i, j));
        } else if (i === ridx2) {
          rst.setCell(ridx1, j, this.getCell(i, j));
        } else {
          rst.setCell(i, j, this.getCell(i, j));
        }
      }
    }

    return rst;
  }

  /**
   * Swap two columns
   * @param cidx1 The first column
   * @param cidx2 The second column
   */
  public swapColumns(cidx1: number, cidx2: number): SudouUnit {
    if (cidx1 < 0 || cidx1 >= SudouUnitSize
      || cidx2 < 0 || cidx2 >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    const rst: SudouUnit = new SudouUnit();
    for (let i = 0; i < SudouUnitSize; i++) {
      for (let j = 0; j < SudouUnitSize; j++) {
        if (j === cidx1) {
          rst.setCell(i, cidx2, this.getCell(i, j));
        } else if (j === cidx2) {
          rst.setCell(i, cidx1, this.getCell(i, j));
        } else {
          rst.setCell(i, j, this.getCell(i, j));
        }
      }
    }

    return rst;
  }

  /**
   * Scroll the whole matrix up
   *
   * Row (0, 1, 2) => (1, 2, 0)
   * Example:
   * a b c      d e f
   * d e f  ==> g h i
   * g h i      a b c
   */
  public scrollUp(): SudouUnit {
    // (0, 1, 2) => (1, 0, 2)
    const tmp: SudouUnit = this.swapRows(0, 1);
    // (1, 0, 2) => (1, 2, 0)
    return tmp.swapRows(1, 2);
  }

  /**
   * Scroll the whole matrix down
   *
   * Row (0, 1, 2) => (2, 0, 1)
   * Example:
   * a b c      g h i
   * d e f  ==> a b c
   * g h i      d e f
   */
  public scrollDown(): SudouUnit {
    // (0, 1, 2) => (0, 2, 1)
    const tmp: SudouUnit = this.swapRows(1, 2);
    // (0, 2, 1) => (2, 0, 1)
    return tmp.swapRows(0, 1);
  }

  /**
   * Scroll the whole matrix left
   *
   * Column (0, 1, 2) => (1, 2, 0)
   * Example:
   * a b c      b c a
   * d e f  ==> e f d
   * g h i      h i g
   */
  public scrollLeft(): SudouUnit {
    // (0, 1, 2) => (1, 0, 2)
    const tmp: SudouUnit = this.swapColumns(0, 1);
    // (1, 0, 2) => (1, 2, 0)
    return tmp.swapColumns(1, 2);
  }

  /**
   * Scroll the whole matrix right
   *
   * Column (0, 1, 2) => (2, 0, 1)
   * Example:
   * a b c      c a b
   * d e f  ==> f d e
   * g h i      i g h
   */
  public scrollRight(): SudouUnit {
    // (0, 1, 2) => (0, 2, 1)
    const tmp: SudouUnit = this.swapColumns(1, 2);
    // (0, 2, 1) => (2, 0, 1)
    return tmp.swapColumns(0, 1);
  }

  /**
   * Print it content
   */
  public print2Log() {
    for (let i = 0; i < SudouUnitSize; i++) {
      this._dataRows[i].print2Log();
    }
  }

}

/**
 * A row in Sudou, with Rows
 */
export class SudouRow {
  private _dataCells: SudouUnit[] = [];
  constructor() {
    for (let i = 0; i < SudouUnitSize; i++) {
      this._dataCells.push(new SudouUnit());
    }
  }

  getCell(cidx: number): SudouUnit {
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    return this._dataCells[cidx];
  }

  setCell(cidx: number, val: SudouUnit) {
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    this._dataCells[cidx] = val;
  }
}

/**
 * Sudou is 9*9 matrix
 */
export class Sudou {
  private _dataRows: SudouRow[] = [];

  constructor() {
    for (let i = 0; i < SudouUnitSize; i++) {
      const row: SudouRow = new SudouRow();
      this._dataRows.push(row);
    }
  }

  public getRow(ridx: number): SudouRow {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    return this._dataRows[ridx];
  }

  public setRow(ridx: number, row: SudouRow) {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }
    if (row === null || row === undefined) {
      throw new Error('Unit row is not assigned');
    }

    this._dataRows[ridx] = row;
  }

  public getUnitCell(ridx: number, cidx: number): SudouUnit {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    const row: SudouRow = this._dataRows[ridx];
    return row.getCell(cidx);
  }

  public setUnitCell(ridx: number, cidx: number, val: SudouUnit) {
    if (ridx < 0 || ridx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }
    if (cidx < 0 || cidx >= SudouUnitSize) {
      throw new Error('index of Sudou Unit is 1 - 3');
    }

    const row: SudouRow = this._dataRows[ridx];
    row.setCell(cidx, val);
  }

  public getDataCells(): number[][] {
    const rst: number[][] = [];
    for (let i = 0; i < SudouSize; i++) {
      const rowdata: number[] = [];
      for (let j = 0; j < SudouSize; j++) {
        rowdata.push(0);
      }
      rst.push(rowdata);
    }

    for (let i = 0; i < SudouUnitSize; i++) {
      for (let j = 0; j < SudouUnitSize; j++) {
        const unit = this._dataRows[i].getCell(j);
        for (let k = 0; k < SudouUnitSize; k++) {
          const ridx = 3 * i + k;

          for (let l = 0; l < SudouUnitSize; l++) {
            const cidx = 3 * j + l;
            rst[ridx][cidx] = unit.getCell(k, l);
          }
        }
      }
    }

    return rst;
  }

  /**
   * Print it content
   */
  public print2Log() {
    const arRows: string[] = [];
    for (let i = 0; i < SudouSize; i++) {
      arRows.push('');
    }

    for (let i = 0; i < SudouUnitSize; i++) {
      for (let j = 0; j < SudouUnitSize; j++) {
        const unit = this._dataRows[i].getCell(j);
        for (let k = 0; k < SudouUnitSize; k++) {
          const ridx = 3 * i + k;

          arRows[ridx] += unit.getRow(k).toString() + ' ';
        }
      }
    }

    for (let i = 0; i < SudouSize; i++) {
      console.log(arRows[i]);
    }
  }

  /**
   * Print it content as string
   */
  public print2String(): string {
    const arRows: string[] = [];
    for (let i = 0; i < SudouSize; i++) {
      arRows.push('');
    }

    for (let i = 0; i < SudouUnitSize; i++) {
      for (let j = 0; j < SudouUnitSize; j++) {
        const unit = this._dataRows[i].getCell(j);
        for (let k = 0; k < SudouUnitSize; k++) {
          const ridx = 3 * i + k;

          arRows[ridx] += unit.getRow(k).toString() + ' ';
        }
      }
    }

    return arRows.join(';');
  }
}

/**
 * Generate a valid sudou: 9*9 Matrix
 */
export function generateValidSudou(): Sudou {
  const rst: Sudou = new Sudou();

  // The central one - B5
  const cunit: SudouUnit = SudouUnit.generateValidOne();
  // console.log("B5 is ready: ");
  // cunit.print2Log();
  // Now B4 and B6
  const cunitb6 = cunit.scrollUp();
  // console.log("B6 is ready: ");
  // cunitb6.print2Log();
  const cunitb4 = cunit.scrollDown();
  // console.log("B4 is ready: ");
  // cunitb4.print2Log();
  // Now B2 and B8
  const cunitb2 = cunit.scrollRight();
  // console.log("B2 is ready: ");
  // cunitb2.print2Log();
  const cunitb8 = cunit.scrollLeft();
  // console.log("B8 is ready: ");
  // cunitb8.print2Log();

  // Then B1, B3, B7 and B9
  const cunitb1 = cunitb4.scrollRight();
  // console.log("B1 is ready: ");
  // cunitb1.print2Log();
  const cunitb7 = cunitb4.scrollLeft();
  // console.log("B7 is ready: ");
  // cunitb7.print2Log();

  const cunitb3 = cunitb6.scrollRight();
  // console.log("B3 is ready: ");
  // cunitb3.print2Log();
  const cunitb9 = cunitb6.scrollLeft();
  // console.log("B9 is ready: ");
  // cunitb9.print2Log();

  rst.setUnitCell(0, 0, cunitb1);
  rst.setUnitCell(0, 1, cunitb2);
  rst.setUnitCell(0, 2, cunitb3);
  rst.setUnitCell(1, 0, cunitb4);
  rst.setUnitCell(1, 1, cunit);
  rst.setUnitCell(1, 2, cunitb6);
  rst.setUnitCell(2, 0, cunitb7);
  rst.setUnitCell(2, 1, cunitb8);
  rst.setUnitCell(2, 2, cunitb9);

  // rst.print2Log();

  return rst;
}
