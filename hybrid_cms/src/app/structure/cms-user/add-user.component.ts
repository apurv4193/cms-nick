import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;

function matchCorrectPass() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /(?=.*\d)(?=.*)(?=.*[A-Z]).*/.test(input.value) ? null : {
      matchCorrectPass: {
        valid: false
      }
    };
  }
}

const password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), matchCorrectPass()]));
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styles: []
})
export class AddUserComponent implements OnInit {
  public form: FormGroup;
  @ViewChild('saveUserData') saveUserDataRef : ElementRef; 
  

  rdata = [];
  success_message = '';
  is_success = false;
  is_error = false;
  error_message = '';
  rstatus = '';
  appMyData = [];

  rdataapp = [];
  editId = '';
  saveAppData: {};
  statusArray = [
    {
      'name': 'Active',
      'key': 1
    },
    {
      'name': 'Inactive',
      'key': 2
    }
  ];

  constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute) {
    this.commonService.isAuthorizedRoute();
    $('.selectpicker').selectpicker();
    this.commonService.getData('getallapp').subscribe(res => {
      this.rdataapp = JSON.parse(res);
      this.appMyData = this.rdataapp['data'];
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 150);

    });
  }

  ngOnInit() {
    $(function () {
      // $('.password').password({
      //   eyeClass: '',
      //   eyeOpenClass: 'icmn-eye',
      //   eyeCloseClass: 'icmn-eye-blocked'
      // });

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 500);
    });

    this.form = this.fb.group({
      first_name: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')])],
      last_name: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: password,
      cnf_password: confirmPassword,
      status: [1, Validators.compose([Validators.required])],
      app_basic_id: ''
    });


  }
  onSubmit(form: NgForm) {
    NProgress.start();

    this.saveUserDataRef.nativeElement.disabled = true;
    if (form.value.app_basic_id == null)
    {
      form.value.app_basic_id = [];
    }
    // console.log(form.value);
    this.commonService.postData(form.value, 'addUser').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        NProgress.done();
        this.is_success = true;
        this.is_error = false;
        form.resetForm();
        this.success_message = this.rdata['message'];
        this.commonService.storeMessage(this.success_message);
        this.router.navigate(['/users']);
        this.saveUserDataRef.nativeElement.disabled = false;
      } else
      {
        NProgress.done();
        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
        this.saveUserDataRef.nativeElement.disabled = false;
      }

    },
      error => {
        NProgress.done();
        this.rdata = JSON.parse(error._body);
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];
        const error_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
        this.saveUserDataRef.nativeElement.disabled = false;
      }

    );

  }

}
