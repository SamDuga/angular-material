import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactmanagerAppComponent } from './contactmanager-app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserService } from './services/user.service';
import { NotesComponent } from './components/notes/notes.component';
import { NewContactDialogComponent } from './components/new-contact-dialog/new-contact-dialog.component';
import { NewNoteDialogComponent } from './components/new-note-dialog/new-note-dialog.component';
import { UserStorageService } from './services/user-storage.service';
import { EditContactDialogComponent } from './components/edit-contact-dialog/edit-contact-dialog.component';
import { DeleteContactDialogComponent } from './components/delete-contact-dialog/delete-contact-dialog.component';
import { DeleteAllDialogComponent } from './components/delete-all-dialog/delete-all-dialog.component';


const routes: Routes = [
  { path: '', component: ContactmanagerAppComponent,
    children: [
      { path: ':id', component: MainContentComponent},
      { path: '', component: MainContentComponent, redirectTo: '/contactmanager/welcome'}
    ]},
  { path: '**', redirectTo: '/contactmanager/welcome'}
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [ UserService, UserStorageService ],
  declarations: [
    ContactmanagerAppComponent,
    ToolbarComponent,
    MainContentComponent,
    SidenavComponent,
    NotesComponent,
    NewContactDialogComponent,
    NewNoteDialogComponent,
    EditContactDialogComponent,
    DeleteContactDialogComponent,
    DeleteAllDialogComponent
  ],
  entryComponents: [ 
    NewContactDialogComponent, 
    NewNoteDialogComponent, 
    EditContactDialogComponent, 
    DeleteContactDialogComponent, 
    DeleteAllDialogComponent ]
})
export class ContactmanagerModule { }
