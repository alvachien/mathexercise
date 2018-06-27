import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogLevel, AudioContent } from '../model';

@Component({
  selector: 'app-enword-recite-exercise',
  templateUrl: './enword-recite-exercise.component.html',
  styleUrls: ['./enword-recite-exercise.component.scss']
})
export class EnwordReciteExerciseComponent implements OnInit, AfterViewInit {
  @ViewChild('audioCtrl') audioER: ElementRef;
  contentList: AudioContent[] = [];
  idxContent: number;
  IsQuizStarted = false;
  idxSequence: number[] = [];

  constructor() {
    this.contentList = [{
      word: '正月',
      beginpoint: 1,
      endpoint: 3,
      selected: true
    }, {
      word: '坐落',
      beginpoint: 4,
      endpoint: 5,
      selected: true
    }, {
      word: '红摩纸',
      beginpoint: 6,
      endpoint: 8,
      selected: true
    }, {
      word: '娓娓动听',
      beginpoint: 8,
      endpoint: 10,
      selected: true
    }, {
      word: '炊烟袅袅',
      beginpoint: 10,
      endpoint: 12,
      selected: true
    }, {
      word: '歇脚',
      beginpoint: 14,
      endpoint: 15,
      selected: true
    }, {
      word: '念叨',
      beginpoint: 15,
      endpoint: 16,
      selected: true
    }, {
      word: '喝彩',
      beginpoint: 17,
      endpoint: 18,
      selected: true
    }, {
      word: '身临其境',
      beginpoint: 18,
      endpoint: 20,
      selected: true
    }, {
      word: '戛然而止',
      beginpoint: 20,
      endpoint: 23,
      selected: true
    }, {
      word: '引人入胜',
      beginpoint: 23,
      endpoint: 25,
      selected: true
    }, {
      word: '受业',
      beginpoint: 25,
      endpoint: 27,
      selected: true
    }, {
      word: '滋润',
      beginpoint: 27,
      endpoint: 29,
      selected: true
    }, {
      word: '想象力',
      beginpoint: 29,
      endpoint: 31,
      selected: true
    }, {
      word: '开窍',
      beginpoint: 31,
      endpoint: 32,
      selected: true
    }, {
      word: '拄拐杖',
      beginpoint: 33,
      endpoint: 35,
      selected: true
    }, {
      word: '恭恭敬敬',
      beginpoint: 36,
      endpoint: 38,
      selected: true
    }, {
      word: '无心插柳柳成阴',
      beginpoint: 38,
      endpoint: 41,
      selected: true
    }, {
      word: '十年树木百年树人',
      beginpoint: 41,
      endpoint: 47,
      selected: true
    }];

    this.idxContent = 0; // First item
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public CanStart(): boolean {
    if (this.IsQuizStarted) {
      return false;
    }

    let amt = 0;
    for (const cl of this.contentList) {
      if (cl.selected) {
        amt++;
      }
    }
    return amt > 0;
  }

  public onQuizStart(): void {
    this.IsQuizStarted = true;

    try {
      this.idxSequence = [];
      for (let i = 0; i < this.contentList.length; i++) {
        if (this.contentList[i].selected) {
          this.idxSequence.push(i);
        }
      }

      if (this.idxSequence.length === 1) {
        this.idxContent = 0;
        this.audioER.nativeElement.currentTime = this.contentList[0].beginpoint;
        this.audioER.nativeElement.play();
        setTimeout(() => {
          console.log('Time is up, pause it!');

          // Do nothing
          this.audioER.nativeElement.pause();
        }, 1000 * (this.contentList[0].endpoint - this.contentList[0].beginpoint));
      } else if (this.idxSequence.length > 1) {
        this.idxSequence = this.onShuffleArray(this.idxSequence);
        console.log(this.idxSequence.join(','));

        this.idxContent = 0;
        this.audioER.nativeElement.currentTime = this.contentList[this.idxSequence[this.idxContent]].beginpoint;
        this.audioER.nativeElement.play();
        setTimeout(() => {
          this.onPlayNextRecord();
        }, 1000 * (this.contentList[this.idxSequence[this.idxContent]].endpoint
          - this.contentList[this.idxSequence[this.idxContent]].beginpoint));
      }
    } catch (exp) {
      console.error(exp);
    }
  }

  public sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // public async demo() {
  //   console.log('Taking a break...');
  //   await this.sleep(2000);
  //   console.log('Two second later');
  // }

  private async onPlayNextRecord() {
    this.idxContent++;
    console.log('Entering onPlayNextRecord');
    this.audioER.nativeElement.pause();

    if (this.idxContent < this.idxSequence.length) {

      console.log(`Taking a break... ${this.idxContent}`);
      await this.sleep(3000);
      console.log('Three seconds later...');

      this.audioER.nativeElement.currentTime = this.contentList[this.idxSequence[this.idxContent]].beginpoint;
      this.audioER.nativeElement.play();
      setTimeout(() => {
        this.onPlayNextRecord();
      }, 1000 * (this.contentList[this.idxSequence[this.idxContent]].endpoint
        - this.contentList[this.idxSequence[this.idxContent]].beginpoint));
    } else {
      // Completed
      this.IsQuizStarted = false;
    }
  }

  private onShuffleArray(ar: any[]): any[] {
    let currentIndex = ar.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = ar[currentIndex];
      ar[currentIndex] = ar[randomIndex];
      ar[randomIndex] = temporaryValue;
    }

    return ar;
  }

  public CanSubmit(): boolean {
    return true;
  }

  public onQuizSubmit(): void {

  }
}
