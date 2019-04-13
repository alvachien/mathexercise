import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss']
})
export class QuestionBankComponent implements OnInit {
  arQuestions: any[] = [];

  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this._http.get('assets/data/qbank.json').subscribe((x: any) => {
      this.arQuestions = x;
    });
  }
}
