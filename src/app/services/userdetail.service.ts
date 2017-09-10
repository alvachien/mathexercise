import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LogLevel, UserAuthInfo } from '../model';
import { AuthService } from './auth.service';

/**
 * Attend user
 */
export interface QuizAttendUser {
  attenduser: string;
  displayas: string;
}

@Injectable()
export class UserDetailService {
  private _isloaded: boolean;
  get IsUserDetailLoaded(): boolean {
    return this._isloaded;
  }

  private _usrDisplayAs: string;
  get DisplayAs(): string {
    return this._usrDisplayAs;
  }

  private _islistloaded: boolean;
  get IsAttendUserLoaded(): boolean {
    return this._islistloaded;
  }

  private _listUsers: QuizAttendUser[] = [];
  get AttendUsers(): QuizAttendUser[] {
    return this._listUsers;
  }

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACMathExercies Log [Debug]: Entering UserDetailService constructor...');
    }

    this._usrDisplayAs = '';
    this._isloaded = false;
    this._islistloaded = false;
  }

  public fetchUserDetail(): Observable<any> {
    if (!this._isloaded) {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json')
        .append('Accept', 'application/json')
        .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      const apiurl = environment.APIBaseUrl + 'UserDetail/' + this._authService.authSubject.getValue().getUserId();

      // !!!
      // Return Observable from a subscribe is not working!!!
      // !!!
      // this._http.get(apiurl, options)
      //   .map((response: Response) => {
      //     if (environment.LoggingLevel >= LogLevel.Debug) {
      //       console.log(response);
      //     }

      //     return response.json();
      //   })
      //   .subscribe((data) => {
      //     if (environment.LoggingLevel >= LogLevel.Debug) {
      //       console.log(data);
      //     }

      //     this._usrDisplayAs = data.displayAs;
      //     return Observable.of(this._usrDisplayAs);
      //   }, (err: Response) => {
      //     if (environment.LoggingLevel >= LogLevel.Error) {
      //       console.error(err.toString());
      //     }
      //     if (err.status === 404) {
      //       // Do something?
      //     }

      //     return Observable.of(null);
      //   });

      return this._http.get(apiurl, {
          headers: headers,
          withCredentials: true
        })
        .map((response: HttpResponse<any>) => {
          this._isloaded = true;

          const jdata = <any>response;

          this._usrDisplayAs = jdata.displayAs;
          return this._usrDisplayAs;
        });
    } else {
      return Observable.of(this._usrDisplayAs);
    }
  }

  public saveUserDetail(dis: string) {
    if (dis.length <= 0) {
      return;
    }

    if (!this._isloaded) {
      return;
    }

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let apiurl = environment.APIBaseUrl + 'UserDetail';

    const data: any = {};
    data.userID = this._authService.authSubject.getValue().getUserId();
    data.displayAs = dis;
    data.others = '';
    const jdata = JSON && JSON.stringify(data);

    if (this._usrDisplayAs.length === 0) {
      // Not exist yet, create
      this._http.post(apiurl, jdata, {
          headers: headers,
          withCredentials: true
        })
        .map((response: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log('AC Math Exercise [Debug]:' + response);
          }
          return <any>response;
        })
        .subscribe((data) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log('AC Math Exercise [Debug]:' + data);
          }

          this._usrDisplayAs = dis;
        }, (err: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error(err.toString());
          }
        });
    } else {
      // Update
      apiurl = apiurl + '/' + this._authService.authSubject.getValue().getUserId();
      this._http.put(apiurl, jdata, {
          headers: headers,
          withCredentials: true
        })
        .map((response: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log('AC Math Exercise [Debug]:' + response);
          }
          return <any>response;
        })
        .subscribe((data) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log('AC Math Exercise [Debug]:' + data);
          }

          this._usrDisplayAs = dis;
        }, (err: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error('AC Math Exercise [Error]:' + err.toString());
          }
        });
    }
  }

  public fetchAllUsers(): Observable<any> {
    if (!this._islistloaded) {
      const apiurl = environment.APIBaseUrl + 'AttendedUser';

      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json')
        .append('Accept', 'application/json')
        .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      return this._http.get(apiurl, {
          headers: headers,
          withCredentials: true
        })
        .map((response: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(response);
          }

          this._islistloaded = true;

          const rjs = <any>response;
          this._listUsers = [];
          if (rjs instanceof Array && rjs.length > 0) {
            for (const si of rjs) {
              const au: QuizAttendUser = {
                attenduser: si.attendUser,
                displayas: si.displayAs
              };
              if (au.displayas === null || au.displayas === undefined || au.displayas.length <= 0) {
                au.displayas = au.attenduser;
              }
              this._listUsers.push(au);
            }
          }

          return this._listUsers;
        });
    } else {
      return Observable.of(this._listUsers);
    }
  }
}
