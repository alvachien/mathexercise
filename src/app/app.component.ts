import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
export class AppComponent {
  navItems = [
    { name: 'Home.AdditionExercises', route: 'add-ex' },
    { name: 'Home.SubtractionExercises', route: 'sub-ex' },
    { name: 'Home.MultiplicationExercises', route: 'multi-ex' },
    { name: 'Home.DivisionExercises', route: 'divide-ex' },
  ];
  selectedLanguage: string;
  availableLanguages = [
    { DisplayName: 'Languages.en', Value: 'en' },
    { DisplayName: 'Languages.zh', Value: 'zh' }
  ];

  constructor(private _element: ElementRef,
    private _translate: TranslateService) {
      // Setup the translate
      this.selectedLanguage = 'zh';
      this._translate.setDefaultLang('zh');
      this._translate.use(this.selectedLanguage);
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

  onLanguageChange() {
    if (this._translate.currentLang !== this.selectedLanguage) {
      this._translate.use(this.selectedLanguage);
    }
  }  
}
