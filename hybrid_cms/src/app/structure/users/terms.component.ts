import { Component, OnInit } from '@angular/core';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { SharedService } from './../../shared.service';


declare var $: any;
declare var jQuery: any;

declare var NProgress: any;


@Component({
  selector: 'app-users',
  templateUrl: './terms.component.html',
  styles: []
})

export class TermsComponent implements OnInit
{
  public form: FormGroup;
  rdata = [];
  storeData = [];
  rstatus = '';
  error_message = '';
  is_success = false;
  success_message = '';
  is_error = false;
  subscription: Subscription;
  appData = [];

  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private fb: FormBuilder, private router: Router,private sharedService: SharedService)
  {
    
  }

  ngOnInit() {

    
    $(function() {
      // Show/Hide Password
      

    });

  }
  
}
