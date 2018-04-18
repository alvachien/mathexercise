import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo, AwardPlan, AwardPlanJson } from '../model';
import { AuthService } from './auth.service';

@Injectable()
export class AwardPlanService {
  public listSubject: BehaviorSubject<AwardPlan[]> = new BehaviorSubject<AwardPlan[]>([]);
  get AwardPlans(): AwardPlan[] {
    return this.listSubject.value;
  }

  createEvent: EventEmitter<AwardPlan | string> = new EventEmitter(null);
  changeEvent: EventEmitter<AwardPlan | string> = new EventEmitter(null);
  deleteEvent: EventEmitter<boolean | string> = new EventEmitter(false);

  constructor(private _http: HttpClient,
    private _authService: AuthService) {
  }

  /**
   * Fetch plans for specified user
   * @param usr User
   */
  public fetchPlansForUser(usr?: string, allowInvalid?: boolean) {
    if (usr === undefined || usr === null) {
      this.listSubject.next([]);
      return;
    }

    const apiurl = environment.APIBaseUrl + 'AwardPlan';

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());
    let params: HttpParams = new HttpParams();
    params = params.set('tgtuser', usr);
    if (allowInvalid) {
      params = params.set('incInvalid', allowInvalid.toString());
    }
    this._http.get(apiurl, { headers: headers, params: params, withCredentials: true })
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log(response);
        }

        const aplans = [];
        const rjs = <any>response;
        if (rjs instanceof Array && rjs.length > 0) {
          for (const si of rjs) {
            const ap: AwardPlan = new AwardPlan();
            ap.parseData(<AwardPlanJson>si);

            aplans.push(ap);
          }
        }

        return aplans;
      })
      .subscribe(x => {
        this.listSubject.next(x);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.log('AC Math Exericse [Debug]: Failed fetchPlansForUser of AwardPlanService: ' + error);
        }
      }, () => {
      });
  }

  /**
   * Create an award plan
   * @param aplan Award plan to create
   */
  public createAwardPlan(aplan: AwardPlan) {
    // Submit to the API
    const apiurl = environment.APIBaseUrl + 'AwardPlan';

    const data = aplan.prepareData();
    const jdata = JSON && JSON.stringify(data);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
      .append('Accept', 'application/json')
      .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    this._http.post(apiurl, jdata, {
        headers: headers,
        withCredentials: true
      })
      .map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]: Map in createAwardPlan of AwardPlanService: ' + response);
        }

        const ap: AwardPlan = new AwardPlan;
        ap.parseData(<any>response);
        return ap;
      })
      .subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exericse [Debug]: Success createAwardPlan of AwardPlanService: ' + x);
        }

        // Add the buffer!
        const data = this.listSubject.value;
        data.push(x);
        this.listSubject.next(data);

        // Raise the event
        this.createEvent.emit(x);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error('AC Math Exericse [Error]: Failed createAwardPlan of AwardPlanService: ' + error);
        }

        this.createEvent.emit(error);
      }, () => {
      });
  }

  public changeAwardPlan(aplan: AwardPlan) {
    // Submit to the API
    const apiurl = environment.APIBaseUrl + 'AwardPlan/' + aplan.ID;

    const data = aplan.prepareData();
    const jdata = JSON && JSON.stringify(data);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    this._http.put(apiurl, data, {
        headers: headers,
        withCredentials: true
      })
      .pipe(map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]:' + response);
        }

        const aplan2: AwardPlan = new AwardPlan();
        aplan2.parseData(<any>response);
        return aplan2;
      }))
      .subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exericse [Debug]: ' + x);
        }

        this.changeEvent.emit(x);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error('AC Math Exericse [Error]: ' + error);
        }

        this.changeEvent.emit(error);
      }, () => {
      });
  }

  public deleteAwardPlan(aplanid: number) {
    // Submit to the API
    const apiurl = environment.APIBaseUrl + 'AwardPlan/' + aplanid;

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json')
              .append('Accept', 'application/json')
              .append('Authorization', 'Bearer ' + this._authService.authSubject.getValue().getAccessToken());

    this._http.delete(apiurl, {
        headers: headers,
        withCredentials: true
      })
      .pipe(map((response: HttpResponse<any>) => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exercise [Debug]:' + response);
        }

        return <any>response;
      }))
      .subscribe(x => {
        if (environment.LoggingLevel >= LogLevel.Debug) {
          console.log('AC Math Exericse [Debug]: ' + x);
        }

        this.deleteEvent.emit(x);
      }, error => {
        if (environment.LoggingLevel >= LogLevel.Error) {
          console.error('AC Math Exericse [Error]: ' + error);
        }

        this.deleteEvent.emit(error);
      }, () => {
      });
  }
}
