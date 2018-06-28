import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { User } from '../../models/user';
import { UserStorageService } from '../../services/user-storage.service';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent implements OnInit {

  public user: User;
  public avatars: string[] = ['svg-1', 'svg-2', 'svg-3', 'svg-4'];
  public name = new FormControl('', [Validators.required]);
  public birthDate = new FormControl('');
  public avatar = new FormControl('');
  public bio = new FormControl('');

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
