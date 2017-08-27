import { Component, OnInit } from '@angular/core';
import { RPN } from '../model';

@Component({
  selector: 'app-puzzle-games',
  templateUrl: './puzzle-games.component.html',
  styleUrls: ['./puzzle-games.component.scss']
})
export class PuzzleGamesComponent implements OnInit {

  Cal24Input: string = '';
  Cal24items: number[] = [];
  IsCal24Start: boolean = false;
  IsCal24PrvSuccess: boolean = false;
  IsCal24ShowError: boolean = false;
  Cal24PrvSuccess: string = '';
  Cal24PrvError: string = '';
  Cal24SurrendString: string = '';
  Cal24NumberRangeBgn: number = 1;
  Cal24NumberRangeEnd: number = 9;

  constructor() { }

  ngOnInit() {
  }

  private Cal24(arnum: any[], nlen: number, targetNum: number): boolean {
    const opArr = new Array("+", "-", "*", "/");
    for (let i = 0; i < nlen; i++) {
      for (let j = i + 1; j < nlen; j++) {
        let numij = [arnum[i], arnum[j]];
        arnum[j] = arnum[nlen - 1];
        for (let k: number = 0; k < opArr.length; k++) {
          let k1: number = k % 2;
          let k2: number = 0;
          if (!k1) {
            k2 = 1;
          }
          arnum[i] = '(' + numij[k1] + opArr[k] + numij[k2] + ')';
          if (this.Cal24(arnum, nlen - 1, targetNum)) {
            this.Cal24SurrendString = arnum[0];
            return true;
          }
        }
        arnum[i] = numij[0];
        arnum[j] = numij[1];
      }
    }

    let objRN = new RPN();
    let tmprest = objRN.buildExpress(arnum[0]);
    let result = objRN.WorkoutResult();

    return (nlen === 1) && (result === targetNum);
  }

  public CanCal24Start(): boolean {
    if (this.IsCal24Start) {
      return false;
    }
    return true;
  }
  public OnCal24Start(): void {

    this.Cal24items = [];
    while (this.Cal24items.length < 4) {
      let nNum = Math.floor(Math.random() * (this.Cal24NumberRangeEnd - this.Cal24NumberRangeBgn) ) + this.Cal24NumberRangeBgn;
      let nExistIdx = this.Cal24items.findIndex((val) => { return val === nNum; });
      if (nExistIdx === -1) {
        this.Cal24items.push(nNum);
      }
    }
    this.IsCal24Start = true;
  }
  public CanCal24Submit(): boolean {
    if (!this.IsCal24Start) {
      return false;
    }
    if (this.Cal24Input.length <= 0) {
      return false;
    }

    for (let ch of this.Cal24Input) {
      if (ch === '('
        || ch === ')'
        || ch === '+'
        || ch === '-'
        || ch === '*'
        || ch === '/'
      ) {
        continue;
      } else {
        let nch = parseInt(ch);
        let nExistIdx = this.Cal24items.findIndex((val) => { return val === nch; });
        if (nExistIdx === -1) {
          return false;
        }
      }
    }

    return true;
  }

  public OnCal24Submit(): void {
    this.IsCal24ShowError = false;
    let rst: number = <number>eval(this.Cal24Input);
    if (rst !== 24) {
      // Failed!
      this.IsCal24ShowError = true;
      this.Cal24PrvError = this.Cal24Input + ' = ' + rst.toString() + ' != 24';
    } else {
      this.Cal24PrvSuccess = this.Cal24Input + ' = 24';
      this.IsCal24PrvSuccess = true;
      this.IsCal24Start = false;
    }
  }

  public OnCal24Surrender(): void {
    let arnums: number[] = [];
    for(let n of this.Cal24items) {
      arnums.push(n);
    }

    if (this.Cal24(arnums, arnums.length, 24)) {
      this.IsCal24ShowError = true;
      this.Cal24PrvError = this.Cal24SurrendString + ' = 24';
    } else {
      // No suitable results
      this.IsCal24PrvSuccess = false;
      this.IsCal24Start = false;      
    }
  }
}
