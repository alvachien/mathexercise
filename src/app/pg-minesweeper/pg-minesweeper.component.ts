import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, Input, HostListener } from '@angular/core';
import {
  LogLevel, QuizDegreeOfDifficulity, getCanvasMouseEventPosition, getCanvasCellPosition,
  CanvasCellPositionInf, MineSweeper, MatrixPosIntf
} from '../model';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material';

enum MineSweeperCellType {
  // Blank = 0
  // 0 = 1
  Flag = 2,
  Question = 3,
  Mine = 4,
  Explosion = 5,
  Error = 6
}

@Component({
  selector: 'app-pg-minesweeper',
  templateUrl: './pg-minesweeper.component.html',
  styleUrls: ['./pg-minesweeper.component.scss']
})
export class PgMinesweeperComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasmine') canvasMine: ElementRef;
  @ViewChild('gametags') gametags: ElementRef;
  @ViewChild('gametime') gametime: ElementRef;
  @Output() startedEvent: EventEmitter<any> = new EventEmitter();
  @Output() finishedEvent: EventEmitter<boolean> = new EventEmitter(false);

  /**
   * Degree of difficulity
   */
  @Input()
  set mineSweepDoD(dod: QuizDegreeOfDifficulity) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering setter of minSweepDoD in PgMinesweeperComponent' + dod.toString());
    }

    if (this._dod !== dod) {
      this._dod = dod;
    }
  }

  PANE_SIZE = 24;

  private _instance: MineSweeper;
  private _notTaged: number;
  private _dod: QuizDegreeOfDifficulity;
  get ComponentWidth(): number {
    return this._instance.Width * this.PANE_SIZE + 42;
  }
  get ComponentHeight(): number {
    return this._instance.Height * this.PANE_SIZE + 136;
  }

  oldPos: CanvasCellPositionInf;
  time = 0;
  notTaged = 0;
  mousedownArr: any;
  timer: any;

  constructor(private snackBar: MatSnackBar) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering constructor in PgMinesweeperComponent');
    }

    this._instance = new MineSweeper();
    this._instance.Width = 30;
    this._instance.Height = 16;
  }

  ngOnInit(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngOnInit in PgMinesweeperComponent');
    }
  }

  ngAfterViewInit(): void {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngAfterViewInit in PgMinesweeperComponent');
    }

    if (this.canvasMine !== null) {
      this.canvasMine.nativeElement.width = this.PANE_SIZE * this._instance.Width;
      this.canvasMine.nativeElement.height = this.PANE_SIZE * this._instance.Height;
    }

    switch (this._dod) {
      case QuizDegreeOfDifficulity.easy: this._instance.TotalMines = 9; break;
      case QuizDegreeOfDifficulity.medium: this._instance.TotalMines = 49; break;
      case QuizDegreeOfDifficulity.hard:
      default:
        this._instance.TotalMines = 99;
        break;
    }

    this.onReset();
  }

  onReset() {
    // Clean up variables
    this.oldPos = { row: 0, column: 0 };
    this._instance.init();
    this.time = 0;
    this.notTaged = this._instance.TotalMines;

    // this.setNumberImage(this.notTaged, true);
    // this.setNumberImage(this.time, false);
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }

    // Draw the border
    this.drawWholeRect();
    // Draw the initial cells
    this.drawInitCells();

    // Prevent right menu
    this.preRightMenu();
  }

  private preRightMenu() {
    this.canvasMine.nativeElement.oncontextmenu = event => {
      if (document.all) {
        window.event.returnValue = false; // for IE
      } else {
        event.preventDefault();
      }
    };
  }

  private drawWholeRect(): void {
    const ctx2 = this.canvasMine.nativeElement.getContext('2d');
    ctx2.clearRect(0, 0, this.canvasMine.nativeElement.width, this.canvasMine.nativeElement.height);
    ctx2.save();

    const grd = ctx2.createRadialGradient(
      Math.round(this.PANE_SIZE * this._instance.Width / 2),
      Math.round(this.PANE_SIZE * this._instance.Height / 2),
      5,
      Math.round(this.PANE_SIZE * this._instance.Width / 2),
      Math.round(this.PANE_SIZE * this._instance.Height / 2),
      Math.round(this.PANE_SIZE * this._instance.Width / 2));
    grd.addColorStop(0, 'red');
    grd.addColorStop(1, 'white');
    ctx2.fillStyle = grd;
    ctx2.fillRect(0, 0, this.canvasMine.nativeElement.width, this.canvasMine.nativeElement.height);
    ctx2.restore();

    for (let i = 0; i <= this._instance.Height; i++) {
      ctx2.beginPath();
      ctx2.moveTo(0, i * this.PANE_SIZE);
      ctx2.lineTo(this._instance.Width * this.PANE_SIZE, i * this.PANE_SIZE);
      ctx2.closePath();
      ctx2.stroke();
    }

    for (let i = 0; i <= this._instance.Width; i++) {
      ctx2.beginPath();
      ctx2.moveTo(i * this.PANE_SIZE, 0);
      ctx2.lineTo(i * this.PANE_SIZE, this._instance.Width * this.PANE_SIZE);
      ctx2.closePath();
      ctx2.stroke();
    }
  }

  private drawInitCells(): void {
    // for (let i = 0; i < this._instance.cells.length; i ++) {
    //   for (let j = 0; j < this._instance.cells[i].length; j ++) {
    //     this.drawCell({row: i, column:j}, 1);
    //   }
    // }
  }

  private roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();
  }

  // @HostListener('mousemove', ['$event'])
  // public onMineSweeperCanvasMouseMove(evt: MouseEvent) {
  //   if (environment.LoggingLevel >= LogLevel.Debug) {
  //     console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseMove of mousemove event`
  //      + `in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
  //   }

  //   const pos = getCanvasCellPosition(getCanvasMouseEventPosition(this.canvasMine.nativeElement, evt), this.PANE_SIZE, this.PANE_SIZE);
  //   if (environment.LoggingLevel >= LogLevel.Debug) {
  //     console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
  //   }

  //   const oldPos = this.oldPos;
  //   const arCells = this.arCells;

  //   if (pos.row === oldPos.row && pos.column === oldPos.column) {
  //     return;
  //   }

  //   if (this.isValidCellPosition(oldPos) && (arCells[oldPos.row][oldPos.column].isOpened === false
  //     && arCells[oldPos.row][oldPos.column].tag === 0)) {
  //     this.drawCell(oldPos, 1);
  //   }

  //   if (this.isValidCellPosition(pos) && (arCells[pos.row][pos.column].isOpened === true || arCells[pos.row][pos.column].tag !== 0)) {
  //     this.oldPos = pos;
  //     return;
  //   }

  //   this.drawCell(pos, 2);
  //   this.oldPos = pos;
  // }

  // @HostListener('mouseout', ['$event'])
  // public onMineSweeperCanvasMouseOut(evt: MouseEvent) {
  //   if (environment.LoggingLevel >= LogLevel.Debug) {
  //     console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseOut of mouseout event`
  //      + `in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
  //   }

  //   let pos = this.oldPos;
  //   if (environment.LoggingLevel >= LogLevel.Debug) {
  //     console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
  //   }

  //   if (this.isValidCellPosition(pos) && (this.arCells[pos.row][pos.column].isOpened === true
  //      || this.arCells[pos.row][pos.column].tag !== 0)) {
  //     return;
  //   }

  //   this.drawCell(pos, 1);
  //   pos = { row: 0, column: 0};
  // }

  @HostListener('mouseup', ['$event'])
  public onCanvasMouseUp(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseUp [mouseup]
        in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
    }

    const pos = getCanvasCellPosition(getCanvasMouseEventPosition(this.canvasMine.nativeElement, evt), this.PANE_SIZE, this.PANE_SIZE);
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
    }
    if (!this._instance.isValidCellPosition(pos)) {
      return;
    }

    if (this._instance.IsMineGenerated === false) {
      // Ensure the first click is not a mine!
      // Therefore generate the mines exclude the current position
      this._instance.generateMines(pos);

      // Trigger the timer
      this.timer = setInterval(() => {
        this.time = this.time + 1;

        this.setNumberImage(this.time, false);
      }, 1000);
    }

    this.onMouseupPostPorcessing(pos, evt);
  }

  @HostListener('mousedown', ['$event'])
  public onCanvasMouseDown(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseDown [mousedown] event
        in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
    }

    const pos = getCanvasCellPosition(getCanvasMouseEventPosition(this.canvasMine.nativeElement, evt), this.PANE_SIZE, this.PANE_SIZE);
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
    }
    if (!this._instance.isValidCellPosition(pos)) {
      return;
    }

    const theCell = this._instance.cells[pos.row][pos.column];
    if (theCell.isOpened === true) {
      const aroundMineNum = this._instance.calcNumberOfMinesAround(pos);
      const unknownArr = this._instance.calcUnknownCellAround(pos);
      const tagNum = this._instance.calcTaggedCellsAround(pos);

      if (aroundMineNum !== tagNum) {
        for (let t = 0; t < unknownArr.length; t++) {
          this.drawCellNum(unknownArr[t], 0);
        }

        this.mousedownArr = unknownArr;
      }
    }
  }

  private onMouseupPostPorcessing(pos: CanvasCellPositionInf, evnt: MouseEvent) {
    const curCell = this._instance.cells[pos.row][pos.column];

    if (curCell.isOpened) {
      if (evnt !== undefined) {
        // Workout the around cells
        const aroundMineNum = this._instance.calcNumberOfMinesAround(pos);
        const unknownArr = this._instance.calcUnknownCellAround(pos);
        const tagNum = this._instance.calcTaggedCellsAround(pos);

        if (aroundMineNum === tagNum) {
          for (let t = 0, uLen = unknownArr.length; t < uLen; t++) {
            this.onMouseupPostPorcessing(unknownArr[t], undefined);
          }
        } else {
          const mousedownArr = this.mousedownArr;
          if (mousedownArr !== '') {
            for (let m = 0; m < mousedownArr.length; m++) {
              this.drawCellNum(mousedownArr[m], 0);
            }
          }

          this.mousedownArr = '';
        }
      }

      return;
    }

    const tag = curCell.tag;
    if (evnt && evnt.button === 2) {
      if (tag === 0) {
        this.drawCellFlag(pos);
        curCell.tag = 1;
        this.notTaged--;
        this.setNumberImage(this.notTaged, true);
      } else if (tag === 1) {
        this.drawCellQuestion(pos);
        curCell.tag = 2;
        this.notTaged++;
        this.setNumberImage(this.notTaged, true);
      } else if (tag === 2) {
        this.drawCellNum(pos, 0);
        curCell.tag = 0;
      }
      return;
    }

    if (tag !== 0) {
      return;
    }

    if (curCell.isMine) {
      // Failed!
      this.discoverAllMines();
      this.drawCellExplosion(pos);

      this.onFinishedWithFailed();
    } else {
      this.drawCellNum(pos, 0);

      const aroundMineNum = this._instance.calcNumberOfMinesAround(pos);
      curCell.isOpened = true;

      if (aroundMineNum !== 0) {
        this.drawCellNum(pos, aroundMineNum);
      } else {
        let zeroArr = [];
        zeroArr.push(pos);
        zeroArr = this._instance.fetchZeroMinesAround(pos, zeroArr);
        this.openZeroCellArr(zeroArr);
      }
    }

    const okNum = this._instance.Width * this._instance.Height - this._instance.TotalMines;
    let openNum = 0;
    for (let i = 0; i < this._instance.cells.length; i++) {
      for (let j = 0; j < this._instance.cells[i].length; j++) {
        if (this._instance.isCellOpened({ row: i, column: j }) === true) {
          openNum++;
        }
      };
    }

    if (openNum === okNum) {
      this.onFinishedWithSuccess();
    }
  }

  discoverAllMines() {
    let pos: CanvasCellPositionInf = undefined;
    for (let i = 0; i < this._instance.cells.length; i++) {
      for (let j = 0; j < this._instance.cells[i].length; j++) {
        if (this._instance.cells[i][j].isMine === true) {
          this.drawCellMine({row: i, column: j});
        } if (this._instance.cells[i][j].isMine === false && this._instance.cells[i][j].tag === 1) {
          this.drawCellError({row: i, column: j});
        }
      }
    }
  }

  openZeroCellArr(zeroArr: CanvasCellPositionInf[]) {
    for (let i = 0; i < zeroArr.length; i++) {
      if (!this._instance.isAMineCell(zeroArr[i])) {
        this.openZeroCell(zeroArr[i]);
      }
    };
  }

  openZeroCell(pos: CanvasCellPositionInf) {
    const aroundArr = this._instance.getAroundCells(pos);
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      if (this._instance.isValidCellPosition(aroundArr[i])) {
        this._instance.cells[aroundArr[i].row][aroundArr[i].column].isOpened = true;
        aroundMineNum = this._instance.calcNumberOfMinesAround(aroundArr[i]);
        this.drawCellNum(aroundArr[i], aroundMineNum);
      }
    }
  }

  drawCellFlag(pos: CanvasCellPositionInf): void {
    const area = this.getCellArea(pos);
    const ctx = this.canvasMine.nativeElement.getContext('2d');

    const image = new Image();
    image.src = environment.AppHost + '/assets/image/mineresource/flag.png';
    image.onload = () => {
      ctx.drawImage(image, area[0], area[1], this.PANE_SIZE, this.PANE_SIZE);
    };
  }

  drawCellQuestion(pos: CanvasCellPositionInf): void {
    const area = this.getCellArea(pos);
    const ctx = this.canvasMine.nativeElement.getContext('2d');

    const image = new Image();
    image.src = environment.AppHost + '/assets/image/mineresource/questionmark.png';
    image.onload = () => {
      ctx.drawImage(image, area[0], area[1], this.PANE_SIZE, this.PANE_SIZE);
    };
  }

  drawCellExplosion(pos: CanvasCellPositionInf): void {
    const area = this.getCellArea(pos);
    const ctx = this.canvasMine.nativeElement.getContext('2d');

    const image = new Image();
    image.src = environment.AppHost + '/assets/image/mineresource/explosion.png';
    image.onload = () => {
      ctx.drawImage(image, area[0], area[1], this.PANE_SIZE, this.PANE_SIZE);
    };
  }

  drawCellMine(pos: CanvasCellPositionInf): void {
    const area = this.getCellArea(pos);
    const ctx = this.canvasMine.nativeElement.getContext('2d');

    const image = new Image();
    image.src = environment.AppHost + '/assets/image/mineresource/mine.png';
    image.onload = () => {
      ctx.drawImage(image, area[0], area[1], this.PANE_SIZE, this.PANE_SIZE);
    };
  }

  drawCellError(pos: CanvasCellPositionInf): void {
    const area = this.getCellArea(pos);
    const ctx = this.canvasMine.nativeElement.getContext('2d');

    ctx.fillText(' X ', area[0], area[1]);
  }

  drawCellNum(pos: CanvasCellPositionInf, num: number) {
    const ctx2 = this.canvasMine.nativeElement.getContext('2d');
    const area = this.getCellArea(pos);
    // let image = new Image();
    // image.src = environment.AppHost + '/assets/image/mineresource/' + num + '.jpg';
    // image.onload = () => {
    //   cxt.drawImage(image, area[0], area[1], this.PANE_SIZE, this.PANE_SIZE);
    // };

    ctx2.save();
    ctx2.fillStyle = 'rgba(0, 0, 49, 0.7)';
    ctx2.clearRect(area[0], area[1], this.PANE_SIZE, this.PANE_SIZE);
    ctx2.fillRect(area[0], area[1], this.PANE_SIZE, this.PANE_SIZE);
    ctx2.fillStyle = 'white';
    ctx2.font = '24px Roboto';
    if (num > 0) {
      ctx2.fillText(num.toString(), area[0] + Math.round(this.PANE_SIZE / 4), area[1] + Math.round(this.PANE_SIZE * 4 / 5), this.PANE_SIZE);
    }    
    ctx2.restore();
  }

  private getCellArea(pos: CanvasCellPositionInf) {
    return [pos.column * this.PANE_SIZE, pos.row * this.PANE_SIZE];
  }

  private onFinishedWithSuccess() {
    this.onFinishedImpl(true);
  }

  private onFinishedWithFailed() {
    this.onFinishedImpl(false);
  }

  private onFinishedImpl(rst: boolean) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    // It is finished!
    let snackBarRef: any = this.snackBar.open(rst ? 'You Win' : 'You Lose', 'CLOSE', {
      duration: 2000
    });

    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.finishedEvent.emit(rst);
    });
  }

  /**
   * Get prefix interger
   * @param num Number to process
   * @param length Length
   */
  private getPrefixInteger(num: number, length: number): string {
    if (num > 999) {
      num = 999;
    } else if (num < 0) {
      num = 0;
    }

    return (Array(length).join('0') + num).slice(-length);
  }

  /**
   * Set number image
   * @param num Number to set
   * @param bTag Tag of Mine or tag of times
   */
  private setNumberImage(num: number, bTag: boolean): void {
    const snum: string = this.getPrefixInteger(num, 3);

    if (bTag) {
      const childelem = this.gametags.nativeElement.getElementsByTagName('img');
      for (let i = 0; i < childelem.length; i++) {
        childelem[i].src = environment.AppHost + '/assets/image/mineresource/d' + snum.charAt(i) + '.jpg';
      }
    } else {
      const childelem = this.gametime.nativeElement.getElementsByTagName('img');
      for (let i = 0; i < childelem.length; i++) {
        childelem[i].src = environment.AppHost + '/assets/image/mineresource/d' + snum.charAt(i) + '.jpg';
      }
    }
  }
}
