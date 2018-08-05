import { Component, OnInit, ContentChild, Input } from '@angular/core';

@Component({
  selector: 'app-show-hide-container',
  templateUrl: './show-hide-container.component.html',
  styleUrls: ['./show-hide-container.component.css']
})
export class ShowHideContainerComponent implements OnInit {

  show = false;

  @ContentChild('showhideinput') input;

  @Input() input_group_show: boolean;


  constructor() { }

  ngOnInit() {
  }
  toggleShow() {
    this.show = !this.show;
    if (this.show) {
      this.input.nativeElement.type = 'text';
    } else {
      this.input.nativeElement.type = 'password';
    }
  }

}
