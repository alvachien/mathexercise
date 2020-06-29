import { Component, ViewChild, ElementRef, AfterContentInit, OnDestroy, NgZone, Input, Output, OnInit, HostListener, EventEmitter, Renderer2 } from '@angular/core';
import {
  RPN, SudouUnit, Sudou, generateValidSudou, SudouSize,
  PrimarySchoolMathQuiz, QuizTypeEnum, PrimarySchoolMathQuizItem,
  Cal24QuizItem, SudouQuizItem, LogLevel, QuizDegreeOfDifficulity,
  getCanvasMouseEventPosition, getCanvasCellPosition,
} from '../model';
import { environment } from '../../environments/environment';

/**
 * UI Cell for Sudou
 */
export class SudouCell {
  num: number;
  exp_num: number;
  fixed = true;
  allowInput: boolean;
  inConflict = false;

  public toString(): string {
    if (this.num === null || this.num === undefined) {
      return '';
    }

    return this.num.toString();
  }
}

/**
 * Position
 */
export interface SudouPosition {
  row: number;
  column: number;
}

function InArray(obj, arr) {
  for (const i in arr) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

/**
 * Edit panel for Sudou
 */
class SudouEditPanel {
  private _itemWidth;
  private _x;
  private _y;
  private _w;
  private _h;
  private _nlist = [];
  private _drawX;
  private _drawY;

  constructor(x, y, itemWidth, nlist, maxWidth, maxHeight) {
    this._x = x;
    this._y = y;
    this._itemWidth = itemWidth;
    this._nlist = nlist;
    this._w = this._itemWidth * 3;
    this._h = this._itemWidth * 4;
    this._drawX = this._x - this._w / 2;
    this._drawY = this._y - this._h / 2;
    if (this._drawX < 0) {
      this._drawX = 0;
    }
    if (this._drawY < 0) {
      this._drawY = 0;
    }
    if (this._drawX + this._w > maxWidth) {
      this._drawX = maxWidth - this._w;
    }
    if (this._drawY + this._h > maxHeight) {
      this._drawY = maxHeight - this._h;
    }
  }

  public Draw(ctx: any) {
    ctx.fillStyle = 'pink';
    ctx.fillRect(this._drawX, this._drawY, this._w, this._h);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.0;
    ctx.strokeRect(this._drawX, this._drawY, this._w, this._h);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.0;
    for (let i = 1; i <= SudouSize; i++) {
      const itemX = this._drawX + ((i - 1) % 3) * this._itemWidth;
      const itemY = this._drawY + Math.floor((i - 1) / 3) * this._itemWidth;
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(
        itemX,
        itemY,
        this._itemWidth, this._itemWidth);

      if (InArray(i, this._nlist)) {
        ctx.fillStyle = 'green';
        ctx.font = 'Bold ' + (this._itemWidth / 2) + 'px Arial';
        ctx.fillText(i.toString(), itemX + this._itemWidth / 3, itemY + this._itemWidth / 1.5);
      }
    }
  }

  public GetHitNumber(x, y) {
    const j = Math.floor((x - this._drawX) / this._itemWidth);
    const i = Math.floor((y - this._drawY) / this._itemWidth);

    if (j < 0 || j > 2 || i < 0 || i > 3) {
      return -1;
    }

    if (i === 3) {
      return null;
    }

    const n = i * 3 + j + 1;

    if (!InArray(n, this._nlist)) {
      return null;
    }

    return n;
  }
}

@Component({
  selector: 'app-pg-sudou',
  templateUrl: './pg-sudou.component.html',
  styleUrls: ['./pg-sudou.component.scss']
})
export class PgSudouComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('canvassudou') canvasSudou: ElementRef;
  private _objSudou: Sudou;
  private _width: number;
  private _height: number;
  private _itemWidth: number;
  private _itemHeight: number;
  private _editingCellIndex: any = null;
  private _editPanel: SudouEditPanel = null;
  private _dataCells: any = [];
  private _dod: QuizDegreeOfDifficulity;
  private _started = false;

  /**
   * Finish event
   */
  @Output() finishEvent: EventEmitter<any> = new EventEmitter();

  /**
   * Degree of difficulity
   */
  @Input()
  set sudouDoD(dod: QuizDegreeOfDifficulity) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering setter of sudouStart in PgSudouComponent' + dod.toString());
    }

    if (this._dod !== dod) {
      this._dod = dod;
    }
  }

  /**
   * Sudou object
   */
  @Input()
  set sudouObject(obj: Sudou) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering setter of sudouObject in PgSudouComponent');
    }

    this._objSudou = obj;
  }

  /**
   * Start the game
   */
  @Input()
  set sudouStart(bstart: boolean) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering setter of sudouStart in PgSudouComponent' + bstart.toString());
    }

    this._started = bstart;
  }

  constructor() {
    this._dod = QuizDegreeOfDifficulity.medium;
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngOnInit of PgSudouComponent');
    }
  }

  ngAfterContentInit() {
    this._width = this.canvasSudou.nativeElement.width;
    this._height = this.canvasSudou.nativeElement.height;
    this._itemWidth = this._width / SudouSize;
    this._itemHeight = this._height / SudouSize;

    if (this._started && this._objSudou != null) {
      const datrst = this._objSudou.getDataCells();
      this._dataCells = [];
      for (let i = 0; i < SudouSize; i++) {
        const ar = [];
        for (let j = 0; j < SudouSize; j++) {
          ar.push(0);
        }
        this._dataCells.push(ar);
      }

      for (let i = 0; i < SudouSize; i++) {
        for (let j = 0; j < SudouSize; j++) {
          const cell: SudouCell = new SudouCell();
          switch (this._dod) {
            case QuizDegreeOfDifficulity.medium: {
              if (Math.random() * 6 < 2) {
                cell.fixed = false;
                cell.num = null;
              } else {
                cell.fixed = true;
                cell.num = datrst[i][j];
              }
            }
            break;

            case QuizDegreeOfDifficulity.easy: {
              if (Math.random() * 9 < 2) {
                cell.fixed = false;
                cell.num = null;
              } else {
                cell.fixed = true;
                cell.num = datrst[i][j];
              }
            }
            break;

            case QuizDegreeOfDifficulity.hard:
            default: {
              if (Math.random() * 3 < 2) {
                cell.fixed = false;
                cell.num = null;
              } else {
                cell.fixed = true;
                cell.num = datrst[i][j];
              }
            }
            break;
          }
          cell.exp_num = datrst[i][j];

          this._dataCells[i][j] = cell;
        }
      }

      this.onDraw();
    }
  }

  ngOnDestroy() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngOnDestroy of PgSudouComponent');
    }
  }

  private onDraw() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering onDraw in PgSudouComponent');
    }

    const cvBuffer = null;
    const ctx2 = this.canvasSudou.nativeElement.getContext('2d');

    ctx2.fillStyle = '#ffffff';
    ctx2.fillRect(0, 0, this._width, this._height);
    ctx2.font = 'Bold ' + this._itemWidth / 1.5 + 'px Roboto';

    for (let i = 0; i < SudouSize; i++) {
      for (let j = 0; j < SudouSize; j++) {
        const cell: SudouCell = this._dataCells[i][j];

        if (cell.fixed) {
          ctx2.fillStyle = '#dddddd';
          ctx2.fillRect(j * this._itemWidth, i * this._itemHeight, this._itemWidth, this._itemHeight);
        }

        ctx2.fillStyle = '#008800';
        if (cell.num === null) {
        } else {
          if (cell.inConflict) {
            ctx2.fillStyle = 'red';
          } else if (cell.fixed) {
            ctx2.fillStyle = '#000000';
          } else {
            ctx2.fillStyle = '#008800';
          }
          ctx2.fillText(cell.num.toString(), (j + 0.3) * this._itemWidth, (i + 0.8) * this._itemHeight);
        }
      }
    }
    ctx2.lineWidth = 1.0;
    ctx2.strokeStyle = '#000000';
    for (let i = 0; i < 10; i++) {
      if (i % 3 === 0) {
        ctx2.lineWidth = 3.0;
      } else {
        ctx2.lineWidth = 1.0;
      }

      ctx2.beginPath();
      ctx2.moveTo(i * this._itemWidth, 0);
      ctx2.lineTo(i * this._itemWidth, this._height);

      ctx2.moveTo(0, i * this._itemHeight);
      ctx2.lineTo(this._width, i * this._itemHeight);

      ctx2.stroke();
    }
  }

  @HostListener('mousedown', ['$event'])
  public onSudouCanvasMouseDown(evt: MouseEvent) {
  }

  @HostListener('mouseup', ['$event'])
  public onSudouCanvasMouseUp(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering onSudouCanvasMouseUp of PgSudouComponent');
    }

    const loc = getCanvasMouseEventPosition(evt.target, evt);
    this.ProcessMouseClick(loc);
  }

  private ProcessMouseClick(pos: any) {
    if (this._editingCellIndex === null) {
      const index: any = getCanvasCellPosition(pos, this._itemWidth, this._itemHeight);
      if (index.row < 0 || index.row > 8 || index.column < 0 || index.column > 8) {
        this._editingCellIndex = null;
        this._editPanel = null;

        this.onDraw();
        return;
      }

      const cell: SudouCell = this._dataCells[index.row][index.column];
      if (cell.fixed === true) {
        this._editingCellIndex = null;
        this._editPanel = null;
        this.onDraw();
        return;
      }

      this._editingCellIndex = index;
      const nList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this._editPanel = new SudouEditPanel(pos.x, pos.y, this._itemWidth / 1.5, nList, this._width, this._height);
      const ctx2 = this.canvasSudou.nativeElement.getContext('2d');
      this._editPanel.Draw(ctx2);
    } else {
      const seleN = this._editPanel.GetHitNumber(pos.x, pos.y);
      if (seleN == null) {
        this._dataCells[this._editingCellIndex.row][this._editingCellIndex.column].N = null;
      } else if (seleN === -1) { // Out of the panel
        this._editingCellIndex = null;
        this._editPanel = null;

        this.onDraw();
        this.ProcessMouseClick(pos);
        return;
      } else {
        this._dataCells[this._editingCellIndex.row][this._editingCellIndex.column].num = seleN;
      }

      this._editingCellIndex = null;
      this._editPanel = null;

      this.checkAllConflicts();
      this.onDraw();

      if (this.checkFinish()) {
        this.finishEvent.emit(null);
      }
    }
  }

  private checkFinish() {
    this.checkAllConflicts();

    for (let i = 0; i < SudouSize; i++) {
      for (let j = 0; j < SudouSize; j++) {
        if (this._dataCells[i][j].num === null || this._dataCells[i][j].InConflict) {
          return false;
        }
      }
    }

    return true;
  }

  private checkAllConflicts() {
    for (let i = 0; i < SudouSize; i++) {
      for (let j = 0; j < SudouSize; j++) {
        this._dataCells[i][j].inConflict = this.checkConflict({ row: i, column: j });
      }
    }
  }

  private checkConflict(pos: SudouPosition) {
    const cell: SudouCell = this._dataCells[pos.row][pos.column];
    if (cell.num === null || cell.num === undefined) {
      return false;
    }

    for (let i = 0; i < SudouSize; i++) {
      if (this._dataCells[pos.row][i].num === cell.num && i !== pos.column) {
        return true;
      }
    }

    for (let i = 0; i < SudouSize; i++) {
      if (this._dataCells[i][pos.column].num === cell.num && i !== pos.row) {
        return true;
      }
    }

    const iStart: number = Math.floor(pos.row / 3) * 3;
    const jStart: number = Math.floor(pos.column / 3) * 3;

    for (let i: number = iStart; i < iStart + 3; i++) {
      for (let j: number = jStart; j < jStart + 3; j++) {
        if (this._dataCells[i][j].num === cell.num && i !== pos.row && j !== pos.column) {
          return true;
        }
      }
    }

    return false;
  }
}
