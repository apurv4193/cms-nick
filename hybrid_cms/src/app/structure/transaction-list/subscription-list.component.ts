import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { Observable } from 'rxjs/Observable';
import { DaterangePickerComponent, DaterangepickerConfig } from 'ng2-daterangepicker';

declare var NProgress: any;
declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var moment: any;

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  rdataSub: Array<{}>;
  daterange: any = {};
  singleDate: any;

  defaultStart = moment().startOf('year').format('MM/DD/YYYY');
  defaultEnd = moment().format('MM/DD/YYYY');

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  options: any = {
    locale: { format: 'MM-DD-YYYY' },
    alwaysShowCalendars: false,
  };

  constructor(private daterangepickerOptions: DaterangepickerConfig,
    private commonService: CommonService,
    private messageService: MessageService) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'MM-DD-YYYY' },
      alwaysShowCalendars: false,
      ranges: {
        'Yesterday': [moment().add(-1, 'days')],
        'Last Week': [moment().subtract(1, 'week')],
        'Last Month': [moment().subtract(1, 'month'), moment()]
        // 'Last 3 Months': [moment().subtract(4, 'month'), moment()],
        // 'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        // 'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      },
      startDate: this.defaultStart,
      endDate: this.defaultEnd
    };
    this.singleDate = Date.now();
    this.loadallsub();
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {

    // this.picker.datePicker.setStartDate(defaultStart);
    // this.picker.datePicker.setEndDate(Date.now());

    // pop out filter data if exist
    if ($.fn.dataTableExt.afnFiltering instanceof Array && $.fn.dataTableExt.afnFiltering.length > 0) {
      $.fn.dataTableExt.afnFiltering.pop();
    }
  }

  ngOnDestroy(): void {
    // if spinner isActive then
    // console.log('OnDestroy')
    this.messageService.setSpinnerActive(false);
  }
  /**
   * Method to init subsctiption datatable jquery
   */
  private dtSubsInit(): void {
    const buttonCommon = {
      exportOptions: {
        format: {
          body: function (data, row, column, node) {
            // console.log(data);
            return data;
          }
        }
      }
    }
    const handleDelay = Observable.timer(1000)
    handleDelay.subscribe(() => {
      $('#SubscriptionDatatable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        order: [[0, 'desc']],
        buttons: [
          $.extend(true, {}, buttonCommon, {
            extend: 'excel',
            text: '<i class="icmn-file-text2"></i>  Generate Report',
            title: 'Subscription Details',
            className: 'btn btn-md btn-excel',
          })
        ]
      });
      handleDelay.subscribe(() => {
        const initDateSelection = {
          start: moment(this.defaultStart, 'MM-DD-YYYY'),
          end: moment(this.defaultEnd, 'MM-DD-YYYY')
        }
        this.selectedDate_sub(initDateSelection, this.daterange);
      })
    })
  }
  /**
   * API Call to load all subsctiption data
   */
  private loadallsub(): void {
    if (this.commonService.subscriptionGetter() === undefined) {

      this.messageService.setSpinnerActive({
        active: true,
        text: 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.'
      })
      this.commonService.getData('getSubscriptionData').subscribe(res => {
        res = JSON.parse(res);
        // console.log(res);
        if (res.status === 1 && res.data) {
          // res.data.forEach((d) => {
          //   // d.st_created = new Date(d.st_created);
          //   // d.st_created = moment.tz(d.st_created, 'America/Los_Angeles');
          //   // if (d.is_refer === '0') {
          //   //   d.is_refer = 'No';
          //   // } else {
          //   //   d.is_refer = 'Yes';
          //   // }
          //   d.st_amount = '$' + d.st_amount / 100;
          // });
          this.rdataSub = res.data;
          this.commonService.subscrptionSetter(res.data);
          //  console.log(this.rdataSub);
        } else {
          this.rdataSub = [];
        }
        // call datatable init
        this.dtSubsInit();
        this.messageService.setSpinnerActive(false);

      });
    } else {
      // call datatable init
      this.dtSubsInit();
      this.rdataSub = this.commonService.subscriptionGetter();
    }
  }
  /**
  * Method datepicker for subscription
  * @param value any
  * @param datepicker any
  */
  public selectedDate_sub(value: any, datepicker?: any) {
    // this is the date the iser selected

    $('#SubscriptionDatatable').dataTable().fnPageChange('first', 1);
    // datepicker.start = value.start;
    // datepicker.end = value.end;

    // // or manipulate your own internal property
    // this.daterange.start = value.start;
    // this.daterange.end = value.end;
    // this.daterange.label = value.label;

    $.fn.dataTableExt.afnFiltering.pop();
    $.fn.dataTableExt.afnFiltering.push(
      (oSettings, aData, iDataIndex) => {
        // column id
        const iStartDateCol = 9;
        const iEndDateCol = 9;

        // const sd = value.start.toString().substring(4, 15);
        // const ed = value.end.toString().substring(4, 15);
        // const sd = value.start.startOf('day')._d;
        // const ed = value.end.endOf('day')._d;

        const sd = value.start;
        const ed = value.end;
        const dbSdDate = aData[iStartDateCol];
        // console.log('before--->>>', dbSdDate, sd, ed);
        // const a = new Date(sd);
        // const b = new Date(ed);
        // const a = sd;
        // const b = ed;
        const checkDate = moment(dbSdDate, 'MM-DD-YYYY');
        // console.log('after--->>>', checkDate, a, b);
        const inRange = checkDate >= sd && checkDate <= ed;
        // console.log('inrange', inRange);
        return inRange;
      }
    );
    $('#SubscriptionDatatable').dataTable().fnDraw();
    // $('#TransactionDatatable').dataTable().fnDestroy();
    $('#SubscriptionDatatable').dataTable()

  }

}
