import { Component } from '@angular/core';
import * as moment from 'moment';


declare var $: any;
declare var jQuery: any;
declare var swal: any;
// declare var moment: any;

@Component({
  selector: 'cat-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {

  constructor()
  {
    $(function () {
      // $('.in_current_year').html(new Date().getFullYear());
      $('.in_current_year').html(moment().format('YYYY'));
    });
  }

}
