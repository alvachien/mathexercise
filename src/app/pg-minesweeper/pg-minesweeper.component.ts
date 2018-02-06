import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { LogLevel, QuizDegreeOfDifficulity, getCanvasMouseEventPosition, getCanvasCellPosition,
  CanvasCellPositionInf, MineSweeper, MatrixPosIntf } from '../model';
import { environment } from '../../environments/environment';

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

  PANE_SIZE = 16;

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
  // Image arrays
  arImgUrls: string[] = [];
  arMines: CanvasCellPositionInf[] = [];
  time = 0;
  notTaged = 0;
  mousedownArr: any;
  timer: any;

  constructor() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering constructor in PgMinesweeperComponent');
    }

    this._instance = new MineSweeper();
    this._instance.Width = 30;
    this._instance.Height = 16;

    // Array of image urls
    this.arImgUrls = ['../../assets/image/mineresource/blank.jpg',
      '../../assets/image/mineresource/0.jpg',
      '../../assets/image/mineresource/flag.jpg',
      '../../assets/image/mineresource/ask.jpg',
      '../../assets/image/mineresource/mine.png',
      '../../assets/image/mineresource/blood.jpg',
      '../../assets/image/mineresource/error.jpg',
    ];
  }

  ngOnInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngOnInit in PgMinesweeperComponent');
    }
  }

  ngAfterViewInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngAfterViewInit in PgMinesweeperComponent');
    }

    if (this.canvasMine !== null) {
      this.canvasMine.nativeElement.width = this.PANE_SIZE * this._instance.Width;
      this.canvasMine.nativeElement.height = this.PANE_SIZE * this._instance.Height;
    }

    switch (this.mineSweepDoD) {
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

    for (let i = 0; i <= this._instance.Height; i ++) {
      ctx2.beginPath();
      ctx2.moveTo(0, i * this.PANE_SIZE);
      ctx2.lineTo(this._instance.Width * this.PANE_SIZE, i * this.PANE_SIZE);
      ctx2.closePath();
      ctx2.stroke();
    }

    for (let i = 0; i <= this._instance.Width; i++ ) {
      ctx2.beginPath();
      ctx2.moveTo(i * this.PANE_SIZE, 0);
      ctx2.lineTo(i * this.PANE_SIZE, this._instance.Width * this.PANE_SIZE);
      ctx2.closePath();
      ctx2.stroke();
    }
  }

  private drawInitCells(): void {
    for (let i = 0; i < this._instance.cells.length; i ++) {
      for (let j = 0; j < this._instance.cells[i].length; j ++) {
        this.drawCell(i, j);
      }
    }
  }

  private drawCell(i: number, j: number) {
    if (!this._instance.isValidCellPosition({row: i, column: j})) {
      return;
    }

    const ctx2 = this.canvasMine.nativeElement.getContext('2d');

    const cell = this._instance.cells[i][j];
    if (cell.isOpened) {
      // Fix it with another color
      ctx2.save();
      ctx2.shadowOffsetX = 2;
      ctx2.shadowOffsetY = 2;
      ctx2.shadowBlur = 2;
      ctx2.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx2.fillText(cell.tag, i * this.PANE_SIZE, j * this.PANE_SIZE, this.PANE_SIZE);
    } else {
      this.roundedRect(ctx2, i * this.PANE_SIZE, j * this.PANE_SIZE, this.PANE_SIZE, this.PANE_SIZE, 3);
    }
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
  //     console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseMove of mousemove event in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
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
  //     console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseOut of mouseout event in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
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
      // const aroundMineNum = this.calAround(pos);
      // const unknownArr = this.getAroundUnknown(pos);
      // const tagNum = this.getAroundTag(pos);

      // if (aroundMineNum !== tagNum) {
      //   for (let t = 0; t < unknownArr.length; t++) {
      //     this.drawNum(unknownArr[t], 0);
      //   }

      //   this.mousedownArr = unknownArr;
      // }
    } else {

    }
  }

  private onMouseupPostPorcessing(pos: CanvasCellPositionInf, evnt: MouseEvent) {
    const curCell = this._instance.cells[pos.row][pos.column];
    if (!curCell.isOpened) {
      // Try to open the cell
      if (curCell.isMine) {
        // Game over!
      } else {
        // Workout the around cells

      }
    }
  }

  // getAroundUnknown(pos: CanvasCellPositionInf) {
  //   let unknowArr = [];
  //   let arCells = this.arCells;
  //   let aroundArr = this.getAroundCells(pos);

  //   for (let i = 0; i < aroundArr.length; i++) {
  //     if (this.isValidCellPosition(aroundArr[i]) && arCells[aroundArr[i].row][aroundArr[i].column].tag === 0
  //       && arCells[aroundArr[i].row][aroundArr[i].column].isOpened === false) {
  //       unknowArr.push(aroundArr[i]);
  //     }
  //   }

  //   return unknowArr;
  // }

  // getAroundTag(pos: CanvasCellPositionInf) {
  //   let arCells = this.arCells;
  //   let aroundArr = this.getAroundCells(pos);
  //   let tagNum = 0;

  //   for (let i = 0; i < aroundArr.length; i++) {
  //     if (this.isValidCellPosition(aroundArr[i]) && arCells[aroundArr[i].row][aroundArr[i].column].tag === 1) {
  //       tagNum++;
  //     }
  //   }

  //   return tagNum;
  // }

  // showMine() {
  //   let arMines = this.arMines;
  //   let pos: CanvasCellPositionInf = undefined;
  //   let area;

  //   for (let i = 0; i < arMines.length; i++) {
  //     pos = arMines[i];
  //     this.drawCell(pos, 5);
  //     this.arCells[pos.row][pos.column].isOpened = true;
  //   }
  // }

  // showWrongTag() {
  //   let paneheight = this._paneHeigh;
  //   let panewidth = this._paneWidth;

  //   for (let i = 1; i <= panewidth; i++) {
  //     for (let j = 1; j <= paneheight; j++) {
  //       if (this.arCells[i][j].isMine === false && this.arCells[i][j].tag === 1) {
  //         this.drawCell({row: i, column: j}, 7);
  //       }
  //     };
  //   }
  // }

  // calZeroMine(pos: CanvasCellPositionInf, zeroArr: CanvasCellPositionInf[]): CanvasCellPositionInf[] {
  //   let arCells = this.arCells;
  //   let aroundArr = this.getAroundCells(pos);
  //   let aroundMineNum = 0;

  //   for (let i = 0; i < aroundArr.length; i++) {
  //     aroundMineNum = this.calAround(aroundArr[i]);
  //     if (aroundMineNum === 0 && this.isValidCellPosition(aroundArr[i]) && arCells[aroundArr[i].row][aroundArr[i].column].isMine === false
  //       && !this.isInArray(aroundArr[i], zeroArr)) {
  //       zeroArr.push(aroundArr[i]);
  //       this.calZeroMine(aroundArr[i], zeroArr);
  //     }
  //   }

  //   return zeroArr;
  // }

  // openZeroArr(zeroArr: CanvasCellPositionInf[]) {
  //   for (let i = 0; i < zeroArr.length; i++) {
  //     if (!this.checkMine(zeroArr[i])) {
  //       this.openZero(zeroArr[i]);
  //     }
  //   };
  // }

  // openZero(pos: CanvasCellPositionInf) {
  //   let arCells = this.arCells;
  //   let aroundArr = this.getAroundCells(pos);
  //   let aroundMineNum = 0;

  //   for (let i = 0; i < aroundArr.length; i++) {
  //     if (this.isValidCellPosition(aroundArr[i])) {
  //       arCells[aroundArr[i][0]][aroundArr[i][1]].isOpened = true;
  //       aroundMineNum = this.calAround(aroundArr[i]);
  //       this.drawNum(aroundArr[i], aroundMineNum);
  //     }
  //   }
  // }

  // drawCell(pos: CanvasCellPositionInf, type) {
  //   let area = this.getCellArea(pos);
  //   let cxt = this.canvasMine.nativeElement.getContext('2d');

  //   let image = new Image();
  //   image.src = this.arImgUrls[type - 1];
  //   image.onload = () => {
  //     cxt.drawImage(image, area[0], area[1], 16, 16);
  //   };
  // }

  // drawNum(pos: CanvasCellPositionInf, num: number) {
  //   if (Number.isInteger(num)) {
  //     let area = this.getCellArea(pos);
  //     let cxt = this.canvasMine.nativeElement.getContext('2d');
  //     let image = new Image();
  //     image.src = '../../assets/image/mineresource/' + num + '.jpg';

  //     image.onload = function () {
  //       cxt.drawImage(image, area[0], area[1], 16, 16);
  //     }
  //   }
  // }

  // /**
  //  * Handler of Click
  //  */
  // onClick(pos: CanvasCellPositionInf, e) {
  //   let currentCell: MineSweepCell = this.arCells[pos.row][pos.column];

  //   if (currentCell.isOpened) {
  //     if (e) {
  //       let aroundMineNum = this.calAround(pos);
  //       let unknownArr = this.getAroundUnknown(pos);
  //       let tagNum = this.getAroundTag(pos);

  //       if (aroundMineNum === tagNum) {
  //         for (let t = 0, uLen = unknownArr.length; t < uLen; t++) {
  //           this.onClick(unknownArr[t], undefined);
  //         }
  //       } else {
  //         let mousedownArr = this.mousedownArr;
  //         if (mousedownArr !== '') {
  //           for (let m = 0; m < mousedownArr.length; m++) {
  //             this.drawCell(mousedownArr[m], 1);
  //           }
  //         }

  //         this.mousedownArr = '';
  //       }
  //     }

  //     return;
  //   }

  //   let tag = currentCell.tag;
  //   if (e && e.button === 2) {
  //     if (tag === 0) {
  //       this.drawCell(pos, 3);
  //       currentCell.tag = 1;
  //       this.notTaged--;
  //       this.setNumberImage(this.notTaged, true);
  //     } else if (tag === 1) {
  //       this.drawCell(pos, 4);
  //       currentCell.tag = 2;
  //       this.notTaged++;
  //       this.setNumberImage(this.notTaged, true);
  //     } else if (tag === 2) {
  //       this.drawCell(pos, 1);
  //       currentCell.tag = 0;
  //     }
  //     return;
  //   }
  //   if (tag !== 0) {
  //     return;
  //   }

  //   if (currentCell.isMine) {
  //     this.showMine();
  //     this.drawCell(pos, 6);
  //     this.showWrongTag();

  //     this.onFinishedWithFailed();
  //   } else {
  //     this.drawNum(pos, 0);
  //     const aroundMineNum = this.calAround(pos);
  //     if (aroundMineNum !== 0) {
  //       this.drawNum(pos, aroundMineNum);
  //     } else {
  //       let zeroArr = [];
  //       zeroArr.push(pos);
  //       zeroArr = this.calZeroMine(pos, zeroArr);
  //       this.openZeroArr(zeroArr);
  //     }
  //   }
  //   currentCell.isOpened = true;

  //   const okNum = this._paneWidth * this._paneHeigh - this._minenum;
  //   let openNum = 0;
  //   for (let i = 1; i <= this._paneWidth; i++) {

  //     for (let j = 1; j <= this._paneHeigh; j++) {
  //       if (this.arCells[i][j].isOpened === true) {
  //         openNum++;
  //       }
  //     };
  //   }

  //   if (openNum === okNum) {
  //     this.onFinishedWithSuccess();
  //   }
  // }

  // private onFinishedWithSuccess() {
  //   this.face.nativeElement.src = '../assets/image/mineresource/face_success.jpg';
  //   if (this.timer) {
  //     clearInterval(this.timer);
  //   }

  //   // Cleanup the events
  //   this.canvasMine.nativeElement.onmouseup = '';
  //   this.canvasMine.nativeElement.onmousedown = '';
  //   this.canvasMine.nativeElement.onmousemove = '';

  //   // It is finished!
  //   this.finishedEvent.emit(true);
  // }

  // private onFinishedWithFailed() {
  //   this.face.nativeElement.src = '../assets/image/mineresource/face_fail.jpg';
  //   this.canvasMine.nativeElement.onmouseup = '';
  //   this.canvasMine.nativeElement.onmousedown = '';
  //   this.canvasMine.nativeElement.onmousemove = '';

  //   clearInterval(this.timer);

  //   // Failed case
  //   alert('Failed');
  //   this.finishedEvent.emit(false);
  // }

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
        childelem[i].src = '../../assets/image/mineresource/d' + snum.charAt(i) + '.jpg';
      }
    } else {
      const childelem = this.gametime.nativeElement.getElementsByTagName('img');
      for (let i = 0; i < childelem.length; i++) {
        childelem[i].src = '../../assets/image/mineresource/d' + snum.charAt(i) + '.jpg';
      }
    }
  }
}
