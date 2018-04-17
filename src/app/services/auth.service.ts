import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';
import { UserManager, Log, MetadataService, User } from 'oidc-client';

const AuthSettings: any = {
  authority: environment.IDServerUrl,
  client_id: 'acexercise.math',
  redirect_uri: environment.AppLoginCallbackUrl,
  post_logout_redirect_uri: environment.AppLogoutCallbackUrl,
  response_type: 'id_token token',
  scope: 'openid profile api.acquiz',

  silent_redirect_uri: environment.AppLoginSlientRevewCallbackUrl,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTime: 4,
  //silentRequestTimeout:10000,

  filterProtocolClaims: true,
  loadUserInfo: true
};


@Injectable()
export class AuthService {
  public authSubject: BehaviorSubject<UserAuthInfo> = new BehaviorSubject(new UserAuthInfo());
  public authContent: Observable<UserAuthInfo> = this.authSubject.asObservable();
  private mgr: UserManager;
  private authHeaders: Headers;
  public userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACMathExercies Log [Debug]: Entering AuthService constructor...');
    }

    this.mgr = new UserManager(AuthSettings);

    const that = this;
    this.mgr.getUser().then(function (u) {
      if (u) {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('ACMathExercies Log [Debug]: AuthService constructor, user get successfully as following: ');
          console.log(u);
        }

        // Set the content
        that.authSubject.value.setContent(u);

        // Broadcast event
        that.userLoadededEvent.emit(u);
      }
      else {
        that.authSubject.value.cleanContent();
      }

      that.authSubject.next(that.authSubject.value);
    }, function (reason) {
      if (environment.LoggingLevel >= LogLevel.Error) {
        console.log('ACMathExercies Log [Error]: AuthService failed to fetch user:');
        console.log(reason);
      }
    });

    this.mgr.events.addUserUnloaded((e) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('ACMathExercies Log [Debug]: User unloaded');
      }
      that.authSubject.value.cleanContent();

      that.authSubject.next(that.authSubject.value);
    });

    this.mgr.events.addAccessTokenExpiring(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.warn('ACMathExercies Log: token expiring');
      }
    });
    this.mgr.events.addAccessTokenExpired(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.error('ACMathExercies Log: token expired');
      }

      that.doLogin();
    });
  }

  public doLogin() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACMathExercies Log [Debug]: Start the login...');
    }

    if (this.mgr) {
      this.mgr.signinRedirect().then(function () {
      //this.mgr.signinSilent().then(function(){
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.info('ACMathExercies Log [Debug]: Redirecting for login...');
        }
      })
      .catch(function (er) {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error('ACMathExercies Log [Error]: Sign-in error', er);
        }
      });
    }
  }

  public doLogout() {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACMathExercies Log [Debug]: Start the logout...');
    }

    if (this.mgr) {
      this.mgr.signoutRedirect().then(function () {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.info('ACMathExercies Log [Debug]: redirecting for logout...');
        }
      })
        .catch(function (er) {
          if (environment.LoggingLevel >= LogLevel.Error) {
            console.error('ACMathExercies Log [Error]: Sign-out error', er);
          }
        });
    }
  }

  clearState() {
    this.mgr.clearStaleState().then(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('clearStateState success');
      }
    }).catch(function (e) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.error('clearStateState error', e.message);
      }
    });
  }

  getUser() {
    this.mgr.getUser().then((user) => {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('got user', user);
      }

      this.userLoadededEvent.emit(user);
    }).catch(function (err) {
      console.error(err);
    });
  }

  removeUser() {
    this.mgr.removeUser().then(() => {
      this.userLoadededEvent.emit(null);
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('user removed');
      }
    }).catch(function (err) {
      console.error(err);
    });
  }

  startSigninMainWindow() {
    this.mgr.signinRedirect({ data: 'some data' }).then(function () {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('signinRedirect done');
      }
    }).catch(function (err) {
      console.error(err);
    });
  }

  endSigninMainWindow() {
    this.mgr.signinRedirectCallback().then(function (user) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('signed in', user);
      }
    }).catch(function (err) {
      console.error(err);
    });
  }

  startSignoutMainWindow() {
    this.mgr.signoutRedirect().then(function (resp) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('signed out', resp);
      }
      setTimeout(5000, () => {
        console.log('testing to see if fired...');
      });
    }).catch(function (err) {
      console.error(err);
    });
  };

  endSignoutMainWindow() {
    this.mgr.signoutRedirectCallback().then(function (resp) {
      if (environment.LoggingLevel >= LogLevel.Debug) {
        console.log('signed out', resp);
      }
    }).catch(function (err) {
      console.error(err);
    });
  };

  // /**
  //  * @param options if options are not supplied the default content type is application/json
  //  */
  // AuthGet(url: string, options?: RequestOptions): Observable<Response> {
  //   if (options) {
  //     options = this._setRequestOptions(options);
  //   }
  //   else {
  //     options = this._setRequestOptions();
  //   }
  //   return this.http.get(url, options);
  // }

  // /**
  //  * @param options if options are not supplied the default content type is application/json
  //  */
  // AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

  //   const body = JSON.stringify(data);

  //   if (options) {
  //     options = this._setRequestOptions(options);
  //   }
  //   else {
  //     options = this._setRequestOptions();
  //   }
  //   return this.http.put(url, body, options);
  // }

  // /**
  //  * @param options if options are not supplied the default content type is application/json
  //  */
  // AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

  //   if (options) {
  //     options = this._setRequestOptions(options);
  //   }
  //   else {
  //     options = this._setRequestOptions();
  //   }
  //   return this.http.delete(url, options);
  // }

  // /**
  //  * @param options if options are not supplied the default content type is application/json
  //  */
  // AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {

  //   const body = JSON.stringify(data);

  //   if (options) {
  //     options = this._setRequestOptions(options);
  //   }
  //   else {
  //     options = this._setRequestOptions();
  //   }
  //   return this.http.post(url, body, options);
  // }

  // private _setAuthHeaders(user: any) {
  //   this.authHeaders = new Headers();
  //   this.authHeaders.append('Authorization', user.token_type + ' ' + user.access_token);
  //   this.authHeaders.append('Content-Type', 'application/json');
  // }

  // private _setRequestOptions(options?: RequestOptions) {

  //   if (options) {
  //     options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
  //   }
  //   else {
  //     options = new RequestOptions({ headers: this.authHeaders, body: '' });
  //   }

  //   return options;
  // }
}


