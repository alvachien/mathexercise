import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterContentInit,
  HostListener } from '@angular/core';
import {
  PrimarySchoolMathQuiz, QuizTypeEnum, PrimarySchoolMathQuizItem,
  Cal24QuizItem, LogLevel, QuizDegreeOfDifficulity
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

    const loc = this.getPointOnCanvas(evt.target, evt.clientX, evt.clientY);
    this.drawChess(loc);

    this._curStep = !this._curStep;
  }

  constructor() {
    // Hard coded width and height
    this._cellheight = 40;
    this._cellwidth = 40;

    this._curStep = true;
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // Draw the border
    this.drawWholeRect();
  }

  private drawWholeRect() {
    const ctx2 = this.canvasGobang.nativeElement.getContext('2d');
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

  private drawChess(loc: any) {
    const ctx2 = this.canvasGobang.nativeElement.getContext('2d');

    let image = new Image();
    if (this._curStep) {
      image.src = '../../assets/image/gobangresource/blackchess.png';
    } else {
      image.src = '../../assets/image/gobangresource/whitechess.png';
    }
    image.onload = () => {
      ctx2.drawImage(image, loc.x, loc.y, this._cellwidth, this._cellheight);
    };
  }

  private getPointOnCanvas(canvas, x, y) {
    const bbox = canvas.getBoundingClientRect();
    const x2 = (x - bbox.left) * (canvas.width / bbox.width);
    const y2 = (y - bbox.top) * (canvas.height / bbox.height);
    return {
      x: x2,
      y: y2
    };
  }
}
