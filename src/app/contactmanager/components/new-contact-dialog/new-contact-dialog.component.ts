import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/user';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserStorageService } from '../../services/user-storage.service';

@Component({
  selector: 'app-new-contact-dialog',
  templateUrl: './new-contact-dialog.component.html',
  styleUrls: ['./new-contact-dialog.component.scss']
})
export class NewContactDialogComponent implements OnInit {

  avatars: string[] = ['svg-1', 'svg-2', 'svg-3', 'svg-4'];
  user: User;
  name = new FormControl('', [Validators.required]);
  birthDate = new FormControl('');
  avatar = new FormControl('');
  bio = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<NewContactDialogComponent>,
    private userService: UserStorageService,
    //@Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.user = new User();
    this.user.id = this.userService.findFirstOpenId();
  }

  save() {
    this.userService.addUser(this.user).then( user => {
      this.dialogRef.close(user);
    });

    // this.userService.addUser(this.user);
    // this.dialogRef.close(this.user);
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
