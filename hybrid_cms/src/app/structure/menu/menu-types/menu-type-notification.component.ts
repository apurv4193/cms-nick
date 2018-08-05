import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './../../../message.service';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
    selector: 'app-menu-type-notification',
    templateUrl: './menu-type-notification.component.html',
    styleUrls: []
})
export class MenuTypeNotificationComponent implements OnInit, OnDestroy {
    public menuTypeNotificationform: FormGroup;

    @Input('menuTypeSubNotificationCssJsonData') menuSubCssJsonData: any;

    @Output('childNotificationFormData') notificationOutgoingData = new EventEmitter<any>();

    @Input('menuTypeNotificationSlugId') menuTypeMenuSlugId: any;

    public typeMenuform = {
        notification_text_fields: [
            {
                add_text_field: ''
            }
        ],
        css_string_json: ''
    };
    private dirtyFormBool: boolean;

    fileList: FileList;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    bordercl: any;
    fontcl: any;
    getMenuTypeSubCssData: any;

    subMenuFontTypeArray = [
        {
            "name": "Arial",
            "key": 1
        },
        {
            "name": "Times new roman",
            "key": 2
        },
        {
            "name": "Helvetica",
            "key": 3
        },
        {
            "name": "Oswald",
            "key": 4
        },
        {
            "name": "Machine regular",
            "key": 5
        },
        {
            "name": "Ui displayblack",
            "key": 6
        }
    ];

    subMenuAlignmentArray = [
        {
            "name": "Right",
            "value": "right",
            "key": 1
        },
        {
            "name": "Left",
            "value": "left",
            "key": 2
        },
        {
            "name": "Center",
            "value": "center",
            "key": 3
        }
    ];

    subMenuBorderStyleArray = [
        {
            "name": "Solid",
            "value": "solid",
            "key": 1
        },
        {
            "name": "Double",
            "value": "double",
            "key": 2
        },
        {
            "name": "Dotted",
            "value": "dotted",
            "key": 3
        },
        {
            "name": "Dashed",
            "value": "dashed",
            "key": 4
        },
        {
            "name": "Groove",
            "value": "groove",
            "key": 5
        },
        {
            "name": "Ridge",
            "value": "ridge",
            "key": 6
        }
    ];

    subMenuTypeCollapsed: '';
    min: any;
    max: any;
    notificationFormHtmlAarry = [];

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    notificationAddedArray: any;
    subMenuFontTypeData: any;

    constructor(private cpService: ColorPickerService,
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private msgMenuCssJson: MessageService) {
        this.max = 10;
        this.subMenuTypeCollapsed = '';
        this.notificationAddedArray = 0;
    }

    ngOnInit() {
        this.subMenuFontTypeData = this.commonService.fontFamilyType;
        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });


    }

    ngOnDestroy(): void {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void {
        if (this.cssJsonSubRes && this.cssJsonSubRes.hasOwnProperty('notification_text_fields')) {
            if (this.notificationFormHtmlAarry && this.notificationFormHtmlAarry.length > 0) {
                for (let i = this.notificationFormHtmlAarry.length; i > 0; i--) {
                    this.notificationFormHtmlAarry.pop();
                }
            }
            this.typeMenuform = this.cssJsonSubRes;

            this.min = this.typeMenuform.notification_text_fields.length;
            this.notificationAddedArray = this.cssJsonSubRes.notification_text_fields.length;

            if (this.notificationFormHtmlAarry.length == 0) {
                for (let i = 0; i < this.notificationAddedArray; i++) {
                    this.notificationFormHtmlAarry.push(i);
                }
            }

            let subFormData: FormData = new FormData();
            subFormData.append('notification_text_fields', JSON.stringify(this.typeMenuform.notification_text_fields));
            subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

            this.notificationOutgoingData.emit(subFormData);
        } else {
            // console.log('nothing');
        }
    }

    get getMenuTypeMenuSlugId(): any {
        return this.menuTypeMenuSlugId;
    }

    addFormHtml() {
        if (this.min <= this.max) {
            if (this.min > 0) {
                let testArray = {
                    add_text_field: ''
                };
                this.typeMenuform.notification_text_fields.push(testArray);
            }
            this.notificationFormHtmlAarry.push(this.min);
            this.min++;
        }
    }

    removeHtmlForm(i: any) {
        this.notificationFormHtmlAarry.splice(i, 1);
        this.typeMenuform.notification_text_fields.splice(i, 1);
        this.min--;
    }

    subMenuCollapseOpen(menuTypeMenuSlugId) {
        if (this.subMenuTypeCollapsed !== menuTypeMenuSlugId) {
            var self = this;
            swal({
                title: "Are You Sure?",
                text: "Changing Advanced Options without technical knowledge could lead to an undesired appearance",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Accept",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                (isConfirm) => {
                    if (isConfirm) {
                        this.subMenuTypeCollapsed = menuTypeMenuSlugId;
                        swal({
                            title: "Successfully",
                            text: "Advanced Options open",
                            type: "success",
                            confirmButtonClass: "btn-success"
                        });
                    } else {
                        this.subMenuTypeCollapsed = '';
                        swal({
                            title: "Cancelled",
                            text: "Not Open Advanced Options",
                            type: "error",
                            confirmButtonClass: "btn-danger"
                        });
                    }
                });
        }
    }

    onChangefontcolor(color: string): any {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangeBorderColor(color: string): any {
        this.bordercl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    public sendMenuTypeNotificationData(data: any, i: any, colorPikerKey: any, childForm: NgForm) {
        if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey == 'borderColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.bordercl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'fontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }
        // console.log(this.typeMenuform);

        let subFormData: FormData = new FormData();

        subFormData.append('notification_text_fields', JSON.stringify(this.typeMenuform.notification_text_fields));
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.notificationOutgoingData.emit(subFormData);
    }

}
