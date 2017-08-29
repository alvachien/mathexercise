import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { PrimarySchoolMathQuiz, PrimarySchoolMathQuizSection, PrimarySchoolMathQuizItem } from '../model';

@Injectable()
export class DialogService {

  constructor(private _dialog: MdDialog) {
  }

  public FailureItems: PrimarySchoolMathQuizItem[] = [];
  public CurrentScore: number = 0;
  public CurrentQuiz: PrimarySchoolMathQuiz = null;
  public MessageDialogHeader: string = '';
  public MessageDialogContent: string = '';

  // public openMessageDialog(): Observable<any> {
  //   let dialogRef = this._dialog.open(MessageDialogComponent, {
  //     disableClose: false,
  //     width: '500px'
  //   });

  //   return dialogRef.afterClosed();
  // }

  // public openFailureDialog(): Observable<any> {
  //   let dialogRef = this._dialog.open(QuizFailureDlgComponent, {
  //     disableClose: false,
  //     width: '500px'
  //   });

  //   return dialogRef.afterClosed();
  // }
}
