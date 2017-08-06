import { Routes } from '@angular/router';
import { Home } from './app.component';
import { DivideExerciseComponent } from './divide-exercise/divide-exercise.component';

export const AppRoutes: Routes = [
  { path: '', component: Home },
  { path: 'divide-exp', component: DivideExerciseComponent }
];
