import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tabMenuLmt'
})
export class TabMenuLmtPipe implements PipeTransform {
  finalDate: any;
  transform(value: any, args?: any): any {
    const a = value.length;
    if (args == '1') {
        return value;
    }
    if (args == '2') {
      if (a >= 15) {
        return value.substring(0, 17) + '...';
      } else {
        return value;
      }
    }
    if (args == '3') {
      if (a >= 13) {
        return value.substring(0, 10) + '...';
      } else {
        return value;
      }
    }
    if (args == '4') {
      if (a >= 9) {
        return value.substring(0, 6) + '...';
      } else {
        return value;
      }
    }
    if (args == '5') {
      if (a >= 7) {
        return value.substring(0, 4) + '...';
      } else {
        return value;
      }
    }

  }
}
