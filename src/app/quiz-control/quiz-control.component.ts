import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { QuizBasicControl, PrimarySchoolMathFAOControl, PrimarySchoolMathMixOpControl
} from '../model';
import { MatDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { QuizFailureDlgComponent } from '../quiz-failure-dlg/quiz-failure-dlg.component';
import { QuizSummaryComponent } from '../quiz-summary/quiz-summary.component';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';
import { MessageDialogButtonEnum, MessageDialogInfo, MessageDialogComponent } from '../message-dialog';

@Component({
  selector: 'app-quiz-control',
  templateUrl: './quiz-control.component.html',
  styleUrls: ['./quiz-control.component.scss']
})
export class QuizControlComponent implements OnInit {
  private _controlInstance: QuizBasicControl;
  @Input()
  get controlInstance(): QuizBasicControl {
    return this._controlInstance;
  }
  set controlInstance(cin: QuizBasicControl) {
    this._controlInstance = cin;
  }

  get isBasicControl(): boolean {
    return this._controlInstance !== undefined
      && this._controlInstance instanceof QuizBasicControl;
  }
  get isMixOPControl(): boolean {
    return this._controlInstance !== undefined
      && this._controlInstance instanceof PrimarySchoolMathMixOpControl;
  }
  get isFAOControl(): boolean {
    return this._controlInstance !== undefined
      && this._controlInstance instanceof PrimarySchoolMathFAOControl;
  }

  constructor() { }

  ngOnInit() {
  }
}
