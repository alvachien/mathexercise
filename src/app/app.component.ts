import { Component, OnInit, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl  } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { UserDetailService } from './services/userdetail.service';
import { environment } from '../environments/environment';
import { LogLevel } from './model';

@Component({
  selector: 'app-root-home',
  templateUrl: './app.home.html',
  styleUrls: ['./app.home.scss'],
})
export class Home {
  public backgroundimage: string;

  constructor(private _sanitizer: DomSanitizer) {
    const photoamt = 7;
    let bgidx: number = Math.ceil(Math.random() * (photoamt - 1) + 1);
    if (bgidx > photoamt) {
      bgidx = photoamt;
    } else if (bgidx < 1) {
      bgidx = 1;
    }

    if (bgidx === 1) {
      this.backgroundimage = 'assets/image/home-bg.jpg';
    } else {
      this.backgroundimage = 'assets/image/home-bg' + bgidx.toString() + '.jpg';
    }
  }

  getBackgroundImage() {
    return this._sanitizer.bypassSecurityTrustStyle('url(' + this.backgroundimage + ')');
  }
}

export interface appNavItems {
  name: string;
  route: string;
}

export interface appLanguage {
  displayas: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public navItems: appNavItems[] = [];
  public availableLanguages: appLanguage[] = [
    { displayas: 'Languages.en', value: 'en' },
    { displayas: 'Languages.zh', value: 'zh' }
  ];
  public isLoggedIn: boolean;
  public titleLogin: string;
  public userDisplayAs: string;

  private _selLanguage: string;
  get selectedLanguage(): string {
    return this._selLanguage;
  }
  set selectedLanguage(lang: string) {
    if (this._selLanguage !== lang && lang !== undefined && lang !== null) {
      this._selLanguage = lang;

      this.onLanguageChange();
    }
  }

  constructor(private _element: ElementRef,
    private _translate: TranslateService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService,
    private _zone: NgZone,
    private _router: Router) {
    // Setup the translate
    this._selLanguage = 'zh';
    this._translate.setDefaultLang(this._selLanguage);
    this._translate.use(this._selLanguage);
    this.userDisplayAs = '';

    this.navItems = [
      { name: 'Home.HomePage', route: '' },
      { name: 'Home.AdditionExercises', route: 'add-ex' },
      { name: 'Home.SubtractionExercises', route: 'sub-ex' },
      { name: 'Home.MultiplicationExercises', route: 'multi-ex' },
      { name: 'Home.DivisionExercises', route: 'divide-ex' },
      { name: 'Home.MixedOperations', route: 'mixop-ex' },
      //{ name: 'Home.FormulaList', route: 'formula-list' },
      { name: 'Home.FormulaExercises', route: 'formula-ex' },
      { name: 'Home.PuzzleGames', route: 'puzz-game' },
      { name: 'Home.AwardPlan', route: 'award-plan' },
      { name: 'Home.AwardBalance', route: 'award-bal' },
      { name: 'Home.RetestPreviousFailures', route: 'fail-retest' },
      { name: 'Home.Statistics', route: 'user-stat' },
      { name: 'Home.UserDetail', route: 'user-detail' },
      { name: 'Home.EnglishWordDictation', route: 'enword-recite' }
    ];

    // Register the Auth service
    if (environment.LoginRequired) {
      this._authService.authContent.subscribe(x => {
        this._zone.run(() => {
          this.isLoggedIn = x.isAuthorized;
          if (this.isLoggedIn) {
            this.titleLogin = x.getUserName();

            // Get user detail
            this._userDetailService.fetchUserDetail().subscribe((x2) => {
              if (x2 !== null && x2 !== undefined) {
                this.userDisplayAs = x2.DisplayAs;
              }
            });
          }
        });
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error('AC Math Exercise: Log [Error]: Failed in subscribe to User', error);
        }
      }, () => {
        // Completed
      });
    } else {
      this.isLoggedIn = false;
    }
  }

  ngOnInit() {
    this.updateDocumentTitle();
  }

  public onLogon() {
    if (environment.LoginRequired) {
      this._authService.doLogin();
    } else {
      console.log('No logon is required!');
    }
  }

  public onUserDetail(): void {
    this._router.navigate(['/user-detail']);
  }

  public onLogout(): void {
    if (environment.LoginRequired) {
      this._authService.doLogout();
    }
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

  private onLanguageChange() {
    if (this._translate.currentLang !== this._selLanguage &&
      this._selLanguage !== undefined) {
      this._translate.use(this._selLanguage);

      this.updateDocumentTitle();
    }
  }

  private updateDocumentTitle() {
    this._translate.get('Home.AppTitle').subscribe(x => {
      document.title = x;
    });
  }
}
