import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styles: []
})

export class LogoutComponent implements OnInit {

  
  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router)
  {

  }

  ngOnInit() {

    this.logout();

  }

  logout(): void {
        localStorage.removeItem('currentUser');
        this.checkloginService.emit_logout();
        this.router.navigate(['/sign-in']);
    }
}
