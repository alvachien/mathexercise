import { Routes } from '@angular/router';
import { Home } from './app.component';
import { DivisionExerciseComponent } from './division-exercise/';
import { MultiplicationQuizComponent } from './multiplication-quiz/';
import { AdditionExerciseComponent } from './addition-exercise/';
import { SubtractionExerciseComponent } from './subtraction-exercise/';
import { QuizSummaryComponent } from './quiz-summary/';
import { FormulaExerciseComponent } from './formula-exercise/';
import { FormulaListComponent } from './formula-list/';
import { FailureRetestComponent } from './failure-retest';

export const AppRoutes: Routes = [
  { path: '', component: Home },
  { path: 'add-ex', component: AdditionExerciseComponent },
  { path: 'sub-ex', component: SubtractionExerciseComponent },
  { path: 'divide-ex', component: DivisionExerciseComponent },
  { path: 'multi-ex', component: MultiplicationQuizComponent },
  { path: 'quiz-sum', component: QuizSummaryComponent },
  { path: 'formula-ex', component: FormulaExerciseComponent },
  { path: 'formula-list', component: FormulaListComponent },
  { path: 'fail-retest', component: FailureRetestComponent },
];
