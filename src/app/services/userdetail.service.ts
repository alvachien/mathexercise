import { environment } from '../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LogLevel, UserAuthInfo } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class UserDetailService {
  private _isloaded: boolean;
  get IsLoaded(): boolean {
    return this._isloaded;
  }

  private _usrDisplayAs: string;
  get DisplayAs(): string {
    return this._usrDisplayAs;
  }

  constructor(private _http: Http,
    private _authService: AuthService) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log("ACMathExercies Log [Debug]: Entering UserDetailService constructor...");
    }

    this._usrDisplayAs = '';
    this._isloaded = false;
  }

  public fetchUserDetail(): Observable<any> {
    if (!this._isloaded) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
      let options = new RequestOptions({ headers: headers }); // Create a request option
      let apiurl = environment.APIBaseUrl + 'UserDetail/' + this._authService.authSubject.getValue().getUserId();

      this._isloaded = true;

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

      return this._http.get(apiurl, options).map((response: Response) => {
            let jdata = response.json();
            
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

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let options = new RequestOptions({ headers: headers }); // Create a request option
    let apiurl = environment.APIBaseUrl + 'UserDetail';

    let data: any = {};
    data.userID = this._authService.authSubject.getValue().getUserId();
    data.displayAs = dis;
    data.others = '';
    let jdata = JSON && JSON.stringify(data);

    if (this._usrDisplayAs.length === 0) {
      // Not exist yet, create
      this._http.post(apiurl, jdata, options)
        .map((response: Response) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(response);
          }
          return response.json();
        })
        .subscribe((data) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(data);
          }

          this._usrDisplayAs = dis;
        }, (err: Response) => {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error(err.toString());
          }
        });
    } else {
      // Update  
      apiurl = apiurl + '/' + this._authService.authSubject.getValue().getUserId();
      this._http.put(apiurl, jdata, options)
        .map((response: Response) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(response);
          }
          return response.json();
        })
        .subscribe((data) => {
          if (environment.LoggingLevel >= LogLevel.Debug) {
            console.log(data);
          }

          this._usrDisplayAs = dis;
        }, (err: Response) => {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error(err.toString());
          }
        });
    }
  }
}
