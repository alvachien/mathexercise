import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterContentInit,
  HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
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
  private _userStep: boolean; // True for first player, false for second player
  private _instance: Gobang;

  // Canvas
  @ViewChild('canvasgobang') canvasGobang: ElementRef;

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

    // Process step
    this.onProcessStep(cellloc);
    if (this._userStep === false) {
      // AI step
      const nextPos = this._instance.workoutNextCellAIPosition();
      this.onProcessStep(nextPos);
    }
  }

  constructor(public snackBar: MatSnackBar) {
    // Hard coded width and height
    this._cellheight = 40;
    this._cellwidth = 40;

    this._userStep = true;
    this._instance = new Gobang();
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this._instance.Dimension = this._cellsize;
    this._instance.init();
    this.startedEvent.emit();

    // Draw the border
    this.drawWholeRect();
  }

  private drawWholeRect() {
    const ctx2 = this.canvasGobang.nativeElement.getContext('2d');
    ctx2.clearRect(0, 0, this.canvasGobang.nativeElement.width, this.canvasGobang.nativeElement.height);
    ctx2.save();
    ctx2.fillStyle = 'rgba(0, 0, 100, 0.2)';
    ctx2.fillRect(0, 0, this.canvasGobang.nativeElement.width, this.canvasGobang.nativeElement.height);
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
    if (this._userStep) {
      image.src = '../../assets/image/gobangresource/blackchess.png';
    } else {
      image.src = '../../assets/image/gobangresource/whitechess.png';
    }
    image.onload = () => {
      ctx2.drawImage(image, cellloc.column * this._cellwidth, cellloc.row * this._cellheight, this._cellwidth, this._cellheight);
    };
  }

  private onProcessStep(cellloc: CanvasCellPositionInf) {
    if (!this._instance.isCellHasValue(cellloc.row, cellloc.column)) {
      this.drawChess(cellloc);

      this._instance.setCellValue(cellloc.row, cellloc.column, this._userStep);

      if (this._instance.Finished) {
        this.finishedEvent.emit(this._userStep ? true : false);
        // // Show the snackbar
        // let msg = '';
        // if (this._userStep) {
        //   msg = 'You win';
        // } else {
        //   msg = 'Computer win';
        // }
        // const snackBarRef = this.snackBar.open(msg, 'RESTART');

        // snackBarRef.onAction().subscribe(() => {
        //   console.log('The snack-bar action was triggered!');

        //   this._userStep = true; // By default, it's user step!
        //   this._instance.init();
        //   this.startedEvent.emit();

        //   // Draw the border
        //   this.drawWholeRect();
        // });
      } else {
        this._userStep = !this._userStep;
      }
    }
  }
}
