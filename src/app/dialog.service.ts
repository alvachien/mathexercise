import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

  constructor() { }

  public FailureInfos: string[] = [];
  public SummaryInfos: string[] = [];
}
