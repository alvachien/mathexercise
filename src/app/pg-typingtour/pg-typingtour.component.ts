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
  @ViewChild('expword') expWordER: ElementRef;
  @ViewChild('inpword') inpWordER: ElementRef;
  @ViewChild("inpword2") inpWord2ER: ElementRef;
  @Input()
  set expectedString(exp: string) {
    this._expectedString = exp;

    this.updateComparison();
  }
  @Output() finishEvent: EventEmitter<any> = new EventEmitter();
  private _expectedString: string = '';
  public inputtedString: string;
  public fakedContent: string = '';

  arComparison: typingCompare[] = [];

  constructor() {
  }

  ngOnInit() {
    this.inputtedString = '';

    //https://stackoverflow.com/questions/3671141/hide-textfield-blinking-cursor
    this.inpWordER.nativeElement.addEventListener("focus", () => {
      this.inpWord2ER.nativeElement.focus();
    });

    this.inpWord2ER.nativeElement.focus();
    //this.inpWord2ER.nativeElement.addEventListener("keyup", () => {
    //});
  }

  private updateComparison(isdelta?: boolean) {
    if (isdelta) {
      let nlen = this.inputtedString.length;
      let issucc: boolean = true;

      if (nlen !== this.arComparison.length) {
        issucc = false;
      }
      for (let i: number = 0; i < nlen; i++) {
        this.arComparison[i].inputted = this.inputtedString.charAt(i);
        
        if (issucc) {
          if (this.arComparison[i].expected !== this.inputtedString.charAt(i)) {
            issucc = false;
          }
        }
      }

      if (issucc) {
        // Completed.
        this.finishEvent.emit(null);
      }

      for(let i: number = nlen; i < this.arComparison.length; i++) {
        this.arComparison[i].inputted = null;
      }

      // There still room to improve performance!
      // Todo!
      if (this.inpWordER !== null && this.inpWordER !== undefined) {
        let nhtml: string = '';
        for(let cmp of this.arComparison) {
          if (cmp.inputted !== null && cmp.inputted !== cmp.expected) {
            nhtml += "<span style=\"color: #FF0000;\">" + cmp.inputted + "</span>";            
          } else if (cmp.inputted !== null) {
            nhtml += "<span>" + cmp.inputted + "</span>";
          }
        }
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log("AC Math Exercise [Debug]: Entering updateComparison of PgTypingTourComponent with DELTA: " + nhtml);
        }
  
        this.inpWordER.nativeElement.innerHTML = nhtml;
      }
    } else {
      if (this._expectedString !== undefined && this._expectedString.length > 0) {
        this.arComparison = [];
        for(let c of this._expectedString) {
          let tc: typingCompare = {
            expected: c,
            inputted: null
          };
          this.arComparison.push(tc);
        }
  
        if (this.expWordER !== null && this.expWordER !== undefined) {
          let nhtml: string = '';
          for(let c of this._expectedString) {
            nhtml += "<span>" + c + "</span>";
          }
  
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log("AC Math Exercise [Debug]: Entering updateComparison of PgTypingTourComponent: " + nhtml);
          }
          this.expWordER.nativeElement.innerHTML = nhtml;
        }
      }
    }
  }

  @HostListener('keydown', ['$event'])
  public onPGTypingTourKeyDown(evt: KeyboardEvent) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("AC Math Exercise [Debug]: Entering onPGTypingTourMouseDown of PgTypingTourComponent: " + evt.key);
    }

    // evt.ctrlKey;
    // evt.altKey;
    // evt.shiftKey;

    // https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key/Key_Values
    // Any other input? Prevent the default response:
    if (evt.preventDefault) evt.preventDefault();

    if (evt.key === "Backspace") {
      if (this.inputtedString.length >= 2) {
        this.inputtedString = this.inputtedString.slice(0, length - 2);
      } else {
        this.inputtedString = '';
      }

      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log("AC Math Exercise [Debug]: Entering onPGTypingTourMouseDown of PgTypingTourComponent: " + this.inputtedString);
      }
      this.updateComparison(true);
    } else if("`1234567890-=~!@#$%^&*()_+[]\\{}|;':\",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(evt.key) !== -1) {
      this.inputtedString = this.inputtedString + evt.key;

      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log("AC Math Exercise [Debug]: Entering onPGTypingTourMouseDown of PgTypingTourComponent: " + this.inputtedString);
      }
      this.updateComparison(true);
    }
  }

  // @HostListener('document:keyup', ['$event'])
  // public onPGTypingTourKeyUp(evt: KeyboardEvent) {
  //   if (environment.LoggingLevel >= LogLevel.Debug) {
  //     console.log("AC Math Exercise [Debug]: Entering onPGTypingTourMouseUp of PgTypingTourComponent: " + evt.key);
  //   }
  // }

  public onInputWorkinput(event) {
    // DO nothing
  }
}
