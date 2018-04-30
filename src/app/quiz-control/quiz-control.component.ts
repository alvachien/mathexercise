import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { QuizBasicControl, PrimarySchoolMathFAOControl, PrimarySchoolMathMixOpControl
} from '../model';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';

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
  @Input()
  disabled = false;

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
