
// Gobang cell
export class GobangCell {
  public value: boolean | undefined;
}

// Gobang
export class Gobang {
  public cells: GobangCell[][];
  private _dimension: number;
  private _inited: boolean;
  private _finished: boolean;
  get Dimension(): number {
    return this._dimension;
  }
  set Dimension(dim: number) {
    this._dimension = dim;
  }
  get Finished(): boolean {
    return this._finished;
  }

  constructor() {
    this._dimension = 20; // Default.
    this._inited = false;
    this._finished = false;
  }

  public init(): void {
    // Re-init = reset
    this._finished = false;
    this.cells = new Array<Array<GobangCell>>();
    for (let y = 0; y <= this._dimension; y++) {
      const row: GobangCell[]  = new Array<GobangCell>();

      for (let x = 0; x <= this._dimension; x++) {
        row.push(new GobangCell());
      }

      this.cells.push(row);
    }

    this._inited = true;
  }

  public isCellHasValue(row: number, column: number): boolean {
    if (!this._inited) {
      throw new Error('Not initialed');
    }
    if (row < 0 || row >= this._dimension || column < 0 || column >= this._dimension) {
      throw new Error('Invalid row or column');
    }

    return this.cells[row][column].value !== undefined;
  }
  public setCellValue(row: number, column: number, val: boolean) {
    if (!this._inited) {
      throw new Error('Not initialed');
    }
    if (row < 0 || row >= this._dimension || column < 0 || column >= this._dimension) {
      throw new Error('Invalid row or column');
    }

    if (this._finished) {
      throw new Error('Already finished');
    }

    this.cells[row][column].value = val;

    // Now check for the winner
    // Row
    let rowsucc = 0, colsucc = 0, leftsucc = 0, rightsucc = 0;
    for (let i = 0; i < this._dimension; i++) {
      if (this.cells[row][i].value === val) {
        rowsucc ++;
      } else {
        rowsucc = 0;
      }
      if (rowsucc === 5) {
        break;
      }
    }

    if (rowsucc !== 5) {
      // Column
      for (let i = 0; i < this._dimension; i++) {
        if (this.cells[i][column].value === val) {
          colsucc ++;
        } else {
          colsucc = 0;
        }

        if (colsucc === 5) {
          break;
        }
      }

      if (colsucc !== 5) {
        // Left: row --, col ++
        const total = row + column;
        for (let i = 0; i < this._dimension; i++) {
          if (total < i || total >= (i + this._dimension)) {
            continue;
          }

          if (this.cells[i][total - i].value === val) {
            leftsucc ++;
          } else {
            leftsucc = 0;
          }

          if (leftsucc === 5) {
            break;
          }
        }

        if (leftsucc !== 5) {
          // Right: row ++, col ++
          let diff = row - column;
          if (diff < 0) {
            diff = Math.abs(diff);
            for (let i = 0; i < this._dimension; i++) {
              if (i + diff >= this._dimension) {
                continue;
              }

              if (this.cells[i][i + diff].value === val) {
                rightsucc ++;
              } else {
                rightsucc = 0;
              }

              if (rightsucc === 5) {
                break;
              }
            }
          } else {
            for (let i = diff; i < this._dimension; i++) {
              if (this.cells[i][i - diff].value === val) {
                rightsucc ++;
              } else {
                rightsucc = 0;
              }

              if (rightsucc === 5) {
                break;
              }
            }
          }
        }
      }
    }

    // Now the result has been obtains
    if (rowsucc === 5 || colsucc === 5 || leftsucc === 5 || rightsucc === 5) {
      // Winner
      this._finished = true;
    } else {
      // Do nothing!
    }
  }
}
