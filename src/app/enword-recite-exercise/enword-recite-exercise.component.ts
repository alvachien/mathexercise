import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';

export interface AudioContent {
  beginpoint: number;
  endpoint: number;
}

@Component({
  selector: 'app-enword-recite-exercise',
  templateUrl: './enword-recite-exercise.component.html',
  styleUrls: ['./enword-recite-exercise.component.scss']
})
export class EnwordReciteExerciseComponent implements OnInit, AfterViewInit {
  @ViewChild('audioCtrl') audioER: ElementRef;
  contentList: AudioContent[] = [];
  idxContent: number;  

  constructor() { 
    this.contentList = [{
      beginpoint: 1,
      endpoint: 15
    }, {
      beginpoint: 30,
      endpoint: 40
    }];

    this.idxContent = 0; // First item
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    try {
      this.audioER.nativeElement.currentTime = this.contentList[this.idxContent].beginpoint;
      this.audioER.nativeElement.play();
      setTimeout(() => {
        console.log("Time is up, pause it!");
  
        // Do nothing
        this.audioER.nativeElement.pause();
      }, 1000 * (this.contentList[this.idxContent].endpoint - this.contentList[this.idxContent].beginpoint));
    }
    catch(exp) {

    }
  }
}
