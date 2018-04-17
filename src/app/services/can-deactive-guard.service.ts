import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LogLevel, UserAuthInfo } from '../model';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(component: CanComponentDeactivate) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('AC Math Exercise [Debug]: entering canDeactivate of CanDeactivateGuard');
    }
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
