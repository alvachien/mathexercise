import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule,
  MatDialogModule, MatGridListModule, MatIconModule, MatInputModule,
  MatListModule, MatMenuModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSortModule,
  MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatToolbarModule,
  MatTooltipModule, MatFormFieldModule, MatExpansionModule,
  MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_LOCALE_PROVIDER,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutes } from './app.routes';
import { Home, AppComponent } from './app.component';
import { DivisionExerciseComponent } from './division-exercise/';
import { MultiplicationQuizComponent } from './multiplication-quiz/';
import { AdditionExerciseComponent } from './addition-exercise/';
import { SubtractionExerciseComponent } from './subtraction-exercise/';
import { QuizFailureDlgComponent } from './quiz-failure-dlg/';
import { QuizSummaryComponent } from './quiz-summary/';
import { DialogService } from './services/dialog.service';
import { AuthService } from './services/auth.service';
import { UserDetailService } from './services/userdetail.service';
import { FormulaExerciseComponent } from './formula-exercise/';
import { FormulaListComponent } from './formula-list/';
import { FailureRetestComponent } from './failure-retest';
import { UserStatisticsComponent } from './user-statistics';
import { UserDetailComponent } from './user-detail';
import { PuzzleGamesComponent } from './puzzle-games';
import { AuthGuard } from './services/auth-guard.service';
import { PgService } from './services/pg.service';
import { CanDeactivateGuard } from './services/can-deactive-guard.service';
import { DigitClockComponent } from './digit-clock/digit-clock.component';
import { MessageDialogComponent } from './message-dialog';
import { PgSudouComponent } from './pg-sudou/pg-sudou.component';
import { PgMinesweeperComponent } from './pg-minesweeper';
import { PgTypingtourComponent } from './pg-typingtour';
import { MixedopExerciseComponent } from './mixedop-exercise';
import { PgSummaryDlgComponent } from './pg-summary-dlg';
import { EnwordReciteExerciseComponent } from './enword-recite-exercise';
import { CnwordReciteExerciseComponent } from './cnword-recite-exercise';
import { AwardPlanComponent } from './award-plan';
import { AwardPlanService } from './services/award-plan.service';
import { AwardBalanceComponent } from './award-balance';
import { AwardBalanceService } from './services/award-balance.service';
import { QuizService } from './services/quiz.service';
import { ChessAiService } from './services/chess-ai.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { UsTrendComponent } from './us-trend';
import { UsNormalComponent } from './us-normal';
import { PgGobangComponent } from './pg-gobang';
import { PgChineseChessComponent } from './pg-chinese-chess';
import { PgChineseChess2Component } from './pg-chinese-chess2';

@NgModule({
  exports: [
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule,
    MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule,
    MatDialogModule, MatGridListModule, MatIconModule, MatInputModule,
    MatListModule, MatMenuModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSortModule,
    MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatToolbarModule,
    MatTooltipModule, MatFormFieldModule, MatExpansionModule, MatNativeDateModule,
    CdkTableModule
  ],
})
export class DSMaterialModule { }

// For translate
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    Home,
    AppComponent,
    DivisionExerciseComponent,
    MultiplicationQuizComponent,
    AdditionExerciseComponent,
    SubtractionExerciseComponent,
    QuizFailureDlgComponent,
    QuizSummaryComponent,
    FormulaExerciseComponent,
    FormulaListComponent,
    FailureRetestComponent,
    UserStatisticsComponent,
    UserDetailComponent,
    PuzzleGamesComponent,
    DigitClockComponent,
    MessageDialogComponent,
    PgSudouComponent,
    PgMinesweeperComponent,
    PgTypingtourComponent,
    PgGobangComponent,
    PgChineseChessComponent,
    PgChineseChess2Component,
    MixedopExerciseComponent,
    PgSummaryDlgComponent,
    EnwordReciteExerciseComponent,
    CnwordReciteExerciseComponent,
    AwardPlanComponent,
    AwardBalanceComponent,
    UsTrendComponent,
    UsNormalComponent
  ],
  entryComponents: [
    QuizFailureDlgComponent,
    MessageDialogComponent,
    PgSummaryDlgComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    DSMaterialModule,
    NgxChartsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    MAT_DATE_LOCALE_PROVIDER,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    DialogService,
    AuthService,
    UserDetailService,
    AuthGuard,
    CanDeactivateGuard,
    AwardPlanService,
    AwardBalanceService,
    QuizService,
    PgService,
    ChessAiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
