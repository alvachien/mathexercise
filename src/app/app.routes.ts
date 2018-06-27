import { Routes } from '@angular/router';
import { Home } from './app.component';
import { DivisionExerciseComponent } from './division-exercise';
import { MultiplicationQuizComponent } from './multiplication-quiz';
import { AdditionExerciseComponent } from './addition-exercise';
import { SubtractionExerciseComponent } from './subtraction-exercise';
import { QuizSummaryComponent } from './quiz-summary';
import { FormulaExerciseComponent } from './formula-exercise';
import { FormulaListComponent } from './formula-list';
import { FailureRetestComponent } from './failure-retest';
import { UserStatisticsComponent } from './user-statistics';
import { UserDetailComponent } from './user-detail';
import { PuzzleGamesComponent } from './puzzle-games';
import { AuthGuard } from './services/auth-guard.service';
import { CanDeactivateGuard } from './services/can-deactive-guard.service';
import { MixedopExerciseComponent } from './mixedop-exercise';
import { AwardPlanComponent } from './award-plan';
import { AwardBalanceComponent } from './award-balance';
import { EnwordReciteExerciseComponent } from './enword-recite-exercise';
import { CnwordReciteExerciseComponent } from './cnword-recite-exercise';
import { QuestionBankComponent } from './question-bank';
import { QuestionBankDetailComponent } from './question-bank-detail';
import { PrintableQuizGeneratorComponent } from './printable-quiz-generator';

export const AppRoutes: Routes = [
  { path: '', component: Home },
  { path: 'add-ex', component: AdditionExerciseComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'sub-ex', component: SubtractionExerciseComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'divide-ex', component: DivisionExerciseComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'multi-ex', component: MultiplicationQuizComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'quiz-sum', component: QuizSummaryComponent, canActivate: [AuthGuard] },
  { path: 'formula-ex', component: FormulaExerciseComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'formula-list', component: FormulaListComponent, canActivate: [AuthGuard], },
  { path: 'fail-retest', component: FailureRetestComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'user-stat', component: UserStatisticsComponent, canActivate: [AuthGuard], },
  { path: 'user-detail', component: UserDetailComponent, canActivate: [AuthGuard], },
  { path: 'puzz-game', component: PuzzleGamesComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'mixop-ex', component: MixedopExerciseComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'award-plan', component: AwardPlanComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'award-bal', component: AwardBalanceComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'print-quiz', component: PrintableQuizGeneratorComponent, canActivate: [AuthGuard] },
  { path: 'qtnbnk-list', component: QuestionBankComponent, canActivate: [AuthGuard] },
  { path: 'qtnbnk-detail', component: QuestionBankDetailComponent, canActivate: [AuthGuard] },
  { path: 'enword-recite', component: EnwordReciteExerciseComponent, canActivate: [AuthGuard] },
  { path: 'cnword-recite', component: CnwordReciteExerciseComponent, canActivate: [AuthGuard] },
];
