import { Component, OnInit, OnDestroy, ViewEncapsulation, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl  } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { UserDetailService } from './services/userdetail.service';
import { environment } from '../environments/environment';
import { LogLevel, AppLanguage, AppNavItem, AppNavItemGroupEnum } from './model';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
import { DateAdapter } from '@angular/material';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { map, merge, startWith } from 'rxjs/operators';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-root-home',
  templateUrl: './app.home.html',
  styleUrls: ['./app.home.scss'],
})
export class Home implements AfterViewInit {
  public backgroundimage: string;
  public currUserID: string;
  // private _sun = new Image();
  // private _moon = new Image();
  // private _earth = new Image();

  // // Canvas
  // @ViewChild('canvasSolar') canvasSolar: ElementRef;
  // // Canvas
  // @ViewChild('canvasClock') canvasClock: ElementRef;

  constructor(private _sanitizer: DomSanitizer,
    private _authService: AuthService,
    ) {
    const photoamt = 7;
    let bgidx: number = Math.ceil(Math.random() * (photoamt - 1) + 1);
    if (bgidx > photoamt) {
      bgidx = photoamt;
    } else if (bgidx < 1) {
      bgidx = 1;
    }

    if (bgidx === 1) {
      this.backgroundimage = environment.AppHost + '/assets/image/home-bg.jpg';
    } else {
      this.backgroundimage = environment.AppHost + '/assets/image/home-bg' + bgidx.toString() + '.jpg';
    }

    // this._sun.src = environment.AppHost + '/assets/image/Canvas_sun.png';
    // this._moon.src = environment.AppHost + '/assets/image/Canvas_moon.png';
    // this._earth.src = environment.AppHost + '/assets/image/Canvas_earth.png';
    this.currUserID = this._authService.authSubject.getValue().getUserId();
  }

  getBackgroundImage() {
    return this._sanitizer.bypassSecurityTrustStyle('url(' + this.backgroundimage + ')');
  }

  ngAfterViewInit() {
    // window.requestAnimationFrame(() => {
    //   this.drawContent();
    // });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
  public navItems: AppNavItem[] = [];
  public availableLanguages: AppLanguage[] = [
    { displayas: 'Languages.en', value: 'en' },
    { displayas: 'Languages.zh', value: 'zh' }
  ];
  public isLoggedIn: boolean;
  public titleLogin: string;
  public userDisplayAs: string;
  private _watcherMedia: Subscription;
  public isXSScreen = false;
  public sidenavMode: string;

  private _selLanguage: string;
  get selectedLanguage(): string {
    return this._selLanguage;
  }
  set selectedLanguage(lang: string) {
    if (this._selLanguage !== lang && lang !== undefined && lang !== null) {
      this._selLanguage = lang;

      this.onLanguageChanged();
    }
  }

  constructor(private _element: ElementRef,
    private _translate: TranslateService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService,
    private _zone: NgZone,
    private _router: Router,
    private _media: MediaObserver,
    private _dateAdapter: DateAdapter<MomentDateAdapter>) {
    this._watcherMedia = this._media.media$.subscribe((change: MediaChange) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log(`ACGallery [Debug]: Entering constructor of AppComponent: ${change.mqAlias} = (${change.mediaQuery})`);
      }
      // xs	'screen and (max-width: 599px)'
      // sm	'screen and (min-width: 600px) and (max-width: 959px)'
      // md	'screen and (min-width: 960px) and (max-width: 1279px)'
      // lg	'screen and (min-width: 1280px) and (max-width: 1919px)'
      // xl	'screen and (min-width: 1920px) and (max-width: 5000px)'
      if ( change.mqAlias === 'xs') {
        this.isXSScreen = true;
        this.sidenavMode = 'over';
      } else {
        this.isXSScreen = false;
        this.sidenavMode = 'side';
      }
    });

    // Setup the translate
    this.userDisplayAs = '';

    this.navItems = [
      { name: 'Home.HomePage', route: '', group: AppNavItemGroupEnum.home },
      { name: 'Home.AdditionExercises', route: 'add-ex', group: AppNavItemGroupEnum.ps_basic },
      { name: 'Home.SubtractionExercises', route: 'sub-ex', group: AppNavItemGroupEnum.ps_basic },
      { name: 'Home.MultiplicationExercises', route: 'multi-ex', group: AppNavItemGroupEnum.ps_basic },
      { name: 'Home.DivisionExercises', route: 'divide-ex', group: AppNavItemGroupEnum.ps_basic },
      { name: 'Home.MixedOperations', route: 'mixop-ex', group: AppNavItemGroupEnum.ps_extend },
      // { name: 'Home.FormulaList', route: 'formula-list' },
      { name: 'Home.FormulaExercises', route: 'formula-ex', group: AppNavItemGroupEnum.ps_extend },
      { name: 'Home.PuzzleGames', route: 'puzz-game', group: AppNavItemGroupEnum.others },
      { name: 'Home.AwardPlan', route: 'award-plan', group: AppNavItemGroupEnum.award },
      { name: 'Home.AwardOverview', route: 'award-bal', group: AppNavItemGroupEnum.award },
      { name: 'Home.RetestPreviousFailures', route: 'fail-retest', group: AppNavItemGroupEnum.ps_extend },
      { name: 'Home.PrintableQuizGenerator', route: 'print-quiz', group: AppNavItemGroupEnum.others },
      { name: 'Home.QuestionBank', route: 'qtnbnk-list', group: AppNavItemGroupEnum.others },
      { name: 'Home.Statistics', route: 'user-stat', group: AppNavItemGroupEnum.report },
      // { name: 'Home.UserDetail', route: 'user-detail', group: AppNavItemGroupEnum.ps_basic },
      // { name: 'Home.ChineseWordDictation', route: 'cnword-recite' },
      // { name: 'Home.EnglishWordDictation', route: 'enword-recite' }
    ];

    // Register the Auth service
    if (environment.LoginRequired) {
      this._authService.authContent.subscribe(x => {
        this._zone.run(() => {
          this.isLoggedIn = x.isAuthorized;
          if (this.isLoggedIn) {
            this.titleLogin = x.getUserName();

            // Get user detail
            forkJoin(
              this._userDetailService.fetchUserDetail(),
              this._userDetailService.fetchAllUsers()
            ).subscribe((x2) => {
              if (x2[0] !== null && x2[0] !== undefined) {
                this.userDisplayAs = x2[0].DisplayAs;
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
    const deflang = 'zh';
    this._translate.setDefaultLang(deflang);
    this._translate.use(deflang).subscribe(() => {
      this._selLanguage = deflang;
      this._dateAdapter.setLocale('zh-cn');
      this.updateDocumentTitle();
    });
  }

  ngOnDestroy() {
    this._watcherMedia.unsubscribe();
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
    const elem = this._element.nativeElement.querySelector('.me-content');
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

  public launchSourceCode(): void {
    window.open('https://github.com/alvachien/mathexercise', '_blank');
  }

  public onOpenHIH(): void {
    window.open(environment.AppHIH, '_blank');
  }
  public onOpenPhotoGallery(): void {
    window.open(environment.AppGallery, '_blank');
  }

  public onLanguageChange(langid: string): void {
    this._selLanguage = langid;

    this.onLanguageChanged();
  }
  public onLanguageChanged(): void {
    if (this._translate.currentLang !== this._selLanguage &&
      this._selLanguage !== undefined) {
      this._translate.use(this._selLanguage);

      if (this._selLanguage === 'zh') {
        moment.locale('zh-cn');
        this._dateAdapter.setLocale('zh-cn');
      } else if (this._selLanguage === 'en') {
        moment.locale('en');
        this._dateAdapter.setLocale('en');
      }

      this.updateDocumentTitle();
    }
  }

  private updateDocumentTitle() {
    this._translate.get('Home.AppTitle').subscribe(x => {
      document.title = x;
    });
  }
}
