import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, Output,
  EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogLevel } from '../model';

export interface typingCompare {
  expected: string;
  inputted: string;
}

@Component({
  selector: 'app-pg-typingtour',
  templateUrl: './pg-typingtour.component.html',
  styleUrls: ['./pg-typingtour.component.scss']
})
export class PgTypingtourComponent implements OnInit {
  //@ViewChild('expword') expWordER: ElementRef;
  @ViewChild('inpword') inpWordER: ElementRef;
  @Input() 
  set expectedString(exp: string) {
    this._expectedString = exp;
    this.updateComparison();
  }
  @Output() finishEvent: EventEmitter<any> = new EventEmitter();
  private _expectedString: string;
  private _inputtedString: string;

  arComparison: typingCompare[] = [];

  constructor() {
  }

  ngOnInit() {
    this._inputtedString = '';
  }

  private updateComparison(isdelta?: boolean) {
    if (isdelta) {
      let nlen = this._inputtedString.length;
      this.arComparison[nlen - 1].inputted = this._inputtedString.charAt(nlen - 1);
    } else {
      this.arComparison = [];
      for(let c of this._expectedString) {
        let tc: typingCompare = {
          expected: c,
          inputted: null
        };
        this.arComparison.push(tc);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onPGTypingTourKeyDown(evt: KeyboardEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("AC Math Exercise [Debug]: Entering onPGTypingTourMouseDown of PgTypingTourComponent: " + evt.key);
    }

    // evt.ctrlKey;
    // evt.altKey;
    // evt.shiftKey;

    if (evt.key === "Backspace") {
      //this._inputtedString += evt.key;
    } else if(evt.key === "Enter") {

    }
    this.updateComparison(true);
    // if(/[^A-Z]/g.test(var1))
  }

  // @HostListener('document:keyup', ['$event'])
  // public onPGTypingTourKeyUp(evt: KeyboardEvent) {
  //   if (environment.LoggingLevel >= LogLevel.Debug) {
  //     console.log("AC Math Exercise [Debug]: Entering onPGTypingTourMouseUp of PgTypingTourComponent: " + evt.key);
  //   }
  // }
}
