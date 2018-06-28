import { Component, OnInit, Input, ViewChild, DoCheck } from '@angular/core';
import { Note } from '../../models/note';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBarRef, SimpleSnackBar, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewNoteDialogComponent } from '../new-note-dialog/new-note-dialog.component';

import { UserStorageService } from '../../services/user-storage.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, DoCheck {

  @Input() notes: Note[];

  public dataSource: MatTableDataSource<Note>;
  private dataSub: Subscription;
  private checkSub: Subscription;
  private allUsersSub: Subscription;
  private id: number;
  private prevLength: number;
  private user: User;
  public displayedColumns = ['position', 'title', 'date'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserStorageService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

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

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openAddNoteDialog(): void {
    if (this.user.notes) this.prevLength = this.user.notes.length;
    let diaglogRef = this.dialog.open(NewNoteDialogComponent, {width: '450px', data:  { user: this.user } });

    diaglogRef.afterClosed().subscribe( result => {
      //console.log('The diaglog was closed', result);
      if (this.user !== null && this.user.notes.length > this.prevLength ) this.openSnackBar('Note added!', '');
    });

  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {duration: 5000});
  }

  refresh(): void {
    this.initialize();
    this.dataSub = this.route.params.subscribe( params => {
      this.id = +params['id'];

      if (!this.id) return;

      this.allUsersSub = this.userService.getAllUsers().subscribe( (users: User[]) => {
        this.user = users.find( u => u.id === this.id);
        if (!this.user) return;
        if (!this.user.notes) this.prevLength = 0;
        this.dataSource = new MatTableDataSource<Note>(this.user.notes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }

  initialize(): void {
    this.id = null;
    this.user = null;
    this.dataSource = null;
    if (this.dataSub) this.dataSub.unsubscribe();
    if (this.checkSub) this.checkSub.unsubscribe();
    if (this.allUsersSub) this.allUsersSub.unsubscribe();
  }

}
