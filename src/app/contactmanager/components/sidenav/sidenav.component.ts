import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { MatSidenav, MatDialog, MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { UserStorageService } from '../../services/user-storage.service';
import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import { DeleteContactDialogComponent } from '../delete-contact-dialog/delete-contact-dialog.component';
import { DeleteAllDialogComponent } from '../delete-all-dialog/delete-all-dialog.component';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  users: Observable<User[]>;
  //users: User[];
  isDarkTheme: boolean = false;
  dir: string = 'ltr';
  userSub: Subscription;

  constructor(
    private zone: NgZone,
    private userService: UserStorageService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.mediaMatcher.addListener(mql =>
      this.zone.run( () => this.mediaMatcher = mql ) );
  }

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  ngOnInit() {
    this.users = this.userService.getAllUsers();
    if (this.userSub) this.userSub.unsubscribe();
    this.userSub = this.userService.getAllUsers().subscribe();

    this.router.events.subscribe( () => {
      if (this.isScreenSmall()) this.sidenav.close();
    });
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

  toggleDir(): void {
    // Now that's a confusing line, bet it'd be worse without parens
    this.dir = (this.dir === 'ltr' ? 'rtl' : 'ltr');
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {duration: 5000});
  }

  openEditContactDialog(user: User): void {
    let diaglogRef = this.dialog.open(EditContactDialogComponent, {width: '450px', data: {editUser: user} } );

    diaglogRef.afterClosed().subscribe( result => {
      console.log('The diaglog was closed', result);

      if (result) this.openSnackBar('Contact updated!', '');
    });
  }

  openDeleteContactDialog(user: User): void {
    let diaglogRef = this.dialog.open(DeleteContactDialogComponent, {width: '480px', data: {delUser: user} } );

    diaglogRef.afterClosed().subscribe( result => {
      console.log('The diaglog was closed', result);

      if (result) this.openSnackBar('Contact deleted!', '');
    });
  }

  openDeleteAllDialog(): void {
    let diaglogRef = this.dialog.open(DeleteAllDialogComponent, {width: '500px'} );

    diaglogRef.afterClosed().subscribe( result => {
      console.log('The diaglog was closed', result);

      if (result) this.openSnackBar('You nuked it!', '');

      this.router.navigate(['contactmanager', 'welcome']);
    });
  }

  reinit(): void {
    this.userService.reinitialize().subscribe((data: User[]) => {
      this.userService.usedIds = [];
      for (let user of data) {
        this.userService.addUser(user);
      }
      this.router.navigate(['contactmanager', 1]);
    }
    );
  }
}
