import { Component, OnInit, Inject } from '@angular/core';
import { UserStorageService } from '../../services/user-storage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../models/user';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent implements OnInit {

  public user: User;
  avatars: string[] = ['svg-1', 'svg-2', 'svg-3', 'svg-4'];
  name = new FormControl('', [Validators.required]);
  birthDate = new FormControl('');
  avatar = new FormControl('');
  bio = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<EditContactDialogComponent>,
    private userService: UserStorageService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.user = this.data.editUser;
  }

  save() {
    this.userService.updateUser(this.user).then( user => {
      this.dialogRef.close(user);
    });
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
