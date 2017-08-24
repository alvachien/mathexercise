import { Injectable } from '@angular/core';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem } from '../model';

@Injectable()
export class DialogService {

  constructor() { }

  public FailureItems: PrimarySchoolMathQuizItem[] = [];
  public CurrentScore: number = 0;
  public CurrentQuiz: PrimarySchoolMathQuiz = null;
}
