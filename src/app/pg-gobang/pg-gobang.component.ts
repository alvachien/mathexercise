import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterContentInit,
  HostListener } from '@angular/core';
import {
  PrimarySchoolMathQuiz, QuizTypeEnum, PrimarySchoolMathQuizItem, CanvasCellPositionInf,
  Cal24QuizItem, LogLevel, QuizDegreeOfDifficulity, Gobang, getCanvasMouseEventPosition, getCanvasCellPosition
} from '../model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pg-gobang',
  templateUrl: './pg-gobang.component.html',
  styleUrls: ['./pg-gobang.component.scss']
})
export class PgGobangComponent implements OnInit, AfterContentInit {
  private _dod: QuizDegreeOfDifficulity;
  private _cellsize: number;
  private _cellheight: number;
  private _cellwidth: number;
  private _curStep: boolean; // True for first player, false for second player
  private _instance: Gobang;

  // Canvas
  @ViewChild('canvasgobang') canvasGobang: ElementRef;

  /**
   * Finish event
   */
  @Output() finishEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Degree of difficulity
   */
  @Input()
  set gobangDoD(dod: QuizDegreeOfDifficulity) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering setter of gobangDoD in PgGobangComponent' + dod.toString());
    }

    if (this._dod !== dod) {
      this._dod = dod;

      switch (dod) {
        case QuizDegreeOfDifficulity.easy: this._cellsize = 10; break;
        case QuizDegreeOfDifficulity.medium: this._cellsize = 15; break;
        case QuizDegreeOfDifficulity.hard:
        default:
          this._cellsize = 20;
          break;
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  public onGobangCanvasMouseDown(evt: MouseEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering onGobangCanvasMouseDown in PgGobangComponent for mousedown event:' + evt);
    }

    const loc = getCanvasMouseEventPosition(evt.target, evt);
    const cellloc = getCanvasCellPosition(loc, this._cellwidth, this._cellheight);

    // Check the object
    if (this._instance.cells[cellloc.row][cellloc.column].value === undefined) {
      this._instance.cells[cellloc.row][cellloc.column].value = this._curStep;
      this.drawChess(cellloc);

      this._curStep = !this._curStep;

      // Check winner
      // if (this._instance.isWinner) {

      // }
    }
  }

  constructor() {
    // Hard coded width and height
    this._cellheight = 40;
    this._cellwidth = 40;

    this._curStep = true;
    this._instance = new Gobang();
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this._instance.Dimension = this._cellsize;
    this._instance.init();

    // Draw the border
    this.drawWholeRect();
  }

  private drawWholeRect() {
    const ctx2 = this.canvasGobang.nativeElement.getContext('2d');
    ctx2.clearRect(0, 0, ctx2.width, ctx2.height);
    ctx2.save();
    ctx2.fillStyle = 'rgba(0, 0, 200, 0.5)';
    ctx2.fillRect(0, 0, ctx2.width, ctx2.height);
    ctx2.restore();

    for (let i = 0; i <= this._cellsize; i ++) {
      ctx2.beginPath();
      ctx2.moveTo(0, i * this._cellheight);
      ctx2.lineTo(this._cellheight * this._cellsize, i * this._cellheight);
      ctx2.closePath();
      ctx2.stroke();

      ctx2.beginPath();
      ctx2.moveTo(i * this._cellwidth, 0);
      ctx2.lineTo(i * this._cellheight, this._cellwidth * this._cellsize);
      ctx2.closePath();
      ctx2.stroke();
    }
  }

  private drawChess(cellloc: CanvasCellPositionInf) {
    const ctx2 = this.canvasGobang.nativeElement.getContext('2d');

    const image = new Image();
    if (this._curStep) {
      image.src = '../../assets/image/gobangresource/blackchess.png';
    } else {
      image.src = '../../assets/image/gobangresource/whitechess.png';
    }
    image.onload = () => {
      ctx2.drawImage(image, cellloc.column * this._cellwidth, cellloc.row * this._cellheight, this._cellwidth, this._cellheight);
    };
  }
}
