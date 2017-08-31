import { Component, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
  MessageHeader: string = '';
  MessageContent: string = '';

  constructor(private _dlgsvc: DialogService) {
  }

  ngOnInit() {
    this.MessageHeader = this._dlgsvc.MessageDialogHeader;
    this.MessageContent = this._dlgsvc.MessageDialogContent;
  }
}
