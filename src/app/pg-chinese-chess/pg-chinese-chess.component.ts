import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener,
  EventEmitter, Output, Input } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { ChineseChessUI, ChineseChess2Play } from '../model/chinesechess2';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
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
  private _dod: QuizDegreeOfDifficulity;

  /**
   * Started event
   */
  @Output() startedEvent: EventEmitter<any> = new EventEmitter();

  /**
   * Finish event
   */
  @Output() finishedEvent: EventEmitter<boolean> = new EventEmitter();

  /**
   * Degree of difficulity
   */
  @Input()
  set chineseChessDoD(dod: QuizDegreeOfDifficulity) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering setter of chineseChessDoD in PgChineseChessComponent' + dod.toString());
    }

    if (this._dod !== dod) {
      this._dod = dod;

      switch (dod) {
        case QuizDegreeOfDifficulity.easy: this._play.depth = 2; break;
        case QuizDegreeOfDifficulity.medium: this._play.depth = 3; break;
        case QuizDegreeOfDifficulity.hard:
        default:
          this._play.depth = 5;
          break;
      }
    }
  }

  constructor(private _http: HttpClient) {
    this._instance = new ChineseChessUI();
    this._play = new ChineseChess2Play();
  }

  ngOnInit() {
    this._instance.init(this.canvasChess.nativeElement);

    this._play.init(this._instance);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/plain')
      .append('Accept', 'text/plain');

    this._http.get(environment.AppHost + '/assets/data/data.txt', { headers: headers, responseType: 'text' }).map(x => {
      return <string>x;
    }).subscribe(x => {
      this._instance.aidata = x.split(' ');
    });
  }

  ngAfterViewInit() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: Entering ngAfterViewInit in PgChineseChessComponent');
    }

    this._play.show();
  }

  @HostListener('click', ['$event'])
  public onCanvasClicked(evt: MouseEvent) {
    if (!this._play.isPlay) {
      return false;
    }

    const key = this._play.getClickPiece(evt, this._instance);
    const point = this._play.getClickPoint(evt, this._instance);

    const x = point.x;
    const y = point.y;

    if (key) {
      this._play.clickPiece(key, x, y);
    } else {
      this._play.clickPoint(x, y);
    }

    this._play.isFoul = this._play.checkFoul(); // 检测是不是长将
  }
}
