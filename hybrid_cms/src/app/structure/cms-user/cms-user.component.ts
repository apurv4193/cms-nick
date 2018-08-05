import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any

@Component({
  selector: 'app-cms-user',
  templateUrl: './cms-user.component.html',
  styles: []
})
export class CmsUserComponent implements OnInit {
  public form = {
    'value': {
      'id': ''
    }
  };

  rdata = [];
  appUserAssignData = [];
  usersData = '';
  is_error = false;
  error_message = '';
  success_message = '';
  is_success = false;
  handleTimer: Observable<any>;

  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router) {

    this.handleTimer = Observable.timer(1000);
  }

  initDatatable(): void {
    const handleDelay = Observable.timer(800)
    handleDelay.subscribe(() => {
      $('#usersTemplateDatatable').DataTable({ responsive: true });
    })
  }


  ngOnInit() {
    this.commonService.isAuthorizedRoute();
    $(function () {
      // Handle error message
      $(document).on('click', '.alert-close', function () {
        $('.alert-close').hide();
      });
    });

    if (this.commonService.isMessage()) {
      const success_message = this.commonService.getMessage();
      $(function () {
        $.notify({
          title: '',
          message: success_message
        }, {
            type: 'success'
          });
      });
      this.commonService.removeMessage();
    }
    this.handleTimer.subscribe(() => {
      NProgress.start();
    })
    this.commonService.getData('fetchAllCMSUsersData').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.usersData = this.rdata['data'];
      // console.log(this.usersData);
      this.handleTimer.subscribe(() => {
        NProgress.done();
      });
      this.initDatatable();

    },
      error => {
        this.rdata = JSON.parse(error._body);
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];
        this.handleTimer.subscribe(() => {
          NProgress.done();
        });
      }
    );

  }

  deleteUser(id) {
    this.form.value.id = id;
    const self = this;

    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this record",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      closeOnConfirm: false,
      closeOnCancel: true
    },
      function (isConfirm) {
        if (isConfirm) {
          self.deleteUserData(id);
          swal({
            title: "Deleted!",
            text: "Your record has been deleted.",
            type: "success",
            confirmButtonClass: "btn-success"
          });
        } else {
          swal({
            title: "Cancelled",
            text: "Your record is safe :)",
            type: "error",
            confirmButtonClass: "btn-danger"
          });
        }
      });
  }

  deleteUserData(id) {
    this.form.value.id = id;
    this.commonService.postData(this.form.value, 'deleteUser').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.usersData = this.rdata['data'];
      this.is_success = true;
      this.is_error = false;
      const table = $('#usersTemplateDatatable').DataTable();
      table.destroy();
      setTimeout(() => {
        $('#usersTemplateDatatable').DataTable({
          responsive: true
        });
      }, 1000);
      this.success_message = this.rdata['message'];
    },
      error => {
        this.rdata = JSON.parse(error._body);
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];
      }
    );
  }

}
