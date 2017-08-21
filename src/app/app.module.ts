import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FullscreenOverlayContainer,
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdCoreModule,
  MdTableModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  OverlayContainer,
  StyleModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
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
import { DialogService } from './dialog.service';
import { FormulaExerciseComponent } from './formula-exercise/';
import { AuthService } from './auth.service';
import { FormulaListComponent } from './formula-list/';
import { FailureRetestComponent, FailureRetestCompleteDialog } from './failure-retest';
import { UserStatisticsComponent } from './user-statistics/';

@NgModule({
  exports: [
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdTableModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdCoreModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    CdkTableModule,
    StyleModule
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
    FailureRetestCompleteDialog,
    UserStatisticsComponent
  ],
  entryComponents: [
    QuizFailureDlgComponent,
    FailureRetestCompleteDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    DSMaterialModule,
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
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
