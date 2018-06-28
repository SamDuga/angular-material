import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Note } from '../../models/note';
import { UserStorageService } from '../../services/user-storage.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, DoCheck {

  public user: User;
  public userNotes: Note[];
  private paramsSub: Subscription;
  private userSub: Subscription;
  private checkSub: Subscription;
  public empty: boolean;
  public landing: boolean;
  private id: number;

  constructor(
    private route: ActivatedRoute,
//    private userService: UserService,
    private userService: UserStorageService
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

  refresh(): void {
    this.initialize();
    this.paramsSub = this.route.params.subscribe( params => {
      this.id = +params['id'];

      this.userSub = this.userService.getAllUsers().subscribe( (users: User[]) => {

        if (users.length === 0) {
          this.empty = true;
          this.landing = true;
          return;
        }

        if (!this.id) { 
          this.landing = true;
          return; 
        }

        // for use with UserService 
        // this.user = this.userService.getUserbyId(id);

        // for use with UserStorageService
        this.user = users.find( u => u.id === this.id);

        if (!this.user) return;
        this.userNotes = this.user.notes;
      });
    });
  }

  initialize(): void {
    this.user = null;
    this.id = null;
    this.empty = false;
    this.landing = false;
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
    if (this.checkSub) this.checkSub.unsubscribe();
  }

}
