import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-failure-retest',
  templateUrl: './failure-retest.component.html',
  styleUrls: ['./failure-retest.component.scss']
})
export class FailureRetestComponent implements OnInit {

  constructor(private _http: Http,
    private _authService: AuthService) {

  }

  ngOnInit() {
    let usr = this._authService.authSubject.getValue();
    let apiurl = environment.APIBaseUrl + 'quizfailure/' + usr;

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
        console.log(x);
      });
  }

  public onQuizSubmit() {
    
  }
}
