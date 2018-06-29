import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';

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

  constructor() { }

  ngOnInit() {
  }

  onGenerate(): void {
    // Generate
    const doc: any = new jsPDF();

    // All units are in the set measurement for the document
    // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
    // doc.fromHTML($('body').get(0), 15, 15, {
    //   'width': 170,
    //   'elementHandlers': specialElementHandlers
    // });

    doc.text('Hello world!', 1, 1);
    doc.save('test.pdf');
  }
}
