import { Component, OnInit } from '@angular/core';
import { DialogService } from '../dialog.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-quiz-failure-dlg',
  templateUrl: './quiz-failure-dlg.component.html',
  styleUrls: ['./quiz-failure-dlg.component.scss']
})
export class QuizFailureDlgComponent implements OnInit {

  constructor(private _dlgsvc: DialogService,
    public dialogRef: MdDialogRef<QuizFailureDlgComponent>) { }

  ngOnInit() {
  }

}
