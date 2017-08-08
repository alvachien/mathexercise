import { Injectable } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem } from './model';

@Injectable()
export class DialogService {

  constructor() { }

  public FailureItems: PrimarySchoolMathQuizItem[] = [];
  public CurrentQuiz: PrimarySchoolMathQuiz = null;
}
