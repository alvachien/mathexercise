import { Component, OnInit } from '@angular/core';
import { DialogService } from '../dialog.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-quiz-summary',
  templateUrl: './quiz-summary.component.html',
  styleUrls: ['./quiz-summary.component.scss']
})
export class QuizSummaryComponent implements OnInit {

  constructor(private _dlgsvc: DialogService,
    public dialogRef: MdDialogRef<QuizSummaryComponent>) { }

  ngOnInit() {
  }

}
