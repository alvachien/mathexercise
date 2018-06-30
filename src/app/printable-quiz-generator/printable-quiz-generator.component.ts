import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AdditionQuizItem, SubtractionQuizItem } from '../model';

@Component({
  selector: 'app-printable-quiz-generator',
  templateUrl: './printable-quiz-generator.component.html',
  styleUrls: ['./printable-quiz-generator.component.scss'],
})
export class PrintableQuizGeneratorComponent implements OnInit {
  amountAddQuiz: number;
  amountSubQuiz: number;
  amountMulQuiz: number;
  amountDivQuiz: number;
  decimalPlaces: number;

  constructor() { 
    this.amountAddQuiz = 12;
    this.amountSubQuiz = 12;
    this.decimalPlaces = 2;
  }

  ngOnInit() {
  }

  onGenerate(): void {
    let arAdd: AdditionQuizItem[] = [];
    let arSub: SubtractionQuizItem[] = [];

    if (this.amountAddQuiz > 0) {
      let idx: number = 0;
      do {
        let qi: AdditionQuizItem = this.generateAddQuizItem(idx);
        arAdd.push(qi);
      } while (idx ++ < this.amountAddQuiz);
    }
    if (this.amountSubQuiz > 0) {
      let idx: number = 0;
      do {
        let qi: SubtractionQuizItem = this.generateSubQuizItem(idx);
        arSub.push(qi);
      } while (idx ++ < this.amountSubQuiz);
    }
    const itemsPerRow: number = 3;

    // Generate
    const doc: any = new jsPDF();

    // Generate the codes
    let nrow: number = 0;
    let nypos: number = 0;
    if (arAdd.length > 0) {
      nrow = Math.ceil(arAdd.length / itemsPerRow);
      for(let idx2 = 0; idx2 < nrow; idx2 ++) {
        let ielem: number = idx2 * itemsPerRow;
        if (ielem < arAdd.length) {
          doc.text(arAdd[ielem].getQuizFormat(), 10, 10 * (1 + idx2));  
        }
        ielem ++;
        if (ielem < arAdd.length) {
          doc.text(arAdd[ielem].getQuizFormat(), 70, 10 * (1 + idx2));  
        }
        ielem ++;
        if (ielem < arAdd.length) {
          doc.text(arAdd[ielem].getQuizFormat(), 130, 10 * (1 + idx2));  
        }
      }
      nypos += nrow;
    }
    if (arSub.length > 0) {
      nrow = Math.floor(arSub.length / itemsPerRow);
      for(let idx2 = 0; idx2 < nrow; idx2 ++) {
        let ielem: number = idx2 * itemsPerRow;
        if (ielem < arSub.length) {
          doc.text(arSub[ielem].getQuizFormat(), 10, 10 * (nypos + 1 + idx2));  
        }
        ielem ++;
        if (ielem < arSub.length) {
          doc.text(arSub[ielem].getQuizFormat(), 70, 10 * (nypos + 1 + idx2));  
        }
        ielem ++;
        if (ielem < arSub.length) {
          doc.text(arSub[ielem].getQuizFormat(), 130, 10 * (nypos + 1 + idx2));  
        }
      }
      nypos += nrow;
    }

    doc.save('test.pdf');
  }

  // Generate add
  private generateAddQuizItem(idx: number): AdditionQuizItem {
    const rnum1 = Math.random() * (1000 - 1) + 1;
    const rnum2 = Math.random() * (1000 - 1) + 1;
    const qz: AdditionQuizItem = new AdditionQuizItem(rnum1, rnum2, 2);
    qz.QuizIndex = idx;
    return qz;
  }
  // Generate subtract
  private generateSubQuizItem(idx: number): SubtractionQuizItem {
    const rnum1 = Math.random() * (1000 - 1) + 1;
    const rnum2 = Math.random() * (1000 - 1) + 1;
    const qz: SubtractionQuizItem = new SubtractionQuizItem(rnum1, rnum2, 2);
    qz.QuizIndex = idx;
    return qz;
  }  
}
