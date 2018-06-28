import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { Note } from '../../models/note';
import { User } from '../../models/user';
import { UserStorageService } from '../../services/user-storage.service';

@Component({
  selector: 'app-new-note-dialog',
  templateUrl: './new-note-dialog.component.html',
  styleUrls: ['./new-note-dialog.component.scss']
})
export class NewNoteDialogComponent implements OnInit {

  public newNote: Note;
  public noteText = new FormControl('');
  public date = new FormControl(['', [Validators.required]]);
  public user: User;

  constructor(
    private dialogRef: MatDialogRef<NewNoteDialogComponent>,
    private userService: UserStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.newNote = new Note();

    this.user = this.data.user;
  }

  save() {

    if (!this.user.notes) {
      let newArr: Note[] = [];
      this.user.notes = newArr;
    }

    this.newNote.id = this.user.notes.length + 1;

    this.user.notes.push(this.newNote);

    // this.userService.saveNoteForUser(this.userId, this.newNote).then( user => {
    //   this.dialogRef.close(user)
    //  });

    this.userService.updateUser(this.user).then( updatedUser => {
      this.dialogRef.close(updatedUser);
    });
  }

  dismiss() {
    this.dialogRef.close(null);
  }

}
