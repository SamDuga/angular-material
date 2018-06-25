import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../../services/user-storage.service';
import { MatDialogRef } from '@angular/material';

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
    console.log('ERICK CANNOT BE DESTROYED');
    this.userService.deleteAllUsers().then( users => this.dialogRef.close(users) );
    // window.location.reload();
  }

  dismiss(): void {
    this.dialogRef.close(null);
  }

}
