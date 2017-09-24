import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogLevel, AudioContent } from '../model';

@Component({
  selector: 'app-cnword-recite-exercise',
  templateUrl: './cnword-recite-exercise.component.html',
  styleUrls: ['./cnword-recite-exercise.component.scss']
})
export class CnwordReciteExerciseComponent implements OnInit {
  @ViewChild('audioCtrl') audioER: ElementRef;
  contentList: AudioContent[] = [];
  idxContent: number;
  IsQuizStarted = false;
  idxSequence: number[] = [];

  constructor() {
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
        }, 1000 * (this.contentList[this.idxSequence[this.idxContent]].endpoint - this.contentList[this.idxSequence[this.idxContent]].beginpoint));
      }
    }
    catch (exp) {
      console.error(exp);
    }
  }

  public sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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
      }, 1000 * (this.contentList[this.idxSequence[this.idxContent]].endpoint - this.contentList[this.idxSequence[this.idxContent]].beginpoint));
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
