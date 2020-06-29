import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PgSummaryDlgInfo {
  gameWin: boolean;
  timeSpent: number;
  haveARetry: boolean;
}

@Component({
  selector: 'app-pg-summary-dlg',
  templateUrl: './pg-summary-dlg.component.html',
  styleUrls: ['./pg-summary-dlg.component.scss']
})
export class PgSummaryDlgComponent {
  constructor(public dialogRef: MatDialogRef<PgSummaryDlgComponent>,
    @Inject(MAT_DIALOG_DATA) public dlgInfo: PgSummaryDlgInfo) {
  }

  public onNoClick() {
    this.dlgInfo.haveARetry = false;
    this.dialogRef.close();
  }
}
