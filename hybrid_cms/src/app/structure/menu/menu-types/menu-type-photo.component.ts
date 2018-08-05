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
    selector: 'app-menu-type-photo',
    templateUrl: './menu-type-photo.component.html',
    styleUrls: []
})

export class MenuTypePhotoComponent implements OnInit, OnDestroy {
    public menuTypePhotoform: FormGroup;

    @Input('menuTypeSubPhotoCssJsonData') menuSubCssJsonData: any;

    @Output('childPhotoFormData') photoFormOutgoingData = new EventEmitter<any>();

    @Input('menuTypePhotoSlugId') menuTypeMenuSlugId: any;

    public typeMenuform = {
        user_id: '',
        google_key: '',
        album_id: '',
        css_string_json: '',
    };
    private dirtyFormBool: boolean;

    fileList: FileList;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    borderCl: any;
    fontcl: any;
    albfontcl: any;
    cpfontcl: any;
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
            "value":"right",
            "key": 1
        },
        {
            "name": "Left",
            "value":"left",
            "key": 2
        },
        {
            "name": "Center",
            "value":"center",
            "key": 3
        }
    ];

    subMenuBorderStyleArray = [
        {
            "name": "Solid",
            "value":"solid",
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

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    subMenuFontTypeData: any;

    constructor(private cpService: ColorPickerService, private commonService: CommonService, private fb: FormBuilder, private http: Http, private sharedService: SharedService, private msgMenuCssJson: MessageService) {
        this.subMenuTypeCollapsed = '';
    }

    ngOnInit() {
        this.subMenuFontTypeData = this.commonService.fontFamilyType;
        let cssObj = {
            'cssComponent': 'picasa_album_menu_css'
        };

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        let subFormData: FormData = new FormData();

        subFormData.append('google_key', this.typeMenuform.google_key);
        subFormData.append('album_id', this.typeMenuform.album_id);
        subFormData.append('user_id', this.typeMenuform.user_id);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        this.photoFormOutgoingData.emit(subFormData);
    }

    ngOnDestroy(): void {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void {
        if (this.cssJsonSubRes) {
            this.typeMenuform = this.cssJsonSubRes;
        }
        else {
            // console.log('nothing');
        }
    }

    get getMenuTypeMenuSlugId(): any {
        return this.menuTypeMenuSlugId;
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

    onChangeBordercolor(color: string): any {
        this.borderCl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangefontcolor(color: string): any {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangeCaptionfontcolor(color: string): any {
        this.cpfontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }

    onChangeAlbumfontcolor(color: string): any {
        this.albfontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
    }


    public sendMenuTypePhotoFormData(data: any, i: any, colorPikerKey: any, childForm: NgForm) {
        // console.log(this.subMenuCssJsonData);
        if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey == 'borderColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.borderCl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'fontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'captionfontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.cpfontcl;
        }
        if (colorPikerKey !== null && colorPikerKey == 'albumfontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.albfontcl;
        }
        // console.log(this.typeMenuform);

        let subFormData: FormData = new FormData();

        subFormData.append('google_key', this.typeMenuform.google_key);
        subFormData.append('album_id', this.typeMenuform.album_id);
        subFormData.append('user_id', this.typeMenuform.user_id);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));

        // console.log(subFormData);
        this.photoFormOutgoingData.emit(subFormData);
    }

}
