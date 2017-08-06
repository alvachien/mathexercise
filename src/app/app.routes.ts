import { Routes } from '@angular/router';
import { Home } from './app.component';
import { DivideExerciseComponent } from './divide-exercise/divide-exercise.component';
import { MultiplicationQuizComponent } from './multiplication-quiz/multiplication-quiz.component';
import { AdditionExerciseComponent } from './addition-exercise/addition-exercise.component';
import { SubtractionExerciseComponent } from './subtraction-exercise/subtraction-exercise.component';

export const AppRoutes: Routes = [
  { path: '', component: Home },
  { path: 'add-ex', component: AdditionExerciseComponent },
  { path: 'sub-ex', component: SubtractionExerciseComponent },
  { path: 'divide-ex', component: DivideExerciseComponent },
  { path: 'multi-ex', component: MultiplicationQuizComponent },
];
