import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdPaginatorModule,
  MdCardModule, MdCheckboxModule, MdChipsModule, MdDatepickerModule,
  MdDialogModule, MdGridListModule, MdIconModule, MdInputModule,
  MdListModule, MdMenuModule, MdProgressBarModule, MdProgressSpinnerModule,
  MdRadioModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSortModule,
  MdSlideToggleModule, MdSnackBarModule, MdTableModule, MdTabsModule, MdToolbarModule,
  MdTooltipModule, MdFormFieldModule, MdExpansionModule
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
import { CanDeactivateGuard } from './services/can-deactive-guard.service';
import { DigitClockComponent } from './digit-clock/digit-clock.component';
import { MessageDialogComponent } from './message-dialog';
import { PgSudouComponent } from './pg-sudou/pg-sudou.component';
import { PgMinesweeperComponent } from './pg-minesweeper';
import { PgTypingtourComponent } from './pg-typingtour';
import { MixedopExerciseComponent } from './mixedop-exercise';
import { PgSummaryDlgComponent } from './pg-summary-dlg';
import { EnwordReciteExerciseComponent } from './enword-recite-exercise/enword-recite-exercise.component';
import { CnwordReciteExerciseComponent } from './cnword-recite-exercise/cnword-recite-exercise.component';

@NgModule({
  exports: [
    MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdPaginatorModule,
    MdCardModule, MdCheckboxModule, MdChipsModule, MdDatepickerModule,
    MdDialogModule, MdGridListModule, MdIconModule, MdInputModule,
    MdListModule, MdMenuModule, MdProgressBarModule, MdProgressSpinnerModule,
    MdRadioModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSortModule,
    MdSlideToggleModule, MdSnackBarModule, MdTableModule, MdTabsModule, MdToolbarModule,
    MdTooltipModule, MdFormFieldModule, MdExpansionModule,
    CdkTableModule
  ]
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
    MixedopExerciseComponent,
    PgSummaryDlgComponent,
    EnwordReciteExerciseComponent,
    CnwordReciteExerciseComponent
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
    HttpModule,
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
    }),
    HttpModule
  ],
  providers: [
    DialogService,
    AuthService,
    UserDetailService,
    AuthGuard,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
