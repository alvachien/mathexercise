import { Injectable } from '@angular/core';
import { LogLevel, UserAuthInfo, 
  QuizBasicControl, PrimarySchoolMathFAOControl, PrimarySchoolMathMixOpControl,
} from '../model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private _curQuizControl: QuizBasicControl;

  get currentQuizControl(): QuizBasicControl {
    return this._curQuizControl;
  }
  set currentQuizControl(qctrl: QuizBasicControl | undefined) {
    this._curQuizControl = qctrl;
  }

  constructor() { }
}
