import { Component, OnInit } from '@angular/core';
import { PrimaySchoolFormulaEnum, getFormulaUIString, getFormulaNameString } from '../model';

@Component({
  selector: 'app-formula-list',
  templateUrl: './formula-list.component.html',
  styleUrls: ['./formula-list.component.scss']
})
export class FormulaListComponent implements OnInit {

  listFormula:any[] = [];

  constructor() { 
    for (let item in PrimaySchoolFormulaEnum) {
      if (isNaN(Number(item))) {
         //console.log(item);
      } else {
        let str0: string = getFormulaNameString(Number(item));
        let str1: string = getFormulaUIString(Number(item));
        let lf: any = { name: str0, formula: str1};
        this.listFormula.push(lf);
      }
    }
  }

  ngOnInit() {
  }
}
