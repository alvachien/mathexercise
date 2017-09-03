import { Component, OnInit } from '@angular/core';
import { PrimarySchoolFormulaEnum, getFormulaUIString, getFormulaNameString } from '../model';

@Component({
  selector: 'app-formula-list',
  templateUrl: './formula-list.component.html',
  styleUrls: ['./formula-list.component.scss']
})
export class FormulaListComponent implements OnInit {

  listFormula: any[] = [];

  constructor() {
    for (const item in PrimarySchoolFormulaEnum) {
      if (isNaN(Number(item))) {
         //console.log(item);
      } else {
        const str0: string = getFormulaNameString(Number(item));
        const str1: string = getFormulaUIString(Number(item));
        const lf: any = { name: str0, formula: str1};
        this.listFormula.push(lf);
      }
    }
  }

  ngOnInit() {
  }
}
