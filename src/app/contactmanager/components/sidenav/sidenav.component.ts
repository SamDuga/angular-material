import { Component, OnInit, NgZone, ViewChild, DoCheck } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav, MatDialog, MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
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
export class SidenavComponent implements OnInit, DoCheck {

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  public users: Observable<User[]>;
  public isDarkTheme: boolean = false;
  public dir: string = 'ltr';
  private id: number;
  private userSub: Subscription;
  private routerSub: Subscription;
  private paramSub: Subscription;
  private checkSub: Subscription;
  private reinitSub: Subscription;

  constructor(
    private zone: NgZone,
    private userService: UserStorageService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.mediaMatcher.addListener(mql =>
      this.zone.run( () => this.mediaMatcher = mql ) );
  }

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  ngOnInit(): void {
    this.refresh();
  }

  ngDoCheck(): void {
    if (this.checkSub) this.checkSub.unsubscribe();

    this.checkSub = this.route.params.subscribe( params => {
      let checkId = +params['id'];

      if (!checkId || !this.id) return;

      if (checkId && checkId === this.id) return;

      if (checkId && checkId !== this.id) {

        this.refresh();
      }
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
      //console.log('The diaglog was closed', result);

      if (result) this.openSnackBar('Contact updated!', '');
    });
  }

  openDeleteContactDialog(user: User): void {
    let diaglogRef = this.dialog.open(DeleteContactDialogComponent, {width: '480px', data: {delUser: user} } );

    diaglogRef.afterClosed().subscribe( result => {
      //console.log('The diaglog was closed', result);

      if (result) this.openSnackBar('Contact deleted!', '');
    });
  }

  openDeleteAllDialog(): void {
    let diaglogRef = this.dialog.open(DeleteAllDialogComponent, {width: '500px'} );

    diaglogRef.afterClosed().subscribe( result => {
      //console.log('The diaglog was closed', result);
      this.router.navigate(['contactmanager', 'welcome']);
    });
  }

  reinit(): void {
    this.initialize();
    this.userService.deleteAllUsers();
    this.userService.reinitialize().subscribe((data: User[]) => {
      this.userService.usedIds = [];
      for (let user of data) {
        this.userService.addUser(user);
      }

      this.users = this.userService.getAllUsers();
      this.userSub = this.userService.getAllUsers().subscribe();

      this.router.navigate(['contactmanager', 1]);
    }
    );
  }

  initialize(): void {
    this.id = null;
    this.users = null;
    if (this.userSub) this.userSub.unsubscribe();
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.checkSub) this.checkSub.unsubscribe();
    if (this.reinitSub) this.reinitSub.unsubscribe();
    if (this.paramSub) this.paramSub.unsubscribe();
  }

  refresh(): void {
    this.initialize();

    this.users = this.userService.getAllUsers();
    this.userSub = this.userService.getAllUsers().subscribe();

    this.routerSub = this.router.events.subscribe( () => {
      if (this.isScreenSmall()) this.sidenav.close();
    });

    this.paramSub = this.route.params.subscribe( params => {
      this.id = +params['id'];
    });
  }
}
