import { Injectable } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection } from './model';

@Injectable()
export class DialogService {

  constructor() { }

  public FailureInfos: string[] = [];
  //public SummaryInfos: string[] = [];
  public CurrentQuiz: PrimarySchoolMathQuiz = null;
}
