import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_LOCALE_PROVIDER } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import { KatexModule } from 'ng-katex';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

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
import { FormulaListComponent, } from './formula-list/';
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
import { NavigationService } from './services/navigation.service';
import { UsTrendComponent } from './us-trend';
import { UsNormalComponent } from './us-normal';
import { PgGobangComponent } from './pg-gobang';
import { PgChineseChessComponent } from './pg-chinese-chess';
import { PgChineseChess2Component } from './pg-chinese-chess2';
import { QuizControlComponent } from './quiz-control';
import { AvailablePlansComponent } from './available-plans';
import { AwardPlanDetailComponent } from './award-plan-detail';
import { NavItemFilterPipe } from './pipes';
import { QuestionBankComponent } from './question-bank';
import { QuestionBankDetailComponent } from './question-bank-detail';
import { PrintableQuizSectionComponent } from './printable-quiz-section';
import { PrintableQuizComponent } from './printable-quiz';
import { AboutComponent } from './about';
import { PrintableQuizSectionItemComponent } from './printable-quiz-section-item';

@NgModule({
  exports: [
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule,
    MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule,
    MatDialogModule, MatGridListModule, MatIconModule, MatInputModule, MatStepperModule,
    MatListModule, MatMenuModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatRadioModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSortModule,
    MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatToolbarModule,
    MatTooltipModule, MatFormFieldModule, MatExpansionModule, MatNativeDateModule,
    CdkTableModule, FlexLayoutModule
  ],
  declarations: [],
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
    UsNormalComponent,
    QuizControlComponent,
    AvailablePlansComponent,
    AwardPlanDetailComponent,
    NavItemFilterPipe,
    QuestionBankComponent,
    QuestionBankDetailComponent,
    PrintableQuizComponent,
    PrintableQuizSectionComponent,
    PrintableQuizSectionItemComponent,
    AboutComponent,
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
    KatexModule,
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
    NavigationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
