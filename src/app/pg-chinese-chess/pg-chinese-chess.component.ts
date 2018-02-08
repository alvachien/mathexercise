import { Component, OnInit, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { ChineseChessUI } from '../model/chinesechess2';
import { environment } from '../../environments/environment';
import {
  PrimarySchoolMathQuiz, QuizTypeEnum, PrimarySchoolMathQuizItem,
  Cal24QuizItem, SudouQuizItem, LogLevel, QuizDegreeOfDifficulity,
  getCanvasMouseEventPosition, getCanvasCellPosition,
} from '../model';

@Component({
  selector: 'app-pg-chinese-chess',
  templateUrl: './pg-chinese-chess.component.html',
  styleUrls: ['./pg-chinese-chess.component.scss']
})
export class PgChineseChessComponent implements OnInit, AfterContentInit {
  @ViewChild('canvaschess') canvasChess: ElementRef;
  private _instance: ChineseChessUI;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngAfterContentInit in PgChineseChessComponent');
    }

    this._instance = new ChineseChessUI();
    this._instance.init(this.canvasChess.nativeElement);
    this._instance.showBackground();
  }
}
