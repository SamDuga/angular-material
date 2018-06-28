import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../models/user';
import { UserStorageService } from '../../services/user-storage.service';

@Component({
  selector: 'app-delete-contact-dialog',
  templateUrl: './delete-contact-dialog.component.html',
  styleUrls: ['./delete-contact-dialog.component.scss']
})
export class DeleteContactDialogComponent implements OnInit {

  public user: User;

  constructor(
    private dialogRef: MatDialogRef<DeleteContactDialogComponent>,
    private userService: UserStorageService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.user = this.data.delUser;
  }

  delete() {
    this.userService.deleteUser(this.user).then( user => {
      this.dialogRef.close(user);
    });
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
