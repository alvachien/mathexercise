import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../model/chinesechess3';
import { LogLevel } from '../model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { map, merge, startWith } from 'rxjs/operators';

@Injectable()
export class ChessAiService {

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  // Launch compute
  public launchCompute(state: State): Observable<any> {
    const apiurl = environment.APIBaseUrl + 'ChineseChessAI';

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    return this._http.put(apiurl, state, { headers: headers, withCredentials: true})
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]:' + response);
        };

        return <any>response;
      });
  }
}
