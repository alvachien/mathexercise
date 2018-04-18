import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import {
  QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString, LogLevel, APIQuizSection, APIQuizFailLog, APIQuiz,
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem, DateFormat,
  StatisticsDateRange, StatisticsDateRangeEnum, getStatisticsDateRangeEnumString, getStatisticsDateRangeDate
} from '../model';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuizAttendUser, UserDetailService } from '../services/userdetail.service';
import { DataSource } from '@angular/cdk/collections';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import * as moment from 'moment';

import 'rxjs/add/observable/merge';



import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss']
})
export class UserStatisticsComponent implements OnInit, AfterViewInit {
  allviews: any[] = [
    {value: 1, name: 'Normal'},
    {value: 2, name: 'Trend'},
  ];
  selectedView: number;

  constructor(private _http: HttpClient,
    private _tranService: TranslateService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService) {
    this.selectedView = 1;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}
