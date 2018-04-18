import { Injectable } from '@angular/core';
import { Subject, of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, map, startWith } from 'rxjs/operators';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class PgService {
  private _isChineseChessAIDataLoaded: boolean;
  listChineseChessAIData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get ChineseChessAIData(): any[] {
    return this.listChineseChessAIData.value;
  }

  constructor(private _http: HttpClient) {
    this._isChineseChessAIDataLoaded = false;
  }

  public fetchChineseChessAIData(): Observable<any> {
    if (this._isChineseChessAIDataLoaded) {
      return of(this.listChineseChessAIData.value);
    } else {
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'text/plain')
        .append('Accept', 'text/plain');

      return this._http.get(environment.AppHost + '/assets/data/data.txt', { headers: headers, responseType: 'text' })
        .pipe(map(x => {
          this._isChineseChessAIDataLoaded = true;
          const listRst = x.split(' ');
          this.listChineseChessAIData.next(listRst);
          return listRst;
        }), catchError((error: HttpErrorResponse) => {
          this._isChineseChessAIDataLoaded = false;
          this.listChineseChessAIData.next([]);

          return Observable.throw(error.statusText + '; ' + error.error + '; ' + error.message);
        }));
    }
  }
}
