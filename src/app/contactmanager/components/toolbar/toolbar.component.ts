import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { NewContactDialogComponent } from '../new-contact-dialog/new-contact-dialog.component';
import { Router } from '@angular/router';
import { UserStorageService } from '../../services/user-storage.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDir = new EventEmitter<void>();

  public newId: number;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserStorageService,) { }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {duration: 5000});
  }

  openAddContactDialog(): void {
    let diaglogRef = this.dialog.open(NewContactDialogComponent, {width: '450px' } );

    diaglogRef.afterClosed().subscribe( result => {
      console.log('The diaglog was closed', result)

      if (result) this.openSnackBar('Contact added!', 'Navigate')
        .onAction().subscribe( () => {
          this.router.navigate(['/contactmanager', result.id]);
        });
    });
  }

}