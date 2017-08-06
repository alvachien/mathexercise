import { Component, OnInit } from '@angular/core';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-quiz-summary',
  templateUrl: './quiz-summary.component.html',
  styleUrls: ['./quiz-summary.component.scss']
})
export class QuizSummaryComponent implements OnInit {

  constructor(private _dlgsvc: DialogService) { }

  SummaryInfos = [];

  ngOnInit() {

    if (this._dlgsvc.CurrentQuiz !== null) {
      for (let run of this._dlgsvc.CurrentQuiz.ElderRuns()) {
        this.SummaryInfos.push(run.getSummaryInfo());
      }
    }
  }
}
