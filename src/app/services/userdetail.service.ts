import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { map, merge, startWith } from 'rxjs/operators';
import { LogLevel, UserAuthInfo, UserDetailInfo, UserDetailInfoJson } from '../model';
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

  private _usrDetialInfo: UserDetailInfo;
  get UserId(): string {
    return this._usrDetialInfo.UserId;
  }
  get DisplayAs(): string {
    return this._usrDetialInfo.DisplayAs;
  }
  get Others(): string {
    return this._usrDetialInfo.Others;
  }
  get UserDetailInfoInstance(): UserDetailInfo {
    return this._usrDetialInfo;
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

    this._usrDetialInfo = null;
    this._isloaded = false;
    this._islistloaded = false;
  }

  public fetchUserDetail(): Observable<UserDetailInfo> {
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
        .pipe(map((response: HttpResponse<any>) => {
          this._isloaded = true;

          const jdata = <any>response;

          this._usrDetialInfo = new UserDetailInfo();
          this._usrDetialInfo.onSetData(jdata);
          return this._usrDetialInfo;
        }));
    } else {
      return of(this._usrDetialInfo);
    }
  }

  public saveUserDetail(usrdtl: UserDetailInfo) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let apiurl = environment.APIBaseUrl + 'UserDetail';

    const data: UserDetailInfoJson = usrdtl.generateJSON();
    const jdata = JSON && JSON.stringify(data);

    if (this._usrDetialInfo === null) {
      // Not exist yet, create
      this._http.post(apiurl, jdata, {
          headers: headers,
          withCredentials: true
        })
        .pipe(map((response: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(`AC Math Exercise [Debug]: User Detail Create Map: ${response}`);
          }
          return <any>response;
        }))
        .subscribe((data2: any) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(`AC Math Exercise [Debug]: User Detail Post Subscribe: ${data2}`);
          }

          this._usrDetialInfo = new UserDetailInfo();
          this._usrDetialInfo.onSetData(data2);
          this._isloaded = true;
        }, (err: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error('AC Math Exercise [Error]:' + err.statusText + err.body);
          }
        });
    } else {
      // Update
      apiurl = apiurl + '/' + this._authService.authSubject.getValue().getUserId();
      this._http.put(apiurl, jdata, {
          headers: headers,
          withCredentials: true
        })
        .pipe(map((response: HttpResponse<any>) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(`AC Math Exercise [Debug]: User Detail Change Map:  ${response}`);
          }
          return <any>response;
        }))
        .subscribe((data2: any) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(`AC Math Exercise [Debug]: User Detail Change Subscribe: ${data2}`);
          }

          this._usrDetialInfo = new UserDetailInfo();
          this._usrDetialInfo.onSetData(data2);
          this._isloaded = true;
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
        .pipe(map((response: HttpResponse<any>) => {
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
        }));
    } else {
      return of(this._listUsers);
    }
  }
}
