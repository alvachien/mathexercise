import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { LogLevel, QuizDegreeOfDifficulity } from '../model';
import { environment } from '../../environments/environment';

export interface MineSweepCell {
  isMine: boolean;
  isOpened: boolean;
  tag: number;
}
export interface MineSweepCellPosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-pg-minesweeper',
  templateUrl: './pg-minesweeper.component.html',
  styleUrls: ['./pg-minesweeper.component.scss']
})
export class PgMinesweeperComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasmine') canvasMine: ElementRef;
  @ViewChild('face') face: ElementRef;
  @ViewChild('gametags') gametags: ElementRef;
  @ViewChild('gametime') gametime: ElementRef;
  @ViewChild('mscontainer') mscontainer: ElementRef;
  @Output() startedEvent: EventEmitter<any> = new EventEmitter();
  @Output() finishedEvent: EventEmitter<boolean> = new EventEmitter(false);
  /**
   * Degree of difficulity
   */
  @Input()
  set mineSweepDoD(dod: QuizDegreeOfDifficulity) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering setter of sudouStart in PgSudouComponent' + dod.toString());
    }

    if (this._dod !== dod) {
      this._dod = dod;
    }
  }

  PANE_SIZE: number = 16;

  private _dod: QuizDegreeOfDifficulity;
  private _paneHeigh: number;
  private _paneWidth: number;
  private _minenum: number;
  get PaneHeight(): number {
    return this._paneHeigh;
  }
  set PaneHeight(ph: number) {
    this._paneHeigh = ph;
  }
  get PaneWidth(): number {
    return this._paneWidth;
  }
  set PaneWidth(pw: number) {
    this._paneWidth = pw;
  }
  get MineNumber(): number {
    return this._minenum;
  }
  set MineNumber(mn: number) {
    this._minenum = mn;
  }
  get ComponentWidth(): number {
    return this.PaneWidth * this.PANE_SIZE + 42;
  }
  get ComponentHeight(): number {
    return this.PaneHeight * this.PANE_SIZE + 136;
  }

  oldPos: any[] = [];
  // Two-dimensional array
  arCells: any[] = [];
  // Image arrays
  arImgUrls: string[] = [];
  arMines: any[] = [];
  time: number = 0;
  notTaged: number = 0;
  mousedownArr: any;
  inited: boolean = false;
  timer: any;

  constructor() {
    // Default values
    this._paneHeigh = 16;
    this._paneWidth = 30;

    // Array of image urls
    this.arImgUrls = ["../../assets/image/mineresource/blank.jpg", 
      "../../assets/image/mineresource/0.jpg", 
      "../../assets/image/mineresource/flag.jpg", 
      "../../assets/image/mineresource/ask.jpg", 
      "../../assets/image/mineresource/mine.png", 
      "../../assets/image/mineresource/blood.jpg", 
      "../../assets/image/mineresource/error.jpg"
    ];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.mscontainer != null) {
      this.mscontainer.nativeElement.style.width = this.ComponentWidth + 'px';
      this.mscontainer.nativeElement.style.height = this.ComponentHeight + 'px';
    }

    if (this.canvasMine !== null) {
      this.canvasMine.nativeElement.width = this.PANE_SIZE * this._paneWidth;
      this.canvasMine.nativeElement.height = this.PANE_SIZE * this._paneHeigh;
    }
    if (this.face !== null) {
      this.face.nativeElement.src = "../../assets/image/mineresource/face_normal.jpg"
    }

    switch(this.mineSweepDoD) {
      case QuizDegreeOfDifficulity.easy: this._minenum = 9; break;
      case QuizDegreeOfDifficulity.medium: this._minenum = 49; break;
      case QuizDegreeOfDifficulity.hard:
      default:
        this._minenum = 99;
        break;
    }

    this.onReset();
  }

  onReset() {
    // Clean up variables
    this.oldPos = [0, 0];
    this.arCells = [];
    this.arMines = [];
    this.time = 0;
    this.notTaged = this._minenum;

    this.setNumberImage(this.notTaged, true);
    this.setNumberImage(this.time, false);
    if(this.timer !== undefined) {
      clearInterval(this.timer);
    }

    this.mousedownArr = '';
    this.initCells(); 
    this.inited = false;

    // Event binding
    this.onRegisterMouseMove();
    this.onRegisterMouseOut();
    this.onRegisterMouseDown();
    this.onRegisterMouseClick();
    this.preRightMenu();
  }

  onRegisterMouseMove() {
    let that = this; 
    this.canvasMine.nativeElement.onmousemove = (e) => {

      let pos = that.getCellPos(that.getEventPosition(e));
      let oldPos = that.oldPos;
      let arCells = that.arCells;

      if (pos.toString() === oldPos.toString()) {
        return;
      }

      if (that.checkCell(oldPos) && (arCells[oldPos[0]][oldPos[1]].isOpened === false && arCells[oldPos[0]][oldPos[1]].tag === 0)) {
        that.drawCell(oldPos, 1);
      }

      if (that.checkCell(pos) && (arCells[pos[0]][pos[1]].isOpened === true || arCells[pos[0]][pos[1]].tag !== 0)) {
        that.oldPos = pos;
        return;
      }

      that.drawCell(pos, 2);
      that.oldPos = pos;
    };
  }

  onRegisterMouseOut() {
    let that = this;
    this.canvasMine.nativeElement.onmouseout = (e) => {
      let pos = that.oldPos;
      if (that.checkCell(pos) && (that.arCells[pos[0]][pos[1]].isOpened === true || that.arCells[pos[0]][pos[1]].tag !== 0)) {
        return;
      }

      that.drawCell(pos, 1);
      pos = [0, 0];
    }
  }

  onRegisterMouseClick() {
    var that = this;

    this.canvasMine.nativeElement.onmouseup = (e) => {
      var pos = that.getCellPos(that.getEventPosition(e));

      if (that.inited == false) {
        that.createMines(pos);
        that.timer = setInterval(function () {
          that.time = that.time + 1;

          that.setNumberImage(that.time, false);
        }, 1000);
        that.inited = true;
      }
      if (!e) { e = window.event; }
      that.onClick(pos, e);
    }
  }

  onRegisterMouseDown() {
    var that = this;
    this.canvasMine.nativeElement.onmousedown = (e) => {
      var pos = that.getCellPos(that.getEventPosition(e));
      if (!e) { e = window.event; }
      let theCell = that.arCells[pos[0]][pos[1]];
      if (theCell.isOpened === true) {
        let aroundMineNum = that.calAround(pos);
        let unknownArr = that.getAroundUnknown(pos);
        let tagNum = that.getAroundTag(pos);

        if (aroundMineNum !== tagNum) {
          for (let t = 0; t < unknownArr.length; t++) {
            that.drawNum(unknownArr[t], 0);
          }
          that.mousedownArr = unknownArr;
        }
      }
    }
  }

  getAroundUnknown(pos) {
    let unknowArr = [];
    let arCells = this.arCells;
    let aroundArr = [[pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1]];

    for (let i: number = 0; i < aroundArr.length; i++) {
      if (this.checkCell(aroundArr[i]) && arCells[aroundArr[i][0]][aroundArr[i][1]].tag == 0 && arCells[aroundArr[i][0]][aroundArr[i][1]].isOpened == false) {
        unknowArr.push(aroundArr[i]);
      }
    }

    return unknowArr;
  }

  getAroundTag(pos) {
    let arCells = this.arCells;
    let aroundArr = [[pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1]];
    let tagNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      if (this.checkCell(aroundArr[i]) && arCells[aroundArr[i][0]][aroundArr[i][1]].tag === 1) {
        tagNum++;
      }
    }

    return tagNum;
  }

  showMine() {
    let arMines = this.arMines;
    let pos = '';
    let area;
    for (let i = 0; i < arMines.length; i++) {
      pos = arMines[i];
      this.drawCell(pos, 5);
      this.arCells[pos[0]][pos[1]].isOpened = true;
    }
  }

  showWrongTag() {
    let paneheight = this._paneHeigh;
    let panewidth = this._paneWidth;

    for (var i = 1; i <= panewidth; i++) {
      for (var j = 1; j <= paneheight; j++) {
        if (this.arCells[i][j].isMine == false && this.arCells[i][j].tag == 1) {
          this.drawCell([i, j], 7);
        }
      };
    }
  }

  calAround(pos): number {
    let arCells = this.arCells;
    let aroundArr = [[pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1]];
    let aroundMineNum: number = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      aroundMineNum += this.checkMine(aroundArr[i]) ? 1 : 0;
    }

    return aroundMineNum;
  }

  calZeroMine(pos, zeroArr) {
    let arCells = this.arCells;

    let aroundArr = [[pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1]];
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      aroundMineNum = this.calAround(aroundArr[i]);
      if (aroundMineNum === 0 && this.checkCell(aroundArr[i]) && arCells[aroundArr[i][0]][aroundArr[i][1]].isMine == false && !this.isInArray(aroundArr[i], zeroArr)) {
        zeroArr.push(aroundArr[i]);
        this.calZeroMine(aroundArr[i], zeroArr);
      }
    }

    return zeroArr;
  }

  openZeroArr(zeroArr) {
    for (var i = 0; i < zeroArr.length; i++) {
      if (!this.checkMine(zeroArr[i])) {
        this.openZero(zeroArr[i]);
      }
    };
  }

  openZero(pos) {
    let arCells = this.arCells;
    let aroundArr = [[pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1]];
    let aroundMineNum = 0;

    for (let i = 0; i < aroundArr.length; i++) {
      if (this.checkCell(aroundArr[i])) {
        arCells[aroundArr[i][0]][aroundArr[i][1]].isOpened = true;
        aroundMineNum = this.calAround(aroundArr[i]);
        this.drawNum(aroundArr[i], aroundMineNum);
      }
    }
  }

  drawCell(pos, type) {
    let area = this.getCellArea(pos);
    let cxt = this.canvasMine.nativeElement.getContext('2d');

    let image = new Image();
    image.src = this.arImgUrls[type - 1];
    image.onload = () => {
      cxt.drawImage(image, area[0], area[1], 16, 16);
    };
  }

  drawNum(pos, num: number) {
    if (Number.isInteger(num)) {
      let area = this.getCellArea(pos);
      let cxt = this.canvasMine.nativeElement.getContext('2d');
      let image = new Image();
      image.src = "../../assets/image/mineresource/" + num + ".jpg";
  
      image.onload = function () {
        cxt.drawImage(image, area[0], area[1], 16, 16);
      }
    }
  }

  checkCell(pos): boolean {
    return this.arCells[pos[0]] && this.arCells[pos[0]][pos[1]];
  }

  createMines(pos) {
    let minenum = this._minenum;
    let arMines = this.arMines;
    let mineItem: any = '';
    let arCells = this.arCells;

    for (let i: number = 0; i < minenum; i++) {
      do {
        mineItem = [this.getRandom(this._paneWidth), this.getRandom(this._paneHeigh)];
      } while (this.isInArray(mineItem, arMines) || pos.toString() == mineItem.toString());

      arCells[mineItem[0]][mineItem[1]].isMine = true;
      arMines.push(mineItem);
    }
  }

  checkMine(pos): boolean {
    let arCells = this.arCells;
    if (this.checkCell(pos) && arCells[pos[0]][pos[1]].isMine == true) {
      return true;
    }

    return false;
  }

  getCellArea(pos) {
    return [(pos[0] - 1) * this.PANE_SIZE + 1, (pos[1] - 1) * this.PANE_SIZE + 1];
  }

  getCellPos(coordinate) { 
    return [Math.ceil(coordinate.x / this.PANE_SIZE), Math.ceil(coordinate.y / this.PANE_SIZE)];
  }

  preRightMenu() {
    this.canvasMine.nativeElement.oncontextmenu = event => {
      if (document.all) window.event.returnValue = false; // for IE
      else event.preventDefault();
    };
  }

  /**
   * Handler of Click
   */
  onClick(pos, e) {
    let currentCell: MineSweepCell = this.arCells[pos[0]][pos[1]];

    if (currentCell.isOpened) {

      if (e) {
        let aroundMineNum = this.calAround(pos);
        let unknownArr = this.getAroundUnknown(pos);
        let tagNum = this.getAroundTag(pos);

        if (aroundMineNum === tagNum) {
          for (var t = 0, uLen = unknownArr.length; t < uLen; t++) {
            this.onClick(unknownArr[t], undefined);
          }
        } else {
          let mousedownArr = this.mousedownArr;
          if (mousedownArr !== "") {
            for (let m = 0; m < mousedownArr.length; m++) {
              this.drawCell(mousedownArr[m], 1);
            }
          }

          this.mousedownArr = "";
        }
      }

      return;
    }

    let tag = currentCell.tag;
    if (e && e.button == 2) { 

      if (tag === 0) {
        this.drawCell(pos, 3);
        currentCell.tag = 1;
        this.notTaged--;
        this.setNumberImage(this.notTaged, true);
      }
      else if (tag === 1) {
        this.drawCell(pos, 4);
        currentCell.tag = 2;
        this.notTaged++;
        this.setNumberImage(this.notTaged, true);
      } else if (tag == 2) {
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
      var aroundMineNum = this.calAround(pos);
      if (aroundMineNum != 0) {
        this.drawNum(pos, aroundMineNum);
      } else {
        var zeroArr = [];
        zeroArr.push(pos);
        zeroArr = this.calZeroMine(pos, zeroArr);
        this.openZeroArr(zeroArr);
      }
    }
    currentCell.isOpened = true;

    let okNum = this._paneWidth * this._paneHeigh - this._minenum;
    let openNum = 0;
    for (let i = 1; i <= this._paneWidth; i++) {

      for (let j = 1; j <= this._paneHeigh; j++) {
        if (this.arCells[i][j].isOpened == true) {
          openNum++;
        }
      };
    }

    if (openNum === okNum) {      
      this.onFinishedWithSuccess();
    }
  }

  private onFinishedWithSuccess() {
    this.face.nativeElement.src = "../assets/image/mineresource/face_success.jpg";
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
    
    this.face.nativeElement.src = "../assets/image/mineresource/face_fail.jpg";
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
    for (let i: number = 1; i <= this._paneWidth; i++) {
      // Each row
      this.arCells[i] = [];

      for (let j: number = 1; j <= this._paneHeigh; j++) {
        // Each column
        this.arCells[i][j] = {
          isMine: false,
          isOpened: false,
          tag: 0
        };

        this.drawCell([i, j], 1)
      }
    }
  }

  /**
   * Get point of the event
   * @param evt Event
   */
  private getEventPosition(evt: any) {
    let x = evt.clientX;
    let y = evt.clientY;

    var rect = this.canvasMine.nativeElement.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    return { x: x, y: y };
  }

  /**
   * Get random number
   * @param n 
   */
  private getRandom(n: number): number {
    return Math.floor(Math.random() * n + 1)
  }

  /**
   * Is item is in array
   * @param stringToSearch 
   * @param arrayToSearch 
   */
  private isInArray(stringToSearch: any, arrayToSearch: any[]): boolean {
    for (let s: number = 0; s < arrayToSearch.length; s++) {
      let thisEntry = arrayToSearch[s].toString();
      if (thisEntry === stringToSearch.toString()) {
        return true;
      }
    }

    return false;
  }
  
  /**
   * Get prefix interger
   * @param num Number to process
   * @param length Length
   */
  private getPrefixInteger(num: number, length: number): string {
    if (num > 999) {
      num = 999;
    } else if(num < 0) {
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
    let snum: string = this.getPrefixInteger(num, 3);

    if (bTag) {
      let childelem = this.gametags.nativeElement.getElementsByTagName('img');
      for (let i: number = 0; i < childelem.length; i++) {
        childelem[i].src = "../../assets/image/mineresource/d" + snum.charAt(i) + ".jpg";
      }
    } else {
      let childelem = this.gametime.nativeElement.getElementsByTagName('img');
      for (let i: number = 0; i < childelem.length; i++) {
        childelem[i].src = "../../assets/image/mineresource/d" + snum.charAt(i) + ".jpg";
      }
    }
  }
}
