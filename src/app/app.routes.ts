import { Routes } from '@angular/router';
import { Home } from './app.component';
import { DivisionExerciseComponent } from './division-exercise/';
import { MultiplicationQuizComponent } from './multiplication-quiz/multiplication-quiz.component';
import { AdditionExerciseComponent } from './addition-exercise/addition-exercise.component';
import { SubtractionExerciseComponent } from './subtraction-exercise/subtraction-exercise.component';
import { QuizSummaryComponent } from './quiz-summary/quiz-summary.component';
import { FormulaExerciseComponent } from './formula-exercise/';

export const AppRoutes: Routes = [
  { path: '', component: Home },
  { path: 'add-ex', component: AdditionExerciseComponent },
  { path: 'sub-ex', component: SubtractionExerciseComponent },
  { path: 'divide-ex', component: DivisionExerciseComponent },
  { path: 'multi-ex', component: MultiplicationQuizComponent },
  { path: 'quiz-sum', component: QuizSummaryComponent },
  { path: 'formula-ex', component: FormulaExerciseComponent },
];
