import { Component, OnInit, ViewChild, ElementRef, Input, Output, } from '@angular/core';

@Component({
  selector: 'app-pg-gobang',
  templateUrl: './pg-gobang.component.html',
  styleUrls: ['./pg-gobang.component.scss']
})
export class PgGobangComponent implements OnInit {
  @ViewChild('canvasgobang') canvasGobang: ElementRef;

  constructor() { }

  ngOnInit() {
  }
}
