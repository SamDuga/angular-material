import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UserStorageService } from '../../services/user-storage.service';

@Component({
  selector: 'app-new-contact-dialog',
  templateUrl: './new-contact-dialog.component.html',
  styleUrls: ['./new-contact-dialog.component.scss']
})
export class NewContactDialogComponent implements OnInit {

  public avatars: string[] = ['svg-1', 'svg-2', 'svg-3', 'svg-4'];
  public user: User;
  public name = new FormControl('', [Validators.required]);
  public birthDate = new FormControl('');
  public avatar = new FormControl('');
  public bio = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<NewContactDialogComponent>,
    private userService: UserStorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new User();
    this.user.id = this.userService.findFirstOpenId();
  }

  save() {
    this.userService.addUser(this.user).then( user => {
      this.dialogRef.close(user);
      this.router.navigate(['contactmanager', this.user.id]);
    });

    // this.userService.addUser(this.user);
    // this.dialogRef.close(this.user);
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
