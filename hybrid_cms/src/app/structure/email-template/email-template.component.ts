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
declare var NProgress: any;

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: []
})

export class EmailTemplateComponent implements OnInit {

  public form = {
    'value': {
      'id': ''
    }
  };
  emailTemaplateData = '';
  rdata = [];
  is_error = false;
  error_message = '';
  success_message = '';
  is_success = false;
  id = '';
  handleTimer: Observable<any>;

  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router) {
    this.commonService.isAuthorizedRoute();
    // init observable timer
    this.handleTimer = Observable.timer(1000);
    // var test = this.router.navigate(['/product-details', id]);
  }

  initDatatable(): void {
    const handleDelay = Observable.timer(800)
    handleDelay.subscribe(() => {
      $('#emailTemplateDatatable').DataTable({ responsive: true });
    })
  }

  ngOnInit() {
    $(function () {
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
    // fetch all templates
    this.fetchAllEmailTemplates();


  }
  /**
   * Fetch all EMAIL Templates API
   */
  fetchAllEmailTemplates(): void {
    this.handleTimer.subscribe(() => {
      NProgress.start();
    })
    this.commonService.getData('fetchAllEmailTemplate').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.emailTemaplateData = this.rdata['data'];
      this.handleTimer.subscribe(() => {
        NProgress.done();
      })
      this.initDatatable();

    }, error => {
      this.rdata = JSON.parse(error._body);
      this.is_error = true;
      this.is_success = false;
      this.error_message = this.rdata['message'];
    }
    );
  }

  deleteEmailtemp(id) {
    this.form.value.id = id;
    var self = this;

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
          self.deleteTemplateData(id);
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

  deleteTemplateData(id) {
    this.form.value.id = id;
    this.commonService.postData(this.form.value, 'deleteEmailTemplate').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.emailTemaplateData = this.rdata['data'];
      this.is_success = true;
      this.is_error = false;
      const table = $('#emailTemplateDatatable').DataTable();
      table.destroy();
      setTimeout(() => {
        $('#emailTemplateDatatable').DataTable({
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

