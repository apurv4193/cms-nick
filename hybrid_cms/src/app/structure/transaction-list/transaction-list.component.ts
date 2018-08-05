import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as moment from 'moment';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { Observable } from 'rxjs/Observable';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { concat } from 'rxjs/operators/concat';


interface TransactionRes {
  email: string,
  first_name: string,
  last_name: string,
  st_amount: number,
  st_created: Date
  st_id: string,
  st_status: string
}

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;
// declare var moment: any;

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TransactionListComponent implements OnInit, AfterViewInit {

  rdata: Array<TransactionRes>;
  public daterange: any = {};
  public singleDate: any;
  handleTimer: Observable<any>;

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  // public options: any = {
  //   locale: { format: 'MM-DD-YYYY' },
  //   alwaysShowCalendars: false,
  // };
  defaultStart = moment().startOf('year').format('MM/DD/YYYY');
  defaultEnd = moment().format('MM/DD/YYYY');

  constructor(private daterangepickerOptions: DaterangepickerConfig,
    private commonService: CommonService) {

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

    // .datePicker.setStartDate('2017-03-01');
    // this.picker.datePicker.setEndDate('2017-04-01');
    // this.singleDate = Date.now();
    this.handleTimer = Observable.timer(1000);

  }
  ngOnInit() {
    // load API to retrive stripe transaction
    this.loadAllTrans();
  }
  // handler after view init
  ngAfterViewInit(): void {

    // this.picker.datePicker.setStartDate(defaultStart);
    // this.picker.datePicker.setEndDate(defaultEnd);

    // pop out filter data if exist
    if ($.fn.dataTableExt.afnFiltering instanceof Array && $.fn.dataTableExt.afnFiltering.length > 0) {
      $.fn.dataTableExt.afnFiltering.pop();
    }

  }

  private dtTransInit(): void {
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

    this.handleTimer.subscribe(() => {
      $('#TransactionDatatable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        order: [[0, 'desc']],
        buttons: [
          $.extend(true, {}, buttonCommon, {
            extend: 'excel',
            text: '<i class="icmn-file-text2"></i>  Generate Report',
            title: 'Transaction Details',
            className: 'btn btn-md btn-excel',
          })
        ]
      });
      this.handleTimer.subscribe(() => {
        const initDateSelection = {
          start: moment(this.defaultStart, 'MM-DD-YYYY'),
          end: moment(this.defaultEnd, 'MM-DD-YYYY')
        }
        this.selectedDate(initDateSelection, this.daterange);
      })

    });

  }


  private loadAllTrans(): void {
    this.handleTimer.subscribe(() => {
      NProgress.start();
    })

    this.commonService.getData('getTransactionData').subscribe(res => {
      res = JSON.parse(res);
      if (res.status === 1 && res.data) {
        NProgress.done();
        res.data.forEach((d) => {
          // d.st_created = new Date(d.st_created);
          // d.st_created = moment.tz(d.st_created, 'America/Los_Angeles');
          // if (d.is_refer === '0') {
          //   d.is_refer = 'No';
          // } else {
          //   d.is_refer = 'Yes';
          // }
          d.st_amount = '$' + d.st_amount / 100;
        });
        this.rdata = res.data;
        this.handleTimer.subscribe(() => {
          NProgress.done();
        })
        // console.log(this.rdata);

      } else {
        this.rdata = [];
        this.handleTimer.subscribe(() => {
          NProgress.done();
        })
      }
      // call dt init
      this.dtTransInit();
      // console.log(this.rdata);
    });

  }
  /**
   * Method datepicker
   * @param value any
   * @param datepicker any
   */
  public selectedDate(value: any, datepicker?: any) {
    // custom date user selection input

    $('#TransactionDatatable').dataTable().fnPageChange('first', 1);
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
        const iStartDateCol = 8;
        const iEndDateCol = 8;
        // console.log('value start', value.start.endOf('day'), 'value end', value.end);
        // const sd = value.start.toString().substring(4, 15);
        //  const ed = value.end.toString().substring(4, 15);
        // const sd = value.start.startOf('day')._d;
        // const ed = value.end.endOf('day')._d;

        const sd = value.start;
        const ed = value.end;
        const dbSdDate = aData[iStartDateCol];
        //  console.log('before--->>>', dbSdDate, sd, ed);

        // var tomorrow = new Date();
        // tomorrow.setDate(tomorrow.getDate() + 1);

        const checkDate = moment(dbSdDate, 'MM-DD-YYYY');
        // console.log('after--->>>', checkDate, moment(sd, 'MM-DD-YYYY'), moment(ed, 'MM-DD-YYYY'));
        const inRange = checkDate >= sd && checkDate <= ed;
        // console.log('inrange', inRange);
        return inRange;
      }
    );
    $('#TransactionDatatable').dataTable().fnDraw();
    // $('#TransactionDatatable').dataTable().fnDestroy();
    $('#TransactionDatatable').dataTable()

  }

}
