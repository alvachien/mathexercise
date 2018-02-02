
// Gobang cell
export class GobangCell {
  public value: boolean | undefined;
}

// Gobang
export class Gobang {
  public cells: GobangCell[][];
  private _dimension: number;
  private _inited: boolean;
  get Dimension(): number {
    return this._dimension;
  }
  set Dimension(dim: number) {
    this._dimension = dim;
  }

  constructor() {
    this._dimension = 20; // Default.
    this._inited = false;
  }

  public init(): void {
    // Re-init = reset
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

    this.cells[row][column].value = val;

    // Now check for the winner
  }
}
