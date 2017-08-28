import { Component, ViewChild, ElementRef, AfterContentInit, OnInit, Renderer, HostListener } from '@angular/core';
import { RPN, SudouUnit, Sudou, generateValidSudou, SudouSize } from '../model';
import { MdTabChangeEvent } from '@angular/material';

export class SudouCell {
  num: number;
  exp_num: number;
  fixed: boolean = true;
  allowInput: boolean;
  inConflict: boolean = false;

  public toString(): string {
    if (this.num === null || this.num === undefined) {
      return '';
    }

    return this.num.toString();
  }
}

export interface SudouPosition {
  row: number;
  column: number;
}

function InArray(obj, arr) {
  for (var i in arr) {
    if (arr[i] == obj) {
      return true;
    }
  }
  return false;
}

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
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.0;
    ctx.strokeRect(this._drawX, this._drawY, this._w, this._h);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.0;
    for (var i = 1; i <= SudouSize; i++) {
      var itemX = this._drawX + ((i - 1) % 3) * this._itemWidth;
      var itemY = this._drawY + Math.floor((i - 1) / 3) * this._itemWidth;
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(
        itemX,
        itemY,
        this._itemWidth, this._itemWidth);

      if (InArray(i, this._nlist)) {
        ctx.fillStyle = "green";
        ctx.font = "Bold " + (this._itemWidth / 2) + "px Arial";
        ctx.fillText(i.toString(), itemX + this._itemWidth / 3, itemY + this._itemWidth / 1.5);
      }
    }
  }

  public GetHitNumber(x, y) {
    var j = Math.floor((x - this._drawX) / this._itemWidth);
    var i = Math.floor((y - this._drawY) / this._itemWidth);

    if (j < 0 || j > 2 || i < 0 || i > 3) {
      return -1;
    }

    if (i === 3)
      return null;

    var n = i * 3 + j + 1;

    if (!InArray(n, this._nlist)) {
      return null;
    }

    return n;
  }
}

@Component({
  selector: 'app-puzzle-games',
  templateUrl: './puzzle-games.component.html',
  styleUrls: ['./puzzle-games.component.scss']
})
export class PuzzleGamesComponent implements OnInit, AfterContentInit {

  /**
   * UI part
   */
  indexTab: number;

  /**
   * Cal24 part
   */
  Cal24Input: string = '';
  Cal24items: number[] = [];
  IsCal24Start: boolean = false;
  IsCal24PrvSuccess: boolean = false;
  IsCal24ShowError: boolean = false;
  Cal24PrvSuccess: string = '';
  Cal24PrvError: string = '';
  Cal24SurrendString: string = '';
  Cal24NumberRangeBgn: number = 1;
  Cal24NumberRangeEnd: number = 9;

  /**
   * Sudou part
   */
  @ViewChild('canvassudou') canvasSudou: ElementRef;
  objSudou: Sudou;
  sudouWidth: number;
  sudouHeight: number;
  sudouItemWidth: number;
  sudouItemHeight: number;
  sudouEditingCellIndex: any = null;
  sudouEditPanel: SudouEditPanel = null;
  sudouDataCells: any = [];
  IsSudouStart: boolean = false;

  constructor() {
    this.indexTab = 0; // Defaul tab
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // this.canvasSudou.nativeElement.addEventListener('mousemove', that.onSudouCanvasMouseMove, false);
    // this.canvasSudou.nativeElement.addEventListener('mousedown', that.onSudouCanvasMouseDown, false);
    // this.canvasSudou.nativeElement.addEventListener('mouseup', that.onSudouCanvasMouseUp, false);

    this.sudouWidth = this.canvasSudou.nativeElement.width;
    this.sudouHeight = this.canvasSudou.nativeElement.height;
    this.sudouItemWidth = this.sudouWidth / SudouSize;
    this.sudouItemHeight = this.sudouHeight / SudouSize;
  }

  public onTabSelectChanged(event: MdTabChangeEvent) {
    //console.log(event);
    this.indexTab = event.index;
  }

  /**
   * Cal24 part
   */
  private Cal24(arnum: any[], nlen: number, targetNum: number): boolean {
    const opArr = new Array("+", "-", "*", "/");
    for (let i = 0; i < nlen; i++) {
      for (let j = i + 1; j < nlen; j++) {
        let numij = [arnum[i], arnum[j]];
        arnum[j] = arnum[nlen - 1];
        for (let k: number = 0; k < opArr.length; k++) {
          let k1: number = k % 2;
          let k2: number = 0;
          if (!k1) {
            k2 = 1;
          }
          arnum[i] = '(' + numij[k1] + opArr[k] + numij[k2] + ')';
          if (this.Cal24(arnum, nlen - 1, targetNum)) {
            this.Cal24SurrendString = arnum[0];
            return true;
          }
        }
        arnum[i] = numij[0];
        arnum[j] = numij[1];
      }
    }

    let objRN = new RPN();
    let tmprest = objRN.buildExpress(arnum[0]);
    let result = objRN.WorkoutResult();

    return (nlen === 1) && (result === targetNum);
  }

  public CanCal24Start(): boolean {
    if (this.IsCal24Start) {
      return false;
    }
    return true;
  }
  public OnCal24Start(): void {

    this.Cal24Input = ''; // Clear the inputs
    this.Cal24items = [];
    while (this.Cal24items.length < 4) {
      let nNum = Math.floor(Math.random() * (this.Cal24NumberRangeEnd - this.Cal24NumberRangeBgn)) + this.Cal24NumberRangeBgn;
      let nExistIdx = this.Cal24items.findIndex((val) => { return val === nNum; });
      if (nExistIdx === -1) {
        this.Cal24items.push(nNum);
      }
    }
    this.IsCal24Start = true;
  }
  public CanCal24Submit(): boolean {
    if (!this.IsCal24Start) {
      return false;
    }
    if (this.Cal24Input.length <= 0) {
      return false;
    }

    for (let ch of this.Cal24Input) {
      if (ch === '('
        || ch === ')'
        || ch === '+'
        || ch === '-'
        || ch === '*'
        || ch === '/'
      ) {
        continue;
      } else {
        let nch = parseInt(ch);
        let nExistIdx = this.Cal24items.findIndex((val) => { return val === nch; });
        if (nExistIdx === -1) {
          return false;
        }
      }
    }

    return true;
  }

  public OnCal24Submit(): void {
    this.IsCal24ShowError = false;
    let rst: number = <number>eval(this.Cal24Input);
    if (rst !== 24) {
      // Failed!
      this.IsCal24ShowError = true;
      this.Cal24PrvError = this.Cal24Input + ' = ' + rst.toString() + ' != 24';
    } else {
      this.Cal24PrvSuccess = this.Cal24Input + ' = 24';
      this.IsCal24PrvSuccess = true;
      this.IsCal24Start = false;
    }
  }

  public OnCal24Surrender(): void {
    let arnums: number[] = [];
    for (let n of this.Cal24items) {
      arnums.push(n);
    }

    if (this.Cal24(arnums, arnums.length, 24)) {
      this.IsCal24ShowError = true;
      this.Cal24PrvError = this.Cal24SurrendString + ' = 24';
    } else {
      // No suitable results
      this.IsCal24PrvSuccess = false;
      this.IsCal24Start = false;
    }
  }


  /**
   * Sudou part
   */
  public CanSudouStart(): boolean {
    if (this.IsSudouStart) {
      return false;
    }

    return true;
  }

  public OnSudouStart(): void {
    this.IsSudouStart = true;
    this.objSudou = generateValidSudou();

    let datrst = this.objSudou.getDataCells();
    this.sudouDataCells = [];
    for (let i: number = 0; i < SudouSize; i++) {
      let ar = [];
      for (let j: number = 0; j < SudouSize; j++) {
        ar.push(0);
      }
      this.sudouDataCells.push(ar);
    }

    for (let i: number = 0; i < SudouSize; i++) {
      for (let j: number = 0; j < SudouSize; j++) {
        let cell: SudouCell = new SudouCell();
        if (Math.random() * 6 < 2) {
          cell.fixed = false;
          cell.num = null;
        } else {
          cell.fixed = true;
          cell.num = datrst[i][j];
        }
        cell.exp_num = datrst[i][j];

        this.sudouDataCells[i][j] = cell;
      }
    }

    this.SudouDraw();
  }

  private SudouDraw() {

    let cvBuffer = null;
    let ctx2 = this.canvasSudou.nativeElement.getContext("2d");

    ctx2.fillStyle = "#ffffff";
    ctx2.fillRect(0, 0, this.sudouWidth, this.sudouHeight);
    ctx2.font = "Bold " + this.sudouItemWidth / 1.5 + "px Roboto";

    for (let i: number = 0; i < SudouSize; i++) {
      for (let j: number = 0; j < SudouSize; j++) {
        let cell: SudouCell = this.sudouDataCells[i][j];

        if (cell.fixed) {
          ctx2.fillStyle = "#dddddd";
          ctx2.fillRect(j * this.sudouItemWidth, i * this.sudouItemHeight, this.sudouItemWidth, this.sudouItemHeight);
        }

        ctx2.fillStyle = "#008800";
        if (cell.num === null) {
        }
        else {
          if (cell.inConflict) {
            ctx2.fillStyle = "red";
          }
          else if (cell.fixed) {
            ctx2.fillStyle = "#000000";
          }
          else {
            ctx2.fillStyle = "#008800";
          }
          ctx2.fillText(cell.num.toString(), (j + 0.3) * this.sudouItemWidth, (i + 0.8) * this.sudouItemHeight);
        }
      }
    }
    ctx2.lineWidth = 1.0;
    ctx2.strokeStyle = "#000000";
    for (var i = 0; i < 10; i++) {
      if (i % 3 == 0) {
        ctx2.lineWidth = 3.0;
      }
      else {
        ctx2.lineWidth = 1.0;
      }

      ctx2.beginPath();
      ctx2.moveTo(i * this.sudouItemWidth, 0);
      ctx2.lineTo(i * this.sudouItemWidth, this.sudouHeight);

      ctx2.moveTo(0, i * this.sudouItemHeight);
      ctx2.lineTo(this.sudouWidth, i * this.sudouItemHeight);

      ctx2.stroke();
    }
  }

  @HostListener('mousemove', ['$event'])
  public onSudouCanvasMouseMove(evt: MouseEvent) {
  }

  @HostListener('mousedown', ['$event'])
  public onSudouCanvasMouseDown(evt: MouseEvent) {
  }

  @HostListener('mouseup', ['$event'])
  public onSudouCanvasMouseUp(evt: MouseEvent) {
    if (this.indexTab === 1 && this.IsSudouStart) {
      let loc = this.getPointOnCanvas(evt.target, evt.clientX, evt.clientY);
      this.ProcessMouseClick(loc);
    }
  }

  private getCellIndex(pos: any) {
    var j = Math.floor(pos.x / this.sudouItemWidth);
    var i = Math.floor(pos.y / this.sudouItemHeight);
    return {
      j: j,
      i: i
    };
  }

  private ProcessMouseClick(pos: any) {
    if (this.sudouEditingCellIndex === null) {
      let index: any = this.getCellIndex(pos);
      if (index.i < 0 || index.i > 8 || index.j < 0 || index.j > 8) {
        this.sudouEditingCellIndex = null;
        this.sudouEditPanel = null;

        this.SudouDraw();
        return;
      }

      let cell: SudouCell = this.sudouDataCells[index.i][index.j];
      if (cell.fixed == true) {
        this.sudouEditingCellIndex = null;
        this.sudouEditPanel = null;
        this.SudouDraw();
        return;
      }

      this.sudouEditingCellIndex = index;
      let nList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      this.sudouEditPanel = new SudouEditPanel(pos.x, pos.y, this.sudouItemWidth / 1.5, nList, this.sudouWidth, this.sudouHeight);
      let ctx2 = this.canvasSudou.nativeElement.getContext("2d");
      this.sudouEditPanel.Draw(ctx2);
    } else {
      let seleN = this.sudouEditPanel.GetHitNumber(pos.x, pos.y);
      if (seleN == null) {
        this.sudouDataCells[this.sudouEditingCellIndex.i][this.sudouEditingCellIndex.j].N = null;
      }
      else if (seleN === -1) { // Out of the panel
        this.sudouEditingCellIndex = null;
        this.sudouEditPanel = null;

        this.SudouDraw();
        this.ProcessMouseClick(pos);
        return;
      } else {
        this.sudouDataCells[this.sudouEditingCellIndex.i][this.sudouEditingCellIndex.j].num = seleN;
      }

      this.sudouEditingCellIndex = null;
      this.sudouEditPanel = null;

      this.sudouCheckAllConflicts();
      this.SudouDraw();

      if (this.sudouCheckFinish()) {
        alert('Finished!');
        this.IsSudouStart = false;
      }
    }
  }

  private sudouCheckFinish() {
    this.sudouCheckAllConflicts();

    for (let i: number = 0; i < SudouSize; i++) {
      for (let j: number = 0; j < SudouSize; j++) {
        if (this.sudouDataCells[i][j].num === null || this.sudouDataCells[i][j].InConflict)
          return false;
      }
    }

    return true;
  }

  private sudouCheckAllConflicts() {
    for (let i: number = 0; i < SudouSize; i++) {
      for (let j: number = 0; j < SudouSize; j++) {
        this.sudouDataCells[i][j].inConflict = this.sudouCheckConflict({ row: i, column: j });
      }
    }
  }

  private sudouCheckConflict(pos: SudouPosition) {
    let cell: SudouCell = this.sudouDataCells[pos.row][pos.column];
    if (cell.num === null || cell.num === undefined) {
      return false;
    }

    for (let i: number = 0; i < SudouSize; i++) {
      if (this.sudouDataCells[pos.row][i].num === cell.num && i !== pos.column) {
        return true;
      }
    }

    for (let i: number = 0; i < SudouSize; i++) {
      if (this.sudouDataCells[i][pos.column].num === cell.num && i !== pos.row) {
        return true;
      }
    }

    let iStart: number = Math.floor(pos.row / 3) * 3;
    let jStart: number = Math.floor(pos.column / 3) * 3;

    for (let i: number = iStart; i < iStart + 3; i++) {
      for (let j: number = jStart; j < jStart + 3; j++) {
        if (this.sudouDataCells[i][j].num === cell.num && i !== pos.row && j !== pos.column) {
          return true;
        }
      }
    }

    return false;
  }

  private getPointOnCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    var x2 = (x - bbox.left) * (canvas.width / bbox.width);
    var y2 = (y - bbox.top) * (canvas.height / bbox.height);
    return {
      x: x2,
      y: y2
    };
  }
}
