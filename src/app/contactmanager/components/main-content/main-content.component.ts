import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Note } from '../../models/note';
import { UserStorageService } from '../../services/user-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  public user: User;
  public userNotes: Note[];
  public paramsSub: Subscription;
  public userSub: Subscription;
  public empty: boolean = false;
  public landing: boolean = false;

  constructor(
    private route: ActivatedRoute,
//    private userService: UserService,
    private userService: UserStorageService
  ) { }

  ngOnInit() {
    this.user = null;
    let id: number;
    if (this.paramsSub) this.paramsSub.unsubscribe();
    this.paramsSub = this.route.params.subscribe( params => {
      id = +params['id'];
      if ( !id  ) {
        this.landing = true;
        return;
      }

      if (this.userSub) this.userSub.unsubscribe();
      this.userService.getAllUsers().subscribe( (users: User[]) => {
        if (users.length === 0) return;

        // for use with UserService 
        // this.user = this.userService.getUserbyId(id);

        // for use with UserStorageService
        this.user = users.find( u => u.id === id);
        this.landing = false;

        this.userNotes = this.user.notes;
      });
    });
  }

}
