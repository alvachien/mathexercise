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
  private _cellhight: number;
  private _cellwidth: number;

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
  }

  constructor() {
    // Hard coded width and height
    this._cellhight = 40;
    this._cellwidth = 40;
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
      ctx2.moveTo(0, i * this._cellhight);
      ctx2.lineTo(this._cellhight * this._cellsize, i * this._cellhight);
      ctx2.closePath();
      ctx2.stroke();

      ctx2.beginPath();
      ctx2.moveTo(i * this._cellwidth, 0);
      ctx2.lineTo(i * this._cellhight, this._cellwidth * this._cellsize);
      ctx2.closePath();
      ctx2.stroke();
    }
  }
}
