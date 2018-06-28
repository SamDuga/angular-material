import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  private _usedIds: number[];
  private countSub: Subscription;

  constructor(
    private database: AngularFireDatabase,
    private http: HttpClient
  ) {
    if (!Array.isArray(this.usedIds) || !this.usedIds.length) this.usedIds = [];
    this.countSub = this.getAllUsers().subscribe((data: User[]) => {
      for (let user of data) {
        if (!this._usedIds.includes(user.id)) this._usedIds.push(user.id);
      }
    });
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

  get usedIds(): number[] {
    return this._usedIds;
  }

  // No need to loadAll when we can just subscribe to getAllUsers
  // We don't need getUserById when we have an observable with all users

  getAllUsers(): Observable<User[]> {
    return this.database.list<User>('/users').valueChanges();
  }

  addUser(user: User): Promise<void> {
    if (this.countSub) this.countSub.unsubscribe();
   
    // Keep track of the ids in use
    this._usedIds.push(user.id);

    return this.database.object(`/users/${user.id - 1}`).update(user);
  }

  // We don't need to push a new note, we can just update the user. Plus we can use the same function to edit now
  updateUser(user: User): Promise<void> {
    if (this.countSub) this.countSub.unsubscribe();
    return this.database.object<User>(`/users/${user.id - 1}`).update(user);
  }

  deleteUser(user: User): Promise<void> {
    if (this.countSub) this.countSub.unsubscribe();
    while (this.usedIds.includes(user.id)) this._usedIds.splice(this._usedIds.findIndex(id => user.id === id), 1);
    // Don't really HAVE to sort these, but arrow/lambda functions are scary so I'll use them until they aren't
    this._usedIds.sort((a, b) => a - b);

    return this.database.object<User>(`/users/${user.id - 1}`).remove();
  }

  deleteAllUsers(): Promise<void> {
    if (this.countSub) this.countSub.unsubscribe();
    // Set our usedIds to empty
    for (let i = 0; i < this._usedIds.length; i++) {
      this._usedIds.pop();
    }
    this._usedIds = [];
    // Then delete what's left
    return this.database.object<User>(`/users/`).remove();
  }

  // Reset to the provided 4 users
  reinitialize(): Observable<User[]> {
    if (this.countSub) this.countSub.unsubscribe();
    return this.http.get<User[]>('https://angular-material-api.azurewebsites.net/users');
  }
}
