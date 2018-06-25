import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Note } from '../../models/note';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBarRef, SimpleSnackBar, MatDialog, MatSnackBar } from '@angular/material';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewNoteDialogComponent } from '../new-note-dialog/new-note-dialog.component';
import { UserStorageService } from '../../services/user-storage.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  @Input() notes: Note[];

  dataSource: MatTableDataSource<Note>;
  displayedColumns = ['position', 'title', 'date'];
  dataSub: Subscription;
  id: number
  user: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserStorageService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.user = null;
    if (this.dataSub) this.dataSub.unsubscribe();
    this.dataSub = this.route.params.subscribe( params => {
      this.id = +params['id'];
      this.userService.getAllUsers().subscribe( (users: User[]) => {
        this.user = users.find( u => u.id === this.id);
        this.dataSource = new MatTableDataSource<Note>(this.user.notes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }) 
    });
  }

  //Important to initialize these AFTER the page loads
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openAddNoteDialog(): void {
    let diaglogRef = this.dialog.open(NewNoteDialogComponent, {width: '450px', data:  { user: this.user } });

    diaglogRef.afterClosed().subscribe( result => {
      console.log('The diaglog was closed', result)
      this.refresh();
      this.openSnackBar('Note added!','');
    });

  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {duration: 5000});
  }

}
