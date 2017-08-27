import { Component, OnInit, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services';
import { environment } from '../environments/environment';
import { LogLevel } from './model';

@Component({
  selector: 'home',
  templateUrl: './app.home.html'
})
export class Home { }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  navItems = [
    { name: 'Home.HomePage', route: '' },
    { name: 'Home.AdditionExercises', route: 'add-ex' },
    { name: 'Home.SubtractionExercises', route: 'sub-ex' },
    { name: 'Home.MultiplicationExercises', route: 'multi-ex' },
    { name: 'Home.DivisionExercises', route: 'divide-ex' },
    { name: 'Home.FormulaList', route: 'formula-list' },
    { name: 'Home.FormulaExercises', route: 'formula-ex' },
    { name: 'Home.PuzzleGames', route: 'puzz-game' },
    { name: 'Home.RetestPreviousFailures', route: 'fail-retest' },
    { name: 'Home.Statistics', route: 'user-stat' },
    { name: 'Home.UserDetail', route: 'user-detail' },
  ];
  selectedLanguage: string;
  availableLanguages = [
    { DisplayName: 'Languages.en', Value: 'en' },
    { DisplayName: 'Languages.zh', Value: 'zh' }
  ];
  public isLoggedIn: boolean;
  public titleLogin: string;

  constructor(private _element: ElementRef,
    private _translate: TranslateService,
    private _authService: AuthService,
    private _zone: NgZone) {
      // Setup the translate
      this.selectedLanguage = 'zh';
      this._translate.setDefaultLang('zh');
      this._translate.use(this.selectedLanguage);

    // Register the Auth service
    this._authService.authContent.subscribe(x => {
      this._zone.run(() => {
        this.isLoggedIn = x.isAuthorized;
        if (this.isLoggedIn) {
          this.titleLogin = x.getUserName();
        }
      });
    }, error => {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.error("AC Math Exercise: Log [Error]: Failed in subscribe to User", error);
      }
    }, () => {
      // Completed
    });
  }

  ngOnInit() {
    this.updateDocumentTitle();
  }

  public onLogon() {
    this._authService.doLogin();
  }

  public onUserDetail(): void {
    
  }

  public onLogout() : void {
    this._authService.doLogout();
  } 

  public toggleFullscreen(): void {
    const elem = this._element.nativeElement.querySelector('.demo-content');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullScreen) {
      elem.msRequestFullScreen();
    }
  }

  public onLanguageChange() {
    if (this._translate.currentLang !== this.selectedLanguage) {
      this._translate.use(this.selectedLanguage);

      this.updateDocumentTitle();
    }
  }  

  private updateDocumentTitle() {
    this._translate.get('Home.AppTitle').subscribe(x => {
      document.title = x;
    });
  }
}
