import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl  } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { UserDetailService } from './services/userdetail.service';
import { environment } from '../environments/environment';
import { LogLevel } from './model';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
import { DateAdapter } from '@angular/material';
import { Observable, forkJoin } from 'rxjs';
import { map, merge, startWith } from 'rxjs/operators';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-root-home',
  templateUrl: './app.home.html',
  styleUrls: ['./app.home.scss'],
})
export class Home implements AfterViewInit {
  public backgroundimage: string;
  private _sun = new Image();
  private _moon = new Image();
  private _earth = new Image();

  // Canvas
  @ViewChild('canvasSolar') canvasSolar: ElementRef;
  // Canvas
  @ViewChild('canvasClock') canvasClock: ElementRef;

  constructor(private _sanitizer: DomSanitizer) {
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

    this._sun.src = environment.AppHost + '/assets/image/Canvas_sun.png';
    this._moon.src = environment.AppHost + '/assets/image/Canvas_moon.png';
    this._earth.src = environment.AppHost + '/assets/image/Canvas_earth.png';
  }

  getBackgroundImage() {
    return this._sanitizer.bypassSecurityTrustStyle('url(' + this.backgroundimage + ')');
  }

  ngAfterViewInit() {
    window.requestAnimationFrame(() => {
      this.drawContent();
    });
  }

  drawContent(): void {
    const ctx: any = this.canvasSolar.nativeElement.getContext('2d');

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
    ctx.save();
    ctx.translate(150, 150);

    // Earth
    const time = new Date();
    ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
    ctx.translate(105, 0);
    ctx.fillRect(0, -12, 50, 24); // Shadow
    ctx.drawImage(this._earth, -12, -12);

    // Moon
    ctx.save();
    ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
    ctx.translate(0, 28.5);
    ctx.drawImage(this._moon, -3.5, -3.5);
    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(this._sun, 0, 0, 300, 300);

    const now = new Date();
    const ctx2 = this.canvasClock.nativeElement.getContext('2d');

    ctx2.save();
    ctx2.clearRect(0, 0, 150, 150);
    ctx2.translate(75, 75);
    ctx2.scale(0.4, 0.4);
    ctx2.rotate(-Math.PI / 2);
    ctx2.strokeStyle = 'black';
    ctx2.fillStyle = 'white';
    ctx2.lineWidth = 8;
    ctx2.lineCap = 'round';

    // Hour marks
    ctx2.save();
    for (let i = 0; i < 12; i++) {
      ctx2.beginPath();
      ctx2.rotate(Math.PI / 6);
      ctx2.moveTo(100, 0);
      ctx2.lineTo(120, 0);
      ctx2.stroke();
    }
    ctx2.restore();

    // Minute marks
    ctx2.save();
    ctx2.lineWidth = 5;
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        ctx2.beginPath();
        ctx2.moveTo(117, 0);
        ctx2.lineTo(120, 0);
        ctx2.stroke();
      }
      ctx2.rotate(Math.PI / 30);
    }
    ctx2.restore();

    const sec = now.getSeconds();
    const min = now.getMinutes();
    let hr  = now.getHours();
    hr = hr >= 12 ? hr - 12 : hr;

    ctx2.fillStyle = 'black';

    // write Hours
    ctx2.save();
    ctx2.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) *sec);
    ctx2.lineWidth = 14;
    ctx2.beginPath();
    ctx2.moveTo(-20, 0);
    ctx2.lineTo(80, 0);
    ctx2.stroke();
    ctx2.restore();

    // write Minutes
    ctx2.save();
    ctx2.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
    ctx2.lineWidth = 10;
    ctx2.beginPath();
    ctx2.moveTo(-28, 0);
    ctx2.lineTo(112, 0);
    ctx2.stroke();
    ctx2.restore();

    // Write seconds
    ctx2.save();
    ctx2.rotate(sec * Math.PI / 30);
    ctx2.strokeStyle = '#D40000';
    ctx2.fillStyle = '#D40000';
    ctx2.lineWidth = 6;
    ctx2.beginPath();
    ctx2.moveTo(-30, 0);
    ctx2.lineTo(83, 0);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.arc(0, 0, 10, 0, Math.PI * 2, true);
    ctx2.fill();
    ctx2.beginPath();
    ctx2.arc(95, 0, 10, 0, Math.PI * 2, true);
    ctx2.stroke();
    ctx2.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx2.arc(0, 0, 3, 0, Math.PI * 2, true);
    ctx2.fill();
    ctx2.restore();

    ctx2.beginPath();
    ctx2.lineWidth = 14;
    ctx2.strokeStyle = '#325FA2';
    ctx2.arc(0, 0, 142, 0, Math.PI * 2, true);
    ctx2.stroke();

    ctx2.restore();

    window.requestAnimationFrame(() => this.drawContent());
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

      this.onLanguageChanged();
    }
  }

  constructor(private _element: ElementRef,
    private _translate: TranslateService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService,
    private _zone: NgZone,
    private _router: Router,
    private _dateAdapter: DateAdapter<MomentDateAdapter>) {
    // Setup the translate
    this.userDisplayAs = '';

    this.navItems = [
      { name: 'Home.HomePage', route: '' },
      { name: 'Home.AdditionExercises', route: 'add-ex' },
      { name: 'Home.SubtractionExercises', route: 'sub-ex' },
      { name: 'Home.MultiplicationExercises', route: 'multi-ex' },
      { name: 'Home.DivisionExercises', route: 'divide-ex' },
      { name: 'Home.MixedOperations', route: 'mixop-ex' },
      // { name: 'Home.FormulaList', route: 'formula-list' },
      { name: 'Home.FormulaExercises', route: 'formula-ex' },
      { name: 'Home.PuzzleGames', route: 'puzz-game' },
      { name: 'Home.AwardPlan', route: 'award-plan' },
      { name: 'Home.AwardOverview', route: 'award-bal' },
      { name: 'Home.RetestPreviousFailures', route: 'fail-retest' },
      { name: 'Home.Statistics', route: 'user-stat' },
      { name: 'Home.UserDetail', route: 'user-detail' },
      { name: 'Home.ChineseWordDictation', route: 'cnword-recite' },
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

  public onOpenGithubRepo(): void {
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
