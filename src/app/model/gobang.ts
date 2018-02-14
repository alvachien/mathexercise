import { CanvasCellPositionInf } from './uicommon';
import { workoutSlash, workoutBackSlash, MatrixPosIntf } from './utility';

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

export enum GobangDirectionEnum {
  row = 0,
  column = 1,
  slash = 2,
  backslash = 4
}

export class GobangAIInternalResultEx extends GobangAIInternalResult {
  direction: GobangDirectionEnum;
  relid: number; // Row ID, or Column ID or Slash ID or BackSlash ID
  risklevel: number;
}

// Gobang
export class Gobang {
  public cells: GobangCell[][];
  private _dimension: number;
  private _inited: boolean;
  private _finished: boolean;
  private _playAnalysis: GobangAIInternalResultEx[] = [];
  private _AIAnalysis: GobangAIInternalResultEx[] = [];
  private _arSlashPos: MatrixPosIntf[][] = [];
  private _arBackSlashPos: MatrixPosIntf[][] = [];
  private _queuePositions: MatrixPosIntf[] = [];

  get Dimension(): number {
    return this._dimension;
  }
  set Dimension(dim: number) {
    this._dimension = dim;
  }
  get Finished(): boolean {
    return this._finished;
  }
  get AIAnalysisResult(): GobangAIInternalResultEx[] {
    return this._AIAnalysis;
  }
  get PlayerAnalysisResult(): GobangAIInternalResultEx[] {
    return this._playAnalysis;
  }
  get QueuePositions(): MatrixPosIntf[] {
    return this._queuePositions;
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
    if (this._dimension <= 0 || this._dimension > 50) {
      throw new Error('Invalid dimension');
    }

    // Re-init = reset
    this._finished = false;
    this.cells = new Array<Array<GobangCell>>();
    for (let y = 0; y < this._dimension; y++) {
      const row: GobangCell[]  = new Array<GobangCell>();

      for (let x = 0; x < this._dimension; x++) {
        row.push(new GobangCell());
      }

      this.cells.push(row);
    }

    // Positions
    this._arSlashPos = workoutSlash(this._dimension);
    this._arBackSlashPos = workoutBackSlash(this._dimension);

    // Analysis
    this._AIAnalysis = [];
    this._playAnalysis = [];

    // Positions
    this._queuePositions = [];

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

    // Add to queue
    this._queuePositions.push({x: row, y: column});

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

    const rtnPos: CanvasCellPositionInf = {
      row: 0,
      column: 0
    };

    // AI go first?
    if (this._queuePositions.length <= 0) {
      rtnPos.row = Math.round(Math.random() * this._dimension / 2);
      rtnPos.column = Math.round(Math.random() * this._dimension / 2);
      return rtnPos;
    } else if (this._queuePositions.length === 1) {
      // First step of AI
      rtnPos.row = this._queuePositions[0].x;
      rtnPos.column = (this._queuePositions[0].y + 1 < this._dimension) ? (this._queuePositions[0].y + 1) : (this._queuePositions[0].y - 1);

      return rtnPos;
    }

    // Build up the AI Analysis
    this.buildUpAIAnalyis();

    let maxdefendindex = -1;
    this._playAnalysis.forEach((value, index) => {
      if (maxdefendindex === -1) {
        maxdefendindex = index;
      } else {
        if (this._playAnalysis[maxdefendindex].risklevel < value.risklevel) {
          maxdefendindex = index;
        }
      }
    });
    let maxattackindex = -1;
    this._AIAnalysis.forEach((value, index) => {
      if (maxattackindex === -1) {
        maxattackindex = index;
      } else {
        if (this._playAnalysis[maxattackindex].risklevel < value.risklevel) {
          maxattackindex = index;
        }
      }
    });

    // Stategy:
    // If the player has risk larger than 3 (and AI is smaller or equal), defend!
    // Else attack!
    if (this._AIAnalysis[maxattackindex].risklevel < this._playAnalysis[maxdefendindex].risklevel
      && (this._playAnalysis[maxdefendindex].risklevel === 4
      || (this._playAnalysis[maxdefendindex].risklevel === 3
        && !(this._playAnalysis[maxdefendindex].headsealed || this._playAnalysis[maxdefendindex].tailsealed)) )
    ) {
      if (this._playAnalysis[maxdefendindex].headsealed) {
        // Head is sealed, go for tail sealed
        switch (this._playAnalysis[maxdefendindex].direction) {
          case GobangDirectionEnum.row: {
            rtnPos.row = this._playAnalysis[maxdefendindex].relid;
            rtnPos.column = this._playAnalysis[maxdefendindex].endidx + 1;
          }
          break;

          case GobangDirectionEnum.column: {
            rtnPos.row = this._playAnalysis[maxdefendindex].endidx + 1;
            rtnPos.column = this._playAnalysis[maxdefendindex].relid;
          }
          break;

          case GobangDirectionEnum.slash: {
            rtnPos.row = this._arSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].endidx + 1].x;
            rtnPos.row = this._arSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].endidx + 1].y;
          }
          break;

          case GobangDirectionEnum.backslash: {
            rtnPos.row = this._arBackSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].endidx + 1].x;
            rtnPos.row = this._arBackSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].endidx + 1].y;
          }
          break;

          default:
          throw new Error('Unsupported type!');
        }
      } else {
        switch (this._playAnalysis[maxdefendindex].direction) {
          case GobangDirectionEnum.row: {
            rtnPos.row = this._playAnalysis[maxdefendindex].relid;
            rtnPos.column = this._playAnalysis[maxdefendindex].startidx - 1;
          }
          break;

          case GobangDirectionEnum.column: {
            rtnPos.row = this._playAnalysis[maxdefendindex].startidx - 1;
            rtnPos.column = this._playAnalysis[maxdefendindex].relid;
          }
          break;

          case GobangDirectionEnum.slash: {
            rtnPos.row = this._arSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].startidx - 1].x;
            rtnPos.row = this._arSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].startidx - 1].y;
          }
          break;

          case GobangDirectionEnum.backslash: {
            rtnPos.row = this._arBackSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].startidx - 1].x;
            rtnPos.row = this._arBackSlashPos[this._playAnalysis[maxdefendindex].relid][this._playAnalysis[maxdefendindex].startidx - 1].y;
          }
          break;

          default:
          throw new Error('Unsupported type!');
        }
      }

      return rtnPos;
    } else {
      // Attack!
      if (this._AIAnalysis[maxattackindex].headsealed) {
        // Head is sealed, go for tail
        switch (this._AIAnalysis[maxattackindex].direction) {
          case GobangDirectionEnum.row: {
            rtnPos.row = this._AIAnalysis[maxattackindex].relid;
            rtnPos.column = this._AIAnalysis[maxattackindex].endidx + 1;
          }
          break;

          case GobangDirectionEnum.column: {
            rtnPos.row = this._AIAnalysis[maxattackindex].endidx + 1;
            rtnPos.column = this._AIAnalysis[maxattackindex].relid;
          }
          break;

          case GobangDirectionEnum.slash: {
            rtnPos.row = this._arSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].endidx + 1].x;
            rtnPos.column = this._arSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].endidx + 1].y;
          }
          break;

          case GobangDirectionEnum.backslash: {
            rtnPos.row = this._arBackSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].endidx + 1].x;
            rtnPos.column = this._arBackSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].endidx + 1].y;
          }
          break;

          default:
          throw new Error('Unsupported type!');
        }
      } else {
        switch (this._AIAnalysis[maxattackindex].direction) {
          case GobangDirectionEnum.row: {
            rtnPos.row = this._AIAnalysis[maxattackindex].relid;
            rtnPos.column = this._AIAnalysis[maxattackindex].startidx - 1;
          }
          break;

          case GobangDirectionEnum.column: {
            rtnPos.row = this._AIAnalysis[maxattackindex].startidx - 1;
            rtnPos.column = this._AIAnalysis[maxattackindex].relid;
          }
          break;

          case GobangDirectionEnum.slash: {
            rtnPos.row = this._arSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].startidx - 1].x;
            rtnPos.column = this._arSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].startidx - 1].y;
          }
          break;

          case GobangDirectionEnum.backslash: {
            rtnPos.row = this._arBackSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].startidx - 1].x;
            rtnPos.column = this._arBackSlashPos[this._AIAnalysis[maxattackindex].relid][this._AIAnalysis[maxattackindex].startidx - 1].y;
          }
          break;

          default:
          throw new Error('Unsupported type!');
        }
      }

      return rtnPos;
    }
  }

  private buildUpAIAnalyis() {
    this._playAnalysis = [];
    this._AIAnalysis = [];

    // Row
    for (let i = 0; i < this._dimension; i++) {
      const rowCells = this.buildUpAnalysisRow(this.cells[i]);
      for (const cell of rowCells) {
        if (cell.headsealed === true && cell.tailsealed === true) {
          continue;
        }

        if (cell.userinput === true) {
          // Player
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.row;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._playAnalysis.push(anay);
        } else if (cell.userinput === false) {
          // AI
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.row;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._AIAnalysis.push(anay);
        }
      }
    }

    // Column
    for (let i = 0; i < this._dimension; i++) {
      const arColCells = [];
      for (let j = 0; j < this._dimension; j++) {
        arColCells.push(this.cells[j][i]);
      }
      const colAnalysis = this.buildUpAnalysisRow(arColCells);
      for (const cell of colAnalysis) {
        if (cell.headsealed === true && cell.tailsealed === true) {
          continue;
        }

        if (cell.userinput === true) {
          // Player
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.column;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._playAnalysis.push(anay);
        } else if (cell.userinput === false) {
          // AI
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.column;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._AIAnalysis.push(anay);
        }
      }
    }

    // Slash /
    for (let i = 0; i < this._arSlashPos.length; i++) {
      const arCells = [];
      for (const pos of this._arSlashPos[i]) {
        arCells.push(this.cells[pos.x][pos.y]);
      }

      const rowCells = this.buildUpAnalysisRow(arCells);
      for (const cell of rowCells) {
        if (cell.headsealed === true && cell.tailsealed === true) {
          continue;
        }

        if (cell.userinput === true) {
          // Player
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.slash;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._playAnalysis.push(anay);
        } else if (cell.userinput === false) {
          // AI
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.slash;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._AIAnalysis.push(anay);
        }
      }
    }

    // BackSlash \
    for (let i = 0; i < this._arBackSlashPos.length; i++) {
      const arCells = [];
      for (const pos of this._arBackSlashPos[i]) {
        arCells.push(this.cells[pos.x][pos.y]);
      }

      const rowCells = this.buildUpAnalysisRow(arCells);
      for (const cell of rowCells) {
        if (cell.userinput === true) {
          // Player
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.backslash;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._playAnalysis.push(anay);
        } else if (cell.userinput === false) {
          // AI
          const anay = new GobangAIInternalResultEx();
          anay.direction = GobangDirectionEnum.backslash;
          anay.relid = i;
          anay.risklevel = cell.endidx + 1 - cell.startidx;
          anay.startidx = cell.startidx;
          anay.endidx = cell.endidx;
          anay.headsealed = cell.headsealed;
          anay.tailsealed = cell.tailsealed;
          anay.risklevel = anay.endidx + 1 - anay.startidx;
          anay.userinput = cell.userinput;
          this._AIAnalysis.push(anay);
        }
      }
    }
  }

  private buildUpAnalysisRow(arRow: GobangCell[]): GobangAIInternalResult[] {
    let prvidx = -1;
    let prvval: boolean = undefined;
    const arRst: GobangAIInternalResult[] = [];

    for (let i = 0; i < arRow.length; i ++) {
      if (arRow[i].playerinput === true) {
        if (prvidx === -1) {
          prvidx = i;
          prvval = true;
        } else {
          if (prvval !== arRow[i].playerinput) {
            if (prvval !== undefined) {
              const air: GobangAIInternalResult = new GobangAIInternalResult();
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
              const air: GobangAIInternalResult = new GobangAIInternalResult();
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
            const air: GobangAIInternalResult = new GobangAIInternalResult();
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
      const air: GobangAIInternalResult = new GobangAIInternalResult();
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
