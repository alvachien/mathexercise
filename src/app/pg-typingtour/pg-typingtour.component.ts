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
  @Input()
  set expectedString(exp: string) {
    this._expectedString = exp;

    this.updateComparison();
  }
  @Output() finishEvent: EventEmitter<any> = new EventEmitter();
  private _expectedString: string = '';
  public inputtedString: string;

  arComparison: typingCompare[] = [];

  constructor() {
  }

  ngOnInit() {
    this.inputtedString = '';
  }

  private updateComparison(isdelta?: boolean) {
    if (isdelta) {
      let nlen = this.inputtedString.length;
      for (let i: number = 0; i < nlen; i++) {
        this.arComparison[i].inputted = this.inputtedString.charAt(i);
      }
      for(let i: number = nlen; i < this.arComparison.length; i++) {
        this.arComparison[i].inputted = null;
      }

      if (this.inpWordER !== null && this.inpWordER !== undefined) {
        let nhtml: string = '';
        for(let cmp of this.arComparison) {
          if (cmp.inputted !== null) {
            nhtml += "<span>" + cmp.inputted + "</span>";            
          } else if (cmp.inputted !== null && cmp.inputted !== cmp.expected) {
            nhtml += "<span class=\"input-fail\">" + cmp.inputted + "</span>";            
          } else {
          }
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

    if (evt.key === "Backspace") {
      if (this.inputtedString.length >= 2) {
        this.inputtedString = this.inputtedString.slice(0, length - 2);
      } else {
        this.inputtedString = '';
      }
      this.updateComparison(true);
    } else if("`1234567890-=~!@#$%^&*()_+[]\\{}|;':\",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(evt.key) !== -1) {
      this.inputtedString = this.inputtedString + evt.key;
      this.updateComparison(true);
    }
  }

  // @HostListener('document:keyup', ['$event'])
  // public onPGTypingTourKeyUp(evt: KeyboardEvent) {
  //   if (environment.LoggingLevel >= LogLevel.Debug) {
  //     console.log("AC Math Exercise [Debug]: Entering onPGTypingTourMouseUp of PgTypingTourComponent: " + evt.key);
  //   }
  // }
}
