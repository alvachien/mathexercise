import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { LogLevel, QuizDegreeOfDifficulity, getCanvasMouseEventPosition, getCanvasCellPosition,
  CanvasCellPositionInf, MineSweeper } from '../model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pg-minesweeper',
  templateUrl: './pg-minesweeper.component.html',
  styleUrls: ['./pg-minesweeper.component.scss']
})
export class PgMinesweeperComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasmine') canvasMine: ElementRef;
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
      this.canvasMine.nativeElement.width = this.PANE_SIZE * this._paneWidth;
      this.canvasMine.nativeElement.height = this.PANE_SIZE * this._paneHeigh;
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
    this.notTaged = this._minenum;

    this.setNumberImage(this.notTaged, true);
    this.setNumberImage(this.time, false);
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }

    this.mousedownArr = '';
    this.initCells();
    this.mineGenerated = false;

    // Event binding
    this.preRightMenu();
  }

  @HostListener('mousemove', ['$event'])
  public onMineSweeperCanvasMouseMove(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseMove of mousemove event in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
    }

    const pos = getCanvasCellPosition(getCanvasMouseEventPosition(this.canvasMine.nativeElement, evt), this.PANE_SIZE, this.PANE_SIZE);
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
    }

    const oldPos = this.oldPos;
    const arCells = this.arCells;

    if (pos.row === oldPos.row && pos.column === oldPos.column) {
      return;
    }

    if (this.isValidCellPosition(oldPos) && (arCells[oldPos.row][oldPos.column].isOpened === false
      && arCells[oldPos.row][oldPos.column].tag === 0)) {
      this.drawCell(oldPos, 1);
    }

    if (this.isValidCellPosition(pos) && (arCells[pos.row][pos.column].isOpened === true || arCells[pos.row][pos.column].tag !== 0)) {
      this.oldPos = pos;
      return;
    }

    this.drawCell(pos, 2);
    this.oldPos = pos;
  }

  @HostListener('mouseout', ['$event'])
  public onMineSweeperCanvasMouseOut(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseOut of mouseout event in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
    }

    let pos = this.oldPos;
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
    }

    if (this.isValidCellPosition(pos) && (this.arCells[pos.row][pos.column].isOpened === true || this.arCells[pos.row][pos.column].tag !== 0)) {
      return;
    }

    this.drawCell(pos, 1);
    pos = { row: 0, column: 0};
  }

  @HostListener('mouseup', ['$event'])
  public onMineSweeperCanvasMouseUp(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseUp of mouseup event in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
    }

    const pos = getCanvasCellPosition(getCanvasMouseEventPosition(this.canvasMine.nativeElement, evt), this.PANE_SIZE, this.PANE_SIZE);
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
    }

    if (this.mineGenerated === false) {
      // Ensure the first click is not a mine!
      // Therefore generate the mines exclude the current position
      this.generateMines(pos);

      this.timer = setInterval(() => {
        this.time = this.time + 1;

        this.setNumberImage(this.time, false);
      }, 1000);
      this.mineGenerated = true;
    }

    this.onClick(pos, evt);
  }

  @HostListener('mousedown', ['$event'])
  public onMineSweeperCanvasMouseDown(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Entering onMineSweeperCanvasMouseDown of mousedown event in PgMinesweeperComponent: ${evt.clientX} - ${evt.clientY}`);
    }

    const pos = getCanvasCellPosition(getCanvasMouseEventPosition(this.canvasMine.nativeElement, evt), this.PANE_SIZE, this.PANE_SIZE);
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log(`AC Math Exercise [Debug]: Cell position: ${pos.row} - ${pos.column}`);
    }

    let theCell = this.arCells[pos.row][pos.column];
    if (theCell.isOpened === true) {
      const aroundMineNum = this.calAround(pos);
      const unknownArr = this.getAroundUnknown(pos);
      const tagNum = this.getAroundTag(pos);

      if (aroundMineNum !== tagNum) {
        for (let t = 0; t < unknownArr.length; t++) {
          this.drawNum(unknownArr[t], 0);
        }

        this.mousedownArr = unknownArr;
      }
    }
  }

  getAroundUnknown(pos: CanvasCellPositionInf) {
    let unknowArr = [];
    let arCells = this.arCells;
    let aroundArr = this.getAroundCells(pos);

    for (let i = 0; i < aroundArr.length; i++) {
      if (this.isValidCellPosition(aroundArr[i]) && arCells[aroundArr[i].row][aroundArr[i].column].tag === 0
        && arCells[aroundArr[i].row][aroundArr[i].column].isOpened === false) {
        unknowArr.push(aroundArr[i]);
      }
    }

    return unknowArr;
  }

  getAroundTag(pos: CanvasCellPositionInf) {
    let arCells = this.arCells;
    let aroundArr = this.getAroundCells(pos);
    let tagNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      if (this.isValidCellPosition(aroundArr[i]) && arCells[aroundArr[i].row][aroundArr[i].column].tag === 1) {
        tagNum++;
      }
    }

    return tagNum;
  }

  showMine() {
    let arMines = this.arMines;
    let pos: CanvasCellPositionInf = undefined;
    let area;

    for (let i = 0; i < arMines.length; i++) {
      pos = arMines[i];
      this.drawCell(pos, 5);
      this.arCells[pos.row][pos.column].isOpened = true;
    }
  }

  showWrongTag() {
    let paneheight = this._paneHeigh;
    let panewidth = this._paneWidth;

    for (let i = 1; i <= panewidth; i++) {
      for (let j = 1; j <= paneheight; j++) {
        if (this.arCells[i][j].isMine === false && this.arCells[i][j].tag === 1) {
          this.drawCell({row: i, column: j}, 7);
        }
      };
    }
  }

  calAround(pos: CanvasCellPositionInf): number {
    let arCells = this.arCells;
    let aroundArr = this.getAroundCells(pos);
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      aroundMineNum += this.checkMine(aroundArr[i]) ? 1 : 0;
    }

    return aroundMineNum;
  }

  calZeroMine(pos: CanvasCellPositionInf, zeroArr: CanvasCellPositionInf[]): CanvasCellPositionInf[] {
    let arCells = this.arCells;
    let aroundArr = this.getAroundCells(pos);
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      aroundMineNum = this.calAround(aroundArr[i]);
      if (aroundMineNum === 0 && this.isValidCellPosition(aroundArr[i]) && arCells[aroundArr[i].row][aroundArr[i].column].isMine === false
        && !this.isInArray(aroundArr[i], zeroArr)) {
        zeroArr.push(aroundArr[i]);
        this.calZeroMine(aroundArr[i], zeroArr);
      }
    }

    return zeroArr;
  }

  openZeroArr(zeroArr: CanvasCellPositionInf[]) {
    for (let i = 0; i < zeroArr.length; i++) {
      if (!this.checkMine(zeroArr[i])) {
        this.openZero(zeroArr[i]);
      }
    };
  }

  openZero(pos: CanvasCellPositionInf) {
    let arCells = this.arCells;
    let aroundArr = this.getAroundCells(pos);
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      if (this.isValidCellPosition(aroundArr[i])) {
        arCells[aroundArr[i][0]][aroundArr[i][1]].isOpened = true;
        aroundMineNum = this.calAround(aroundArr[i]);
        this.drawNum(aroundArr[i], aroundMineNum);
      }
    }
  }

  drawCell(pos: CanvasCellPositionInf, type) {
    let area = this.getCellArea(pos);
    let cxt = this.canvasMine.nativeElement.getContext('2d');

    let image = new Image();
    image.src = this.arImgUrls[type - 1];
    image.onload = () => {
      cxt.drawImage(image, area[0], area[1], 16, 16);
    };
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

  drawNum(pos: CanvasCellPositionInf, num: number) {
    if (Number.isInteger(num)) {
      let area = this.getCellArea(pos);
      let cxt = this.canvasMine.nativeElement.getContext('2d');
      let image = new Image();
      image.src = '../../assets/image/mineresource/' + num + '.jpg';

      image.onload = function () {
        cxt.drawImage(image, area[0], area[1], 16, 16);
      }
    }
  }

  /**
   * Is cell position is valid
   * @param pos Position to check
   */
  isValidCellPosition(pos: CanvasCellPositionInf): boolean {
    if (pos === undefined) {
      return false;
    }
    if (pos.row < 0 || pos.column < 0 || pos.row >= this._paneHeigh || pos.column >= this._paneWidth) {
      return false;
    }
    if (this.arCells.length <= 0 || this.arCells.length <= pos.row || this.arCells[pos.row].length <= 0) {
      return false;
    }

    return true;
  }

  /**
   * Generate the mines
   * @param excldpos Pos
   */
  generateMines(excldpos: CanvasCellPositionInf) {
    let mineItem: any = {};

    for (let i = 0; i < this._minenum; i++) {
      do {
        mineItem = { row: this.getRandom(this._paneWidth), column: this.getRandom(this._paneHeigh) };
      } while (this.isInArray(mineItem, this.arMines) || (excldpos.row === mineItem.row && excldpos.column === mineItem.column));

      this.arCells[mineItem.row][mineItem.column].isMine = true;
      this.arMines.push(mineItem);
    }
  }

  checkMine(pos: CanvasCellPositionInf): boolean {
    if (this.isValidCellPosition(pos) && this.arCells[pos.row][pos.column].isMine === true) {
      return true;
    }

    return false;
  }

  getCellArea(pos: CanvasCellPositionInf) {
    return [pos.row * this.PANE_SIZE + 1, pos.column * this.PANE_SIZE + 1];
  }

  preRightMenu() {
    this.canvasMine.nativeElement.oncontextmenu = event => {
      if (document.all) {
        window.event.returnValue = false; // for IE
      } else {
        event.preventDefault();
      }
    };
  }

  /**
   * Handler of Click
   */
  onClick(pos: CanvasCellPositionInf, e) {
    let currentCell: MineSweepCell = this.arCells[pos.row][pos.column];

    if (currentCell.isOpened) {
      if (e) {
        let aroundMineNum = this.calAround(pos);
        let unknownArr = this.getAroundUnknown(pos);
        let tagNum = this.getAroundTag(pos);

        if (aroundMineNum === tagNum) {
          for (let t = 0, uLen = unknownArr.length; t < uLen; t++) {
            this.onClick(unknownArr[t], undefined);
          }
        } else {
          let mousedownArr = this.mousedownArr;
          if (mousedownArr !== '') {
            for (let m = 0; m < mousedownArr.length; m++) {
              this.drawCell(mousedownArr[m], 1);
            }
          }

          this.mousedownArr = '';
        }
      }

      return;
    }

    let tag = currentCell.tag;
    if (e && e.button === 2) {
      if (tag === 0) {
        this.drawCell(pos, 3);
        currentCell.tag = 1;
        this.notTaged--;
        this.setNumberImage(this.notTaged, true);
      } else if (tag === 1) {
        this.drawCell(pos, 4);
        currentCell.tag = 2;
        this.notTaged++;
        this.setNumberImage(this.notTaged, true);
      } else if (tag === 2) {
        this.drawCell(pos, 1);
        currentCell.tag = 0;
      }
      return;
    }
    if (tag !== 0) {
      return;
    }

    if (currentCell.isMine) {
      this.showMine();
      this.drawCell(pos, 6);
      this.showWrongTag();

      this.onFinishedWithFailed();
    } else {
      this.drawNum(pos, 0);
      const aroundMineNum = this.calAround(pos);
      if (aroundMineNum !== 0) {
        this.drawNum(pos, aroundMineNum);
      } else {
        let zeroArr = [];
        zeroArr.push(pos);
        zeroArr = this.calZeroMine(pos, zeroArr);
        this.openZeroArr(zeroArr);
      }
    }
    currentCell.isOpened = true;

    const okNum = this._paneWidth * this._paneHeigh - this._minenum;
    let openNum = 0;
    for (let i = 1; i <= this._paneWidth; i++) {

      for (let j = 1; j <= this._paneHeigh; j++) {
        if (this.arCells[i][j].isOpened === true) {
          openNum++;
        }
      };
    }

    if (openNum === okNum) {
      this.onFinishedWithSuccess();
    }
  }

  private onFinishedWithSuccess() {
    this.face.nativeElement.src = '../assets/image/mineresource/face_success.jpg';
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Cleanup the events
    this.canvasMine.nativeElement.onmouseup = '';
    this.canvasMine.nativeElement.onmousedown = '';
    this.canvasMine.nativeElement.onmousemove = '';

    // It is finished!
    this.finishedEvent.emit(true);
  }

  private onFinishedWithFailed() {
    this.face.nativeElement.src = '../assets/image/mineresource/face_fail.jpg';
    this.canvasMine.nativeElement.onmouseup = '';
    this.canvasMine.nativeElement.onmousedown = '';
    this.canvasMine.nativeElement.onmousemove = '';

    clearInterval(this.timer);

    // Failed case
    alert('Failed');
    this.finishedEvent.emit(false);
  }

  /**
   * Initial the cells
   */
  private initCells(): void {
    for (let i = 1; i <= this._paneWidth; i++) {
      // Each row
      this.arCells[i] = [];

      for (let j = 1; j <= this._paneHeigh; j++) {
        // Each column
        this.arCells[i][j] = {
          isMine: false,
          isOpened: false,
          tag: 0
        };

        this.drawCell({row: i, column: j}, 1)
      }
    }
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
