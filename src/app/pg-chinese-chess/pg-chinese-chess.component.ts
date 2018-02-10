import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ChineseChessUI, ChineseChess2Play } from '../model/chinesechess2';
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
export class PgChineseChessComponent implements OnInit, AfterViewInit {
  @ViewChild('canvaschess') canvasChess: ElementRef;
  private _instance: ChineseChessUI;
  private _play: ChineseChess2Play;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngAfterViewInit in PgChineseChessComponent');
    }

    this._instance = new ChineseChessUI();
    this._instance.init(this.canvasChess.nativeElement);

    this._play = new ChineseChess2Play();
    this._play.init(this._instance);

    this._instance.show();
  }

  @HostListener('click', ['$event'])
  public onCanvasClicked(evt: MouseEvent) {
    if (!this._play.isPlay) return false;
    
    var key = this._play.getClickPiece(evt, this._instance);
    var point = this._play.getClickPoint(evt, this._instance);

    var x = point.x;
    var y = point.y;

    if (key) {
      this._play.clickPiece(key, x, y);
    } else {
      this._play.clickPoint(x, y);
    }

    // this._play.isFoul = this._play.checkFoul();//检测是不是长将  
  }
}
