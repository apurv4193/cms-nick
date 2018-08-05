import { Pipe, PipeTransform } from '@angular/core';
import { ColorPickerService } from 'ngx-color-picker';

@Pipe({
  name: 'rgbaToHex'
})
export class RgbaToHexPipe implements PipeTransform {

  constructor(private cps: ColorPickerService) { }

  transform(value: any, args?: any): any {

    value = value.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (value && value.length === 4) ? '#' +
      ('0' + parseInt(value[1], 10).toString(16)).slice(-2) +
      ('0' + parseInt(value[2], 10).toString(16)).slice(-2) +
      ('0' + parseInt(value[3], 10).toString(16)).slice(-2) : '';
  }

}
