import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { AuthService } from '../services';
import {
  QuizTypeEnum, PrimarySchoolMathQuizItem, QuizTypeEnum2UIString, 
  AdditionQuizItem, SubtractionQuizItem, MultiplicationQuizItem, DivisionQuizItem
} from '../model';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

export interface quizattenduser {
  attenduser: string;
  displayas: string;
}

export interface quiztypeui {
  qtype: QuizTypeEnum,
  i18term: string,
  display: string  
}

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss']
})
export class UserStatisticsComponent implements OnInit {
  // StatisticQuizItemAmountByType
  // StatisticQuizItemAmountByDate
  // StatisticQuizAmountByDate
  // StatisticQuizAmountByType
  // AttendedUser

  listUsers: quizattenduser[] = [];
  isUserLoaded: boolean = false;
  curUser: string = '';
  listqtype: quiztypeui[] = [];

  // Quiz amount by date
  viewQuizAmountByDate: any[] = [700, 400];
  showXAxisQuizAmountByDate = true;
  showYAxisQuizAmountByDate = true;
  gradientQuizAmountByDate = false;
  showLegendQuizAmountByDate = true;
  showXAxisLabelQuizAmountByDate = true;
  xAxisLabelQuizAmountByDate = 'Date';
  showYAxisLabelQuizAmountByDate = true;
  yAxisLabelQuizAmountByDate = 'Amount';  
  colorSchemeQuizAmountByDate = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  dataQuizAmountByDate: any[] = [];

  // Quiz amount by type
  dataQuizAmountByType: any[] = [];
  viewQuizAmountByType: any[] = [700, 400];
  colorQuizAmountByTypeScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // Item amount by date
  viewItemAmountByDate: any[] = [700, 400];
  showXAxisItemAmountByDate = true;
  showYAxisItemAmountByDate = true;
  gradientItemAmountByDate = false;
  showLegendItemAmountByDate = true;
  showXAxisLabelItemAmountByDate = true;
  xAxisLabelItemAmountByDate = 'Date';
  showYAxisLabelItemAmountByDate = true;
  yAxisLabelItemAmountByDate = 'Amount';  
  colorSchemeItemAmountByDate = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  dataItemAmountByDate: any[] = [];
  
  // Item amount by type
  viewItemAmountByType: any[] = [700, 400];
  showXAxisItemAmountByType = true;
  showYAxisItemAmountByType = true;
  gradientItemAmountByType = false;
  showLegendItemAmountByType = true;
  showXAxisLabelItemAmountByType = true;
  xAxisLabelItemAmountByType = 'Type';
  showYAxisLabelItemAmountByType = true;
  yAxisLabelItemAmountByType = 'Amount';  
  colorSchemeItemAmountByType = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  dataItemAmountByType: any[] = [];

  constructor(private _http: Http,
    private _tranService: TranslateService,
    private _authService: AuthService) {
    // Object.assign(this, {single});
    this.isUserLoaded = false;
    this.curUser = '';

    let arstrs: string[] = [];
    for(let fe in QuizTypeEnum) {
      if (isNaN(Number(fe))) {        
      } else {
        let astr = QuizTypeEnum2UIString(Number(fe));
        arstrs.push(astr);

        let qtu = {
          qtype: Number(fe),
          i18term: astr,
          display: ''
        };
        this.listqtype.push(qtu);        
      }
    }

    // Translate for quiz type
    this._tranService.get(arstrs).subscribe(x => {
      for(let tran in x) {
        //console.log(tran);
        for(let qtu of this.listqtype) {
          if (tran === qtu.i18term) {
            qtu.display = x[tran];
          }
        }
      }
    });

    // Other strings
    arstrs = ['Home.Amount', 'Home.Type', 'Home.Date', 'Home.CorrectedAmount', 'FailedAmount' ];
    this._tranService.get(arstrs).subscribe(x => {
      this.xAxisLabelQuizAmountByDate = x['Home.Date'];
      this.yAxisLabelQuizAmountByDate = x['Home.Amount'];
      this.xAxisLabelItemAmountByDate = x['Home.Date'];
      this.yAxisLabelItemAmountByDate = x['Home.Amount'];
      this.xAxisLabelItemAmountByType = x['Home.Type'];
      this.yAxisLabelItemAmountByType = x['Home.Amount'];
    });    
  }

  ngOnInit() {
    if (!this.isUserLoaded) {
      this.fetchAllUsers();
    }
  }

  public onUserChanged(evnt: any) {
    if (this.curUser !== undefined && this.curUser !== null && this.curUser.length > 0) {
      this.fetchQuizAmountByDate(this.curUser);
      this.fetchQuizAmountByType(this.curUser);
      this.fetchQuizItemAmountByDate(this.curUser);
      this.fetchQuizItemAmountByType(this.curUser);
    }
  }

  public onQuizAmountByDateSelect(evnt: any) {

  }

  public onQuizAmountByTypeSelect(evnt: any) {

  }

  public onItemAmountByDateSelect(evnt: any) {
    
  }
    
  public onItemAmountByTypeSelect(evnt: any) {
    
  }
      
  private fetchAllUsers() {
    this.isUserLoaded = true;

    let apiurl = environment.APIBaseUrl + 'AttendedUser';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        console.log(response);
        return response.json();
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          for (let si of x) {
            let au: quizattenduser = {
              attenduser: si.attendUser,
              displayas: si.displayAs
            };
            if (au.displayas === null || au.displayas === undefined || au.displayas.length <= 0) {
              au.displayas = au.attenduser;
            }
            this.listUsers.push(au);
          }
        }
      });
  }

  private fetchQuizAmountByDate(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizAmountByDate/' + usr;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        return response.json();
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          this.dataQuizAmountByDate = [];

          for (let si of x) {
            let ent: any = {
              name: si.quizDate,
              value: Number(si.amount)
            };

            this.dataQuizAmountByDate.push(ent);
          }
        }
      });
  }
  
  private fetchQuizAmountByType(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizAmountByType/' + usr;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        //console.log(response);
        return response.json();
      })
      .subscribe(x => {
        if (x instanceof Array && x.length > 0) {
          this.dataQuizAmountByType = [];
          for (let si of x) {
            //console.log(si);
            let name: string = '';
            for(let qtu of this.listqtype) {
              if (qtu.qtype === Number(si.quizType)) {
                name = qtu.display;
              }
            }
            let ent: any = {
              name: name,
              value: Number(si.amount)
            };

            this.dataQuizAmountByType.push(ent);
          }
        }
      });
  }

  private fetchQuizItemAmountByDate(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizItemAmountByDate/' + usr;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        //console.log(response);
        return response.json();
      })
      .subscribe(x => {
        this.dataItemAmountByDate = [];
        if (x instanceof Array && x.length > 0) {
          for (let si of x) {
            //console.log(si);
            let rst = {
              name : si.quizDate,
              series: [
                {
                  name: 'Success',
                  value: si.totalAmount - si.failedAmount
                },
                {
                  name: 'Failed',
                  value: si.failedAmount
                }
              ]
            };
            this.dataItemAmountByDate.push(rst);
          }
        }
      });
  }
  
  private fetchQuizItemAmountByType(usr: string) {
    let apiurl = environment.APIBaseUrl + 'StatisticQuizItemAmountByType/' + usr;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    this._http.get(apiurl, options)
      .map((response: Response) => {
        //console.log(response);
        return response.json();
      })
      .subscribe(x => {
        this.dataItemAmountByType = [];
        if (x instanceof Array && x.length > 0) {
          for (let si of x) {
            //console.log(si);
            let name: string = '';
            for(let qtu of this.listqtype) {
              if (qtu.qtype === Number(si.quizType)) {
                name = qtu.display;
              }
            }
            let rst = {
              name : name,
              series: [
                {
                  name: 'Success',
                  value: si.totalAmount - si.failedAmount
                },
                {
                  name: 'Failed',
                  value: si.failedAmount
                }
              ]
            };
            this.dataItemAmountByType.push(rst);
          }
        }
      });
  }
}
