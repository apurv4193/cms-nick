import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { ColorPickerService, Rgba } from 'ngx-color-picker';

// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './../../../message.service';

import { BrowserModule, DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;


@Component({
    selector: 'app-menu-recu-tree-view',
    templateUrl: './menu-recu-tree-view.component.html'
})

export class MenuRecuTreeViewComponent implements OnInit {

    @Input('recursiveTreeview') recursiveTreeViewData: any;

    @Output('editMenuDetails') sendEditMenuOutgoingData = new EventEmitter<any>();
    @Output('removeMenu') sendRemoveMenuOutgoingData = new EventEmitter<any>();
    @Output('setIsParent') sendSetIsParentOutgoingData = new EventEmitter<any>();

    // declare subscription
    menuListJsonSubscrption: Subscription;
    recursiveTreeMenuViewData :any

    constructor(private cpService: ColorPickerService,
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private sanitizer: DomSanitizer,
        private menuListJson: MessageService)
    {
    }

    ngOnInit() {
        // this.menuListJsonSubscrption = this.menuListJson.getMenuListData().subscribe( res => {
        //     this.recursiveTreeMenuViewData = res.data;
        // });

        // setTimeout(() => {
        //     $("div.full_d3_content_click").click(function () {
        //         $("html, body").animate({ scrollTop: 0 }, 600);
        //     });
        // }, 500);
    }

    public sendEditMenuDetails(data: any) {

        this.sendEditMenuOutgoingData.emit(data);
    }

    public sendRemoveMenu(data: any) {
        this.sendRemoveMenuOutgoingData.emit(data);
    }

    public sendSetIsParent(data: any) {
        this.sendSetIsParentOutgoingData.emit(data);
    }
}



