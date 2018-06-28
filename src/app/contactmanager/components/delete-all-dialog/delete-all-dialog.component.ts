import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { UserStorageService } from '../../services/user-storage.service';

@Component({
  selector: 'app-delete-all-dialog',
  templateUrl: './delete-all-dialog.component.html',
  styleUrls: ['./delete-all-dialog.component.scss']
})
export class DeleteAllDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DeleteAllDialogComponent>,
    private userService: UserStorageService
  ) { }

  ngOnInit() {
  }

  delete(): void {
    for (let i = 0; i < this.userService.usedIds.length; i++) {
      this.userService.usedIds.pop();
    }
    this.userService.usedIds = [];
    this.userService.deleteAllUsers().then(users => this.dialogRef.close(users));
    // window.location.reload();
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

}
