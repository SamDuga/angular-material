import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';

import { Note } from '../models/note';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  private _usedIds: number[];

  constructor(
    private database: AngularFireDatabase,
    private http: HttpClient
  ) { 
    if (!Array.isArray(this.usedIds) || !this.usedIds.length) this.usedIds = [];
   }

  //Find the first open array index to drop a user into
  findFirstOpenId(): number {
    let firstOpen = 1;
    while (this._usedIds.includes(firstOpen)) {
      firstOpen++;
    }
    return firstOpen;
  }

  set usedIds(ids: number[]) {
    this._usedIds = ids;
  }

  // No need to loadAll when we can just subscribe to getAllUsers
  // We don't need getUserById when we have an observable with all users

  getAllUsers(): Observable<User[]> {
    return this.database.list<User>('/users').valueChanges();
  }

  addUser(user: User): Promise<void> {
    // We don't make any notes on the NewContactDialog, so we'll just flesh out the property here
    if (!user.notes) {
      let noteArr: Note[] = [];
      user.notes = noteArr;
    }

    // Keep track of the ids in use
    this._usedIds.push(user.id);

    return this.database.object(`/users/${user.id - 1}`).update(user);
  }

  // We don't need to push a new note, we can just update the user. Plus we can use the same function to edit now
  updateUser(user: User): Promise<void> {
    return this.database.object<User>(`/users/${user.id - 1}`).update(user);
  }

  deleteUser(user: User): Promise<void> {
    this._usedIds.splice(this._usedIds.findIndex(id => user.id === id), 1);
    // Don't really HAVE to sort these, but arrow/lambda functions are scary so I'll use them until they aren't
    this._usedIds.sort((a, b) => a - b);

    return this.database.object<User>(`/users/${user.id - 1}`).remove();
  }

  deleteAllUsers(): Promise<void> {
    // Set our usedIds to empty
    this._usedIds = [];
    // Then delete what's left
    return this.database.object<User>(`/users/`).remove();
  }

  // Reset to the provided 4 users
  reinitialize(): Observable<User[]> {
    return this.http.get<User[]>('https://angular-material-api.azurewebsites.net/users');
  }
}
