import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-contactmanager-app',
  template: `
    <app-sidenav></app-sidenav>
  `,
  styles: []
})
export class ContactmanagerAppComponent implements OnInit {

  constructor(
    private iconReg: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.iconReg.addSvgIconSet( this.sanitizer.bypassSecurityTrustResourceUrl('assets/avatars.svg') );
  }

  ngOnInit() {
  }

}
