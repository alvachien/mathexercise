import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';
import * as moment from 'moment';

@Component({
  selector: 'app-digit-clock',
  templateUrl: './digit-clock.component.html',
  styleUrls: ['./digit-clock.component.scss']
})
export class DigitClockComponent implements OnInit, OnDestroy {
  @ViewChild("digitclock") clockElement: ElementRef;

  private _dateStart: Date;
  //private _size: number = 1;
  private _handler = null;
  private _hour: number = 0;
  private _min: number = 0;
  private _sec: number = 0;
  private _isStart: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("AC Math Exercise [Debug]: Entering ngOnDestroy of digit-clock" + this._handler);
    }
    if (this._handler !== null) {
      clearInterval(this._handler);
      this._handler = null;
    }
  }

  @Input()
  set IsStart(istart: boolean) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("AC Math Exercise [Debug]: setter IsStart in Digit-clock:" + istart);
    }

    if (this._isStart !== istart) {
      this._isStart = istart;

      if (this._isStart === true) {
        this._dateStart = new Date();
        this._handler = setInterval(() => { this.onInterval(); }, 500); // Set to 0.5 sec for the dot
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log("AC Math Exercise [Debug]: After start the interval Digit-clock:" + this._handler);
        }
      } else {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log("AC Math Exercise [Debug]: Try to stop the interval Digit-clock:" + this._handler);
        }

        if (this._handler !== null) {
          clearInterval(this._handler);
          this._handler = null;
        }
      }
    }
  }

  public onInterval() {
    let clocks = this.clockElement.nativeElement.children;
    let timeSpent: number = new Date().getTime() - this._dateStart.getTime();
    let mt = moment.duration(timeSpent);
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("AC Math Exercise [Debug]: entering onInterval of Digit-clock:" + mt.asSeconds());
    }

    let sec = mt.seconds();
    clocks[6].className = "clock c" + (sec % 10);
    clocks[5].className = "clock c" + ((sec - (sec % 10)) / 10);

    if (sec % 2 === 0) {
      clocks[2].className = "clock dot";
    } else {
      clocks[2].className = "clock dot putout";
    }

    if (this._min !== mt.minutes()) {
      this._min = mt.minutes();
      clocks[4].className = "clock c" + (this._min % 10);
      clocks[3].className = "clock c" + ((this._min - (this._min % 10)) / 10);
    }

    if (this._hour !== mt.hours()) {
      this._hour = mt.hours();
      clocks[1].className = "clock c" + (this._hour % 10);
      clocks[0].className = "clock c" + ((this._hour - (this._hour % 10)) / 10);
    }
  }
}
