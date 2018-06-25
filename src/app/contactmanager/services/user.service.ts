import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users: BehaviorSubject<User[]>;

  private usersUrl = 'https://angular-material-api.azurewebsites.net/users';

  private dataStore: {
    users: User[];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { users: [] };
    this._users = new BehaviorSubject<User[]>([]);
  }

  get users(): Observable<User[]> {
    return this._users.asObservable();
  }

  getUserbyId(id: number): User {
    return this.dataStore.users.find( x => x.id === id);
  }

  loadAll(): Subscription {
    return this.http.get<User[]>(this.usersUrl)
      .subscribe(
        data => {
          this.dataStore.users = data;
          this._users.next(Object.assign({}, this.dataStore).users);
        },
        error => console.log(`Failed to fetch users: ${error}`)
      );
  }

  addUser(user: User): Promise<User> {
    return new Promise( (resolve, reject) => {
      user.id = this.dataStore.users.length + 1;
      this.dataStore.users.push(user);
      this._users.next(Object.assign({}, this.dataStore).users);
      resolve(user);
    });
  }

  saveNoteForUser(id: number, newNote: Note): Promise<User> {
    if (this.dataStore.users[id]) {

      return new Promise( (resolve, reject) => {
        newNote.id = this.dataStore.users[id].notes.length + 1;
        this.dataStore.users[id].notes.push(newNote);
        this._users.next(Object.assign({}, this.dataStore).users);
        resolve(this.getUserbyId(id));
      });
      
    }
  }

}
