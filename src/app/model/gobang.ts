import { CanvasCellPositionInf } from './uicommon';
import { workoutSlash, workoutBackSlash, MatrixPosIntf } from "./utility";

// Gobang cell
export class GobangCell {
  // Playerinput
  //  true - inputted by the player
  //  false - inputted by the Algorithm
  //  undefined - not set yet
  public playerinput: boolean | undefined;
}

// Analyis Queue
export class GobangAIAnalysisQueue {
  positions: CanvasCellPositionInf[] = [];
  headsealed: boolean;
  tailsealed: boolean;
}

export class GobangAIInternalResult {
  startidx: number;
  endidx: number;
  userinput: boolean;
  headsealed: boolean;
  tailsealed: boolean;
}

// Gobang
export class Gobang {
  public cells: GobangCell[][];
  private _dimension: number;
  private _inited: boolean;
  private _finished: boolean;
  private _lastPlayerPos: CanvasCellPositionInf;
  private _playAnalysis: GobangAIAnalysisQueue[] = [];
  private _AIAnalysis: GobangAIAnalysisQueue[] = [];

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

  /**
   * Initialize
   */
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

    this._AIAnalysis = [];
    this._playAnalysis = [];

    this._inited = true;
  }

  /**
   * Check the cell has value
   * @param row Row
   * @param column Column
   */
  public isCellHasValue(row: number, column: number): boolean {
    if (!this._inited) {
      throw new Error('Not initialed');
    }
    if (row < 0 || row >= this._dimension || column < 0 || column >= this._dimension) {
      throw new Error('Invalid row or column');
    }

    return this.cells[row][column].playerinput !== undefined;
  }

  /**
   * Set the current cell value
   * @param row Row
   * @param column Column
   * @param playerinput Player input
   */
  public setCellValue(row: number, column: number, playerinput: boolean) {
    if (!this._inited) {
      throw new Error('Not initialed');
    }
    if (row < 0 || row >= this._dimension || column < 0 || column >= this._dimension) {
      throw new Error('Invalid row or column');
    }

    if (this._finished) {
      throw new Error('Already finished');
    }

    this.cells[row][column].playerinput = playerinput;

    // Build up the AI Analysis
    // this.buildUpAnalyis(row, column, playerinput);
    this.buildUpAnalyis();

    // Now check for the winner
    this.checkWinner(row, column, playerinput);
  }

  /**
   * Workout the next cell position
   */
  public workoutNextCellAIPosition(): CanvasCellPositionInf {
    if (this._finished) {
      throw new Error('Game is over!');
    }
    if (this._lastPlayerPos === undefined) {
      // AI play first case
      return {
        row: Math.round(this._dimension / 2),
        column: Math.round(this._dimension / 2)
      };
    }
    
    let attackLevel = 0;
    let attackPos: CanvasCellPositionInf[][] = [];
    let defendLevel = 0;
    let defendPos: CanvasCellPositionInf[][] = [];

    let playInput: GobangAIAnalysisQueue[] = [];
    let AIInput: GobangAIAnalysisQueue[] = [];

    // Workout the attack level
    // Rows
    let rowUsrStart = -1, rowUsrEnd = -1, rowUsrCount = 0;
    let rowAIStart = -1, rowAIEnd = -1, rowAICount = 0;
    for (let i = 0; i < this._dimension; i++) {
      for (let j = 0; j < this._dimension; j++) {
        if (this.cells[i][j].playerinput === true) {
          if (rowUsrStart === -1) {
            rowUsrStart = j; // Row starts with the J!
            rowUsrEnd = rowUsrEnd;
            rowUsrCount = 1;
          } else {
            rowUsrStart = j; // Row starts with the J!
            rowUsrEnd = rowUsrEnd;
          }

          if (rowAIStart !== -1) {

          } else {

          }
        } else if (this.cells[i][j].playerinput === false) {
        }
      }
    }
    // Columns
    for (let i = 0; i < this._dimension; i++) {

    }
    // 
    
    // Workout the defend level

    if (defendLevel > attackLevel) {
      // Need defend
    } else {
      // Go Attack
    }

    return {
      row: -1,
      column: -1
    };
  }

  public buildUpAnalyis() {
    //let arRst: GobangAIInternalResult[] = [];

    // Row
    for (let i = 0; i < this._dimension; i++) {
      let rowCells = this.buildUpAnalysisRow(this.cells[i]);
      if (rowCells.length > 0) {
        console.log(`Analyzing row: ${i}`);
      }
      for(let cell of rowCells) {
        //arRst.push(cell);
        console.log(`Result of row ${i}: ${cell.startidx} - ${cell.endidx} with ${cell.userinput? 'Player': 'AI'}, head sealed: ${cell.headsealed}, tail sealed: ${cell.tailsealed}`);
      }
    }

    // Column
    for (let i = 0; i < this._dimension; i++) {
      let arCells = [];
      for(let j = 0; j < this._dimension;j++) {
        arCells.push(this.cells[j][i]);
      }
      let rowCells = this.buildUpAnalysisRow(arCells);
      if (rowCells.length > 0) {
        console.log(`Analyzing column: ${i}`);
      }
      for(let cell of rowCells) {
        //arRst.push(cell);
        console.log(`Result of column ${i}: ${cell.startidx} - ${cell.endidx} with ${cell.userinput? 'Player': 'AI'}, head sealed: ${cell.headsealed}, tail sealed: ${cell.tailsealed}`);
      }
    }
    
    // Slash /
    let arpos: MatrixPosIntf[][] = workoutSlash(this._dimension);
    for (let i = 0; i < arpos.length; i++) {
      let arCells = [];
      for (let pos of arpos[i]) {
        arCells.push(this.cells[pos.x][pos.y]);
      }

      let rowCells = this.buildUpAnalysisRow(arCells);
      if (rowCells.length > 0) {
        console.log(`Analyzing Slash: ${i}`);
      }
      for(let cell of rowCells) {
        //arRst.push(cell);
        console.log(`Result of slash ${i}: ${cell.startidx} - ${cell.endidx} with ${cell.userinput? 'Player': 'AI'}, head sealed: ${cell.headsealed}, tail sealed: ${cell.tailsealed}`);
      }
    }

    // BackSlash \
    let arbspos: MatrixPosIntf[][] = workoutBackSlash(this._dimension);
    for (let i = 0; i < arbspos.length; i++) {
      let arCells = [];
      for (let pos of arbspos[i]) {
        arCells.push(this.cells[pos.x][pos.y]);
      }

      let rowCells = this.buildUpAnalysisRow(arCells);
      if (rowCells.length > 0) {
        console.log(`Analyzing BackSlash: ${i}`);
      }
      for(let cell of rowCells) {
        //arRst.push(cell);
        console.log(`Result of backslash ${i}: ${cell.startidx} - ${cell.endidx} with ${cell.userinput? 'Player': 'AI'}, head sealed: ${cell.headsealed}, tail sealed: ${cell.tailsealed}`);
      }
    }

    //return arRst;
  }

  private buildUpAnalysisRow(arRow: GobangCell[]): GobangAIInternalResult[] {
    let prvidx = -1;
    let prvval: boolean = undefined;
    let arRst: GobangAIInternalResult[] = [];

    for(let i = 0; i < arRow.length; i ++) {
      if (arRow[i].playerinput === true) {
        if (prvidx === -1) {
          prvidx = i;
          prvval = true;
        } else {
          if (prvval !== arRow[i].playerinput) {
            if (prvval !== undefined) {
              let air: GobangAIInternalResult = new GobangAIInternalResult();
              air.startidx = prvidx;
              air.endidx = i - 1;
              air.userinput = prvval;
              if (prvidx === 0) {
                air.headsealed = true;
              } else {
                if (arRow[prvidx - 1].playerinput === undefined) {
                  air.headsealed = false;
                } else if (arRow[prvidx - 1].playerinput !== prvval) {
                  air.headsealed = true;
                }
              }
              air.tailsealed = true;
              arRst.push(air);
            }

            prvidx = i;
            prvval = arRow[i].playerinput;
          } else {
            // Do nothing
          }
        }
      } else if (arRow[i].playerinput === false) {
        if (prvidx === -1) {
          prvidx = i;
          prvval = false;
        } else {
          if (prvval !== arRow[i].playerinput) {
            if (prvval !== undefined) {
              let air: GobangAIInternalResult = new GobangAIInternalResult();
              air.startidx = prvidx;
              air.endidx = i - 1;
              air.userinput = prvval;
              if (prvidx === 0) {
                air.headsealed = true;
              } else {
                if (arRow[prvidx - 1].playerinput === undefined) {
                  air.headsealed = false;
                } else if (arRow[prvidx - 1].playerinput !== prvval) {
                  air.headsealed = true;
                }
              }
              air.tailsealed = true;
              arRst.push(air);
            }

            prvidx = i;
            prvval = arRow[i].playerinput;
          } else {
            // Do nothing            
          }
        }
      } else if (arRow[i].playerinput === undefined) {
        if (prvidx === -1) {
          prvidx = i;
          prvval = undefined;
        } else {
          if (prvval === undefined) {
            // Do nothing
          } else {
            let air: GobangAIInternalResult = new GobangAIInternalResult();
            air.startidx = prvidx;
            air.endidx = i - 1;
            air.userinput = prvval;
            if (prvidx === 0) {
              air.headsealed = true;
            } else {
              if (arRow[prvidx - 1].playerinput !== undefined) {
                air.headsealed = true;
              } else if (arRow[prvidx - 1].playerinput === undefined) {
                air.headsealed = false;
              }
            }
            air.tailsealed = false;
            arRst.push(air);

            prvidx = i;
            prvval = arRow[i].playerinput;
          }
        }
      }
    }

    if (prvval !== undefined) {
      let air: GobangAIInternalResult = new GobangAIInternalResult();
      air.startidx = prvidx;
      air.endidx = arRow.length - 1;
      air.userinput = prvval;
      if (prvidx === 0) {
        air.headsealed = true;
      } else {
        if (prvval !== undefined) {
          if (arRow[prvidx - 1].playerinput === undefined) {
            air.headsealed = false;
          } else {
            air.headsealed = true;
          }
        }
      }
      air.tailsealed = true;
      arRst.push(air);
    }

    return arRst;
  }

  /**
   * Check there is a Winner
   * @param row Row
   * @param column Column
   * @param val Value of input (player or AI)
   */
  private checkWinner(row: number, column: number, val: boolean) {
    // Row
    let rowsucc = 0, colsucc = 0, leftsucc = 0, rightsucc = 0;
    for (let i = 0; i < this._dimension; i++) {
      if (this.cells[row][i].playerinput === val) {
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
        if (this.cells[i][column].playerinput === val) {
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

          if (this.cells[i][total - i].playerinput === val) {
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

              if (this.cells[i][i + diff].playerinput === val) {
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
              if (this.cells[i][i - diff].playerinput === val) {
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
    }
  }
}
