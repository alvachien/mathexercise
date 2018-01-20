import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

export interface MineSweepCell {
  isMine: boolean;
  isOpened: boolean;
  tag: number;
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

  PANE_SIZE: number = 16;

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
  arCells: any[] = [];
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
    this._minenum = 99;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.onReset();
  }

  onReset() {
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

    this.oldPos = [0, 0];
    this.arCells = [];
    this.arMines = [];
    this.time = 0;
    this.notTaged = this._minenum;

    this.numToImage(this.notTaged, true);
    this.numToImage(this.time, false);

    this.mousedownArr = '';
    this.createCells(); 
    this.inited = false;

    if(this.timer !== undefined) {
      clearInterval(this.timer);
    }

    // Event binding
    this.onRegisterMouseMove();
    this.onRegisterMouseOut();
    this.onRegisterMouseDown();
    this.onRegisterMouseClick();
    this.preRightMenu();
  }

  onRegisterMouseMove() {
    let that = this; 
    this.canvasMine.nativeElement.onmousemove = e => {

      let pos = that.getCellPos(that.getEventPosition(e));
      let oldPos = that.oldPos;
      let arCells = that.arCells;

      if (pos.toString() == oldPos.toString()) {
        return;
      }

      if (that.checkCell(oldPos) && (arCells[oldPos[0]][oldPos[1]].isOpened == false && arCells[oldPos[0]][oldPos[1]].tag == 0)) {
        that.drawCell(oldPos, 1);
      }

      if (that.checkCell(pos) && (arCells[pos[0]][pos[1]].isOpened == true || arCells[pos[0]][pos[1]].tag != 0)) {
        that.oldPos = pos;
        return;
      }

      that.drawCell(pos, 2);
      that.oldPos = pos;
    };
  }

  onRegisterMouseOut() {
    let that = this;
    this.canvasMine.nativeElement.onmouseout = e => {
      let pos = that.oldPos;
      if (that.checkCell(pos) && (that.arCells[pos[0]][pos[1]].isOpened == true || that.arCells[pos[0]][pos[1]].tag != 0)) {
        return;
      }

      that.drawCell(pos, 1);
      pos = [0, 0];
    }
  }

  onRegisterMouseClick() {
    var that = this;

    this.canvasMine.nativeElement.onmouseup = e => {
      var pos = that.getCellPos(that.getEventPosition(e));

      if (that.inited == false) {
        that.createMines(pos);
        that.timer = setInterval(function () {
          that.time = that.time + 1;

          that.numToImage(that.time, false);
        }, 1000);
        that.inited = true;
      }
      if (!e) { e = window.event; }
      that.triggerClick(pos, e);
    }
  }

  onRegisterMouseDown() {
    var that = this;
    this.canvasMine.nativeElement.onmousedown = e => {
      var pos = that.getCellPos(that.getEventPosition(e));
      if (!e) { e = window.event; }
      let theCell = that.arCells[pos[0]][pos[1]];
      if (theCell.isOpened == true) {
        let aroundMineNum = that.calAround(pos);
        let unknownArr = that.getAroundUnknown(pos);
        let tagNum = that.getAroundTag(pos);

        if (aroundMineNum != tagNum) {
          for (let t = 0, uLen = unknownArr.length; t < uLen; t++) {
            that.drawNum(unknownArr[t], 0);
          }
          that.mousedownArr = unknownArr;
        }
      }
    }
  }

  triggerClick(pos, e) {
    let currentCell: MineSweepCell = this.arCells[pos[0]][pos[1]];

    if (currentCell.isOpened) {

      if (e) {
        let aroundMineNum = this.calAround(pos);
        let unknownArr = this.getAroundUnknown(pos);
        let tagNum = this.getAroundTag(pos);

        if (aroundMineNum == tagNum) {
          for (var t = 0, uLen = unknownArr.length; t < uLen; t++) {
            this.triggerClick(unknownArr[t], undefined);
          }
        } else {
          let mousedownArr = this.mousedownArr;
          if (mousedownArr != "") {
            for (var m = 0, mLen = mousedownArr.length; m < mLen; m++) {
              this.drawCell(mousedownArr[m], 1);
            };
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
        this.numToImage(this.notTaged, true);
      }
      else if (tag === 1) {
        this.drawCell(pos, 4);
        currentCell.tag = 2;
        this.notTaged++;
        this.numToImage(this.notTaged, true);
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
      this.face.nativeElement.src = "assets/image/mineresource/face_fail.jpg";
      this.showMine();
      this.drawCell(pos, 6);
      this.showWrongTag(); 
      this.canvasMine.nativeElement.onmouseup = '';
      this.canvasMine.nativeElement.onmousedown = '';
      this.canvasMine.nativeElement.onmousemove = '';

      clearInterval(this.timer);

      // Failed case
      this.finishedEvent.emit(false);
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
      this.face.nativeElement.src = "assets/image/mineresource/face_success.jpg";

      clearInterval(this.timer);

      // Cleanup the events
      this.canvasMine.nativeElement.onmouseup = '';
      this.canvasMine.nativeElement.onmousedown = '';
      this.canvasMine.nativeElement.onmousemove = '';

      // It is finished!
      this.finishedEvent.emit(true);
    }
  }

  getAroundUnknown(pos) {
    let unknowArr = [];
    let arCells = this.arCells;
    let aroundArr = [[pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1]];

    // var aroundUnknownNum = 0;
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

    for (var i = 0; i < aroundArr.length; i++) {
      if (this.checkCell(aroundArr[i]) && arCells[aroundArr[i][0]][aroundArr[i][1]].tag == 1) {
        tagNum++;
      }
    };
    return tagNum;
  }

  createCells() {
    let paneheight = this._paneHeigh;
    let panewidth = this._paneWidth;

    for (let i = 1; i <= panewidth; i++) {
      this.arCells[i] = [];

      for (let j = 1; j <= paneheight; j++) {
        this.arCells[i][j] = {
          isMine: false,
          isOpened: false,
          tag: 0
        };

        this.drawCell([i, j], 1)
      }
    }
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

    for (var i = 0; i < aroundArr.length; i++) {
      aroundMineNum += this.checkMine(aroundArr[i]) ? 1 : 0;
    }

    return aroundMineNum;
  }

  calZeroMine(pos, zeroArr) {
    var arCells = this.arCells;

    var aroundArr = [[pos[0] - 1, pos[1] - 1], [pos[0] - 1, pos[1]], [pos[0] - 1, pos[1] + 1], [pos[0], pos[1] - 1], [pos[0], pos[1] + 1], [pos[0] + 1, pos[1] - 1], [pos[0] + 1, pos[1]], [pos[0] + 1, pos[1] + 1]];
    var aroundMineNum = 0;

    for (var i = 0; i < aroundArr.length; i++) {
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

    let srcArr = ["../../assets/image/mineresource/blank.jpg", 
      "../../assets/image/mineresource/0.jpg", 
      "../../assets/image/mineresource/flag.jpg", 
      "../../assets/image/mineresource/ask.jpg", 
      "../../assets/image/mineresource/mine.png", 
      "../../assets/image/mineresource/blood.jpg", 
      "../../assets/image/mineresource/error.jpg"];
    
    var index = type - 1;
    image.src = srcArr[index];
    image.onload = function () {
      cxt.drawImage(image, area[0], area[1], 16, 16);
    }
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

  private numToImage(num: number, bTag: boolean) {
    let snum: string;
    if (num > 999) {
      snum = '999';
    } else if (num < 0) {
      snum = '000';
    } else if (num < 10) {
      snum = "00" + num;
    } else if (num < 100) {
      snum = "0" + num;
    } else {
      snum = num.toString();
    }

    if (bTag) {
      let childelem = this.gametags.nativeElement.getElementsByTagName('img');
      for (let i = 0, eLen = childelem.length; i < eLen; i++) {
        childelem[i].src = "../../assets/image/mineresource/d" + snum.charAt(i) + ".jpg";
      };
    } else {
      let childelem = this.gametime.nativeElement.getElementsByTagName('img');
      for (let i = 0, eLen = childelem.length; i < eLen; i++) {
        childelem[i].src = "../../assets/image/mineresource/d" + snum.charAt(i) + ".jpg";
      };
    }
  }

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
}
