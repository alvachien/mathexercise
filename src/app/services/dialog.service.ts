import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem } from '../model';

@Injectable()
export class DialogService {

  constructor() {
  }

  public FailureItems: PrimarySchoolMathQuizItem[] = [];
  public CurrentScore = 0;
  public CurrentQuiz: PrimarySchoolMathQuiz = null;
}
