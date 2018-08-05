import {
    Component, OnInit, EventEmitter, Input, Output,
    ViewChild, ElementRef, OnDestroy, ChangeDetectorRef, AfterViewChecked
} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { MessageService } from './../../../message.service';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;


interface TypeMenuFormImages {
    media_type: number,
    fileName: string,
    filePathOriginal?: string,
    filePathThumb?: string,
    is_delete?: boolean,
    is_update?: {
        file: File
    },
    is_new?: {
        file: File
    }
}
interface TypeMenuForm {
    show_tutorial: string,

    css_string_json: Array<{}>,
    menuTypeTutorialImages
    : Array<TypeMenuFormImages>,

    tutorial_add_more_fields: [
        {
            video_url: string,
            display_order: number | string
        }
    ]
}
interface DynamicMenuForm {

    video_url: string,
    display_order: number | string,
}

@Component({
    selector: 'app-menu-type-tutorial',
    templateUrl: './menu-type-tutorial.component.html',
    styleUrls: []
})

export class MenuTypeTutorialComponent implements OnInit, OnDestroy, AfterViewChecked {


    @Input('menuTypeSubTutorialCssJsonData') menuSubCssJsonData: any;
    @Input('menuTypeTutorialSlugId') menuTypeMenuSlugId: any;

    @Output('childTutorialFormData') tutorialFormOutgoingData = new EventEmitter<any>();

    @ViewChild('AddTutorialScreen') AddTutorialScreenRef: ElementRef;

    public menuTypeTutorialform: FormGroup;
    public typeMenuform: TypeMenuForm;


    private dirtyFormBool: boolean;

    fileList: FileList;

    simpleArr = [];
    is_file = false;
    rdata: any;
    rstatus: any;
    fontcl: any;
    closecl: any;

    subMenuCssJsonData: any;

    subMenuAlignmentArray = [
        {
            'name': 'Right',
            'value': 'right',
            'key': 1
        },
        {
            'name': 'Left',
            'value': 'left',
            'key': 2
        },
        {
            'name': 'Center',
            'value': 'center',
            'key': 3
        }
    ];

    subMenuBorderStyleArray = [
        {
            'name': 'Solid',
            'value': 'solid',
            'key': 1
        },
        {
            'name': 'Double',
            'value': 'double',
            'key': 2
        },
        {
            'name': 'Dotted',
            'value': 'dotted',
            'key': 3
        },
        {
            'name': 'Dashed',
            'value': 'dashed',
            'key': 4
        },
        {
            'name': 'Groove',
            'value': 'groove',
            'key': 5
        },
        {
            'name': 'Ridge',
            'value': 'ridge',
            'key': 6
        }
    ];

    subMenuPositionTypeArray = [
        {
            'name': 'Absolute',
            'value': 'absolute',
            'key': 1
        },
        {
            'name': 'Relative',
            'value': 'relative',
            'key': 2
        },
        {
            'name': 'Static',
            'value': 'static',
            'key': 3
        },
        {
            'name': 'Fixed',
            'value': 'fixed',
            'key': 4
        },
        {
            'name': 'Sticky',
            'value': 'sticky',
            'key': 5
        }
    ]

    getMenuTypeSubCssData: any;

    subMenuTypeCollapsed: any;
    min: number;
    max: number;
    formHtmlAarry = [];
    mediaTypes: Array<{ key: string, value: number }>;

    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    tutorialAddedArray: any;
    subMenuFontTypeData: any;
    handleTimer: any;
    isImageLoaded: Boolean;
    setDefaultImage: string;

    constructor(private cpService: ColorPickerService,
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private ref: ChangeDetectorRef,
        private msgMenuCssJson: MessageService) {
        this.subMenuTypeCollapsed = '';
        this.tutorialAddedArray = 0;
        this.max = 10;
        this.min = 1;
        this.handleTimer = Observable.timer(1000);
        this.mediaTypes = [{
            key: 'Image',
            value: 1
        }, {
            key: 'Video',
            value: 2
        }];


    }

    ngOnInit() {
        const title = '';
        const is_file = false;
        const file_upload = null;
        const self = this;
        this.setDefaultImage = 'http://cmsbackend.theappcompany.com/upload/appicon/thumb/default.png';
        this.subMenuFontTypeData = this.commonService.fontFamilyType;
        // $(function () {
        //     $('.dropify').dropify();
        // });

        this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
            this.cssJsonSubRes = res.data;
            this.todoAfterCssJson();
        });

        // this.min = this.typeMenuform.tutorial_add_more_fields.length;
        // this.min = this.cssJsonSubRes.tutorial_add_more_fields.length;

        // move code to todoAfterCssJson
    }

    ngAfterViewChecked(): void {
        this.ref.detectChanges();
    }

    ngOnDestroy(): void {
        this.msgMenuJsonSubscrption.unsubscribe();
    }

    dropifyInit(i: number, setDefaultImage: string): void {
        $('[data-toggle=tooltip]').tooltip();
        const drEventML = $('#file_upload_' + i).dropify({
            defaultFile: setDefaultImage
        });
        const id_dropify_img = '#dropify_' + i + ' .dropify-render>img';
        // console.log('file_upload_' + i, drEventML);
        $(id_dropify_img).attr('src', setDefaultImage);
        drEventML.on('dropify.beforeClear', (event, element) => {
            this.removeFileChange(event);
        });
        this.isImageLoaded = true;
        // console.log('increment_cpunter', this.min);
    }

    todoAfterCssJson(): void {
        if (this.cssJsonSubRes && this.cssJsonSubRes.hasOwnProperty('tutorial_add_more_fields')) {
            if (this.formHtmlAarry && this.formHtmlAarry.length > 0) {
                for (let i = this.formHtmlAarry.length; i > 0; i--) {
                    this.formHtmlAarry.pop();
                }
            }
            this.typeMenuform = this.cssJsonSubRes;
            this.tutorialAddedArray = this.cssJsonSubRes.tutorial_add_more_fields.length;
            if (this.formHtmlAarry.length === 0) {
                for (let i = 0; i < this.tutorialAddedArray; i++) {
                    this.formHtmlAarry.push(i + 1);
                    // $('#file_upload_'+i).dropify();

                    this.handleTimer.subscribe(() => {
                        if (this.typeMenuform.hasOwnProperty('menuTypeTutorialImages')
                            && typeof (this.typeMenuform.menuTypeTutorialImages[i]) !== 'undefined') {
                            this.dropifyInit(i + 1, this.typeMenuform.menuTypeTutorialImages[i].filePathThumb);

                        } else {
                            this.dropifyInit(i + 1, this.setDefaultImage);

                        }
                        if (this.typeMenuform.tutorial_add_more_fields[i].video_url === '') {
                            this.typeMenuform.menuTypeTutorialImages[i].media_type = 1;
                        } else {
                            this.typeMenuform.menuTypeTutorialImages[i].media_type = 2;
                        }

                        this.min++;
                    })
                }
            }
            this.notifyParent();
        } else {
            // console.log('nothing');
        }
    }

    get getMenuTypeMenuSlugId(): any {
        return this.menuTypeMenuSlugId;
    }

    addFormHtml() {
        // console.log(this.min, this.max);
        if (this.min <= this.max) {
            if (this.min > 0) {
                const testArray: DynamicMenuForm = {
                    video_url: '',
                    display_order: (this.formHtmlAarry.length + 1).toString()
                };

                this.typeMenuform.tutorial_add_more_fields.push(testArray);
                this.typeMenuform.menuTypeTutorialImages.push({ media_type: 2, fileName: 'null' });
                // console.log(this.typeMenuform);
            }
            //  const self = this;
            const setDefaultImage = 'http://cmsbackend.theappcompany.com/upload/appicon/original/default.png';

            this.formHtmlAarry.push(this.min);
            this.isImageLoaded = false;
            //  $('#file_upload_' + self.min).dropify();
            // let drEventML = $('#file_upload_' + self.min).dropify({
            //     defaultFile: setDefaultImage
            // });
            // drEventML.on('dropify.beforeClear', function (event, element) {
            //     // console.log('appy');
            //     self.removeFileChange(event);
            // });
            this.handleTimer.subscribe(() => {

                this.dropifyInit((this.formHtmlAarry.length), setDefaultImage);
                this.notifyParent();
                this.min++;
            })
        }
    }

    removeHtmlForm(i: any) {
        this.formHtmlAarry.splice(i, 1);
        this.typeMenuform.tutorial_add_more_fields.splice(i, 1);
        this.typeMenuform.menuTypeTutorialImages.splice(i, 1);
        this.simpleArr.splice(i, 1);

        // console.log(this.typeMenuform, '<---after remove');
        // console.log(this.formHtmlAarry);
        for (let k = 0; k < this.formHtmlAarry.length; k++) {

            this.typeMenuform.tutorial_add_more_fields[k].display_order = (k + 1).toString();
        }
        // console.log(this.typeMenuform.tutorial_add_more_fields);
        this.min--;
        this.notifyParent();

    }

    callEmit(subFormData: FormData) {
        this.tutorialFormOutgoingData.emit(subFormData);
    }
    notifyParent(): void {
        const subFormData: FormData = new FormData();
        // if (this.fileList != null && this.simpleArr.length > 0) {
        const jsonObj = {};
        if (this.typeMenuform.menuTypeTutorialImages &&
            this.typeMenuform.menuTypeTutorialImages.length) {
            for (let k = 0; k < this.typeMenuform.menuTypeTutorialImages.length; k++) {

                if (this.typeMenuform.menuTypeTutorialImages[k] && this.typeMenuform.menuTypeTutorialImages[k].hasOwnProperty('is_new')) {
                    subFormData.append('tutorialImage_' + k, this.typeMenuform.menuTypeTutorialImages[k].is_new.file);
                    jsonObj['tutorialImage_' + k] = { status: 'change' };
                } else {
                    if (this.typeMenuform.menuTypeTutorialImages[k].fileName === 'null') {
                        // subFormData.append('tutorialImage_' + k, this.typeMenuform.menuTypeTutorialImages[k].fileName);
                        jsonObj['tutorialImage_' + k] = { status: this.typeMenuform.menuTypeTutorialImages[k].fileName };
                    } else {
                        // subFormData.append('tutorialImage_' + k, 'nochange');
                        jsonObj['tutorialImage_' + k] = {
                            status: 'nochange',
                            fileName: this.typeMenuform.menuTypeTutorialImages[k].fileName
                        };
                    }

                }
            }
        }

        // }
        subFormData.append('tutorialImage', JSON.stringify(jsonObj));
        subFormData.append('show_tutorial', this.typeMenuform.show_tutorial);
        subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        subFormData.append('tutorial_add_more_fields', JSON.stringify(this.typeMenuform.tutorial_add_more_fields));
        this.callEmit(subFormData);

    }

    subMenuCollapseOpen(menuTypeMenuSlugId) {
        if (this.subMenuTypeCollapsed !== menuTypeMenuSlugId) {
            const self = this;
            swal({
                title: 'Are You Sure?',
                text: 'Changing Advanced Options without technical knowledge could lead to an undesired appearance',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn-success',
                confirmButtonText: 'Accept',
                cancelButtonText: 'Cancel',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                (isConfirm) => {
                    if (isConfirm) {
                        this.subMenuTypeCollapsed = menuTypeMenuSlugId;
                        swal({
                            title: 'Successfully',
                            text: 'Advanced Options open',
                            type: 'success',
                            confirmButtonClass: 'btn-success'
                        });
                    } else {
                        this.subMenuTypeCollapsed = '';
                        swal({
                            title: 'Cancelled',
                            text: 'Not Open Advanced Options',
                            type: 'error',
                            confirmButtonClass: 'btn-danger'
                        });
                    }
                });
        }
    }

    onChangeclosebtncolor(color: string): any {
        this.closecl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    onChangeBottomFontcolor(color: string): any {
        this.fontcl = this.cpService.outputFormat(this.cpService.stringToHsva(color, true), 'hex', null);
        this.msgMenuCssJson.setdirtyChildActive(true);
    }

    public sendMenuTypeTutorialFormData(data: any, i: any, colorPikerKey: any, childForm: NgForm) {

        if (childForm.dirty) {
            this.dirtyFormBool = childForm.dirty;
            this.msgMenuCssJson.setdirtyChildActive(this.dirtyFormBool);
            //  console.log(childForm, this.dirtyFormBool);
        }
        if (colorPikerKey !== null && colorPikerKey === 'backgroundColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.closecl;
        }

        if (colorPikerKey !== null && colorPikerKey === 'bottomFontColor') {
            this.typeMenuform.css_string_json[i]['value'] = this.fontcl;
        }

        // const subFormData: FormData = new FormData();
        if (this.fileList != null && this.simpleArr.length > 0) {
            // let file: File = this.fileList[0];
            // let file: File = JSON.stringify(this.simpleArr);
            // subFormData.append('tutorialImage', JSON.stringify(this.simpleArr));
            // console.log('simpleArr', this.simpleArr, this.typeMenuform.menuTypeTutorialImages);
            for (let k = 0; k < this.simpleArr.length; k++) {
                // subFormData.append('tutorialImage[]', this.simpleArr[k]);
                if (this.simpleArr.hasOwnProperty(k)) {
                    this.typeMenuform.menuTypeTutorialImages[k].is_new = {
                        file: this.simpleArr[k]
                    }
                }

                // console.log(this.simpleArr[k]);
            }
        }
        this.notifyParent();

        // console.log(subFormData.getAll('tutorialImage[]'));
        // subFormData.append('show_tutorial', this.typeMenuform.show_tutorial);
        // subFormData.append('css_string_json', JSON.stringify(this.typeMenuform.css_string_json));
        // subFormData.append('tutorial_add_more_fields', JSON.stringify(this.typeMenuform.tutorial_add_more_fields));

        // this.tutorialFormOutgoingData.emit(subFormData);
    }

    fileUploadFileChange(event, i) {
        this.fileList = event.target.files;
        this.simpleArr[i] = event.target.files[0];
        this.msgMenuCssJson.setdirtyChildActive(true);
        // console.log('inside fileUplaodFileChange---', i);
    }
    removeFileChange(event) {
        // alert('dsds');
        this.fileList = event.target.files;
        this.is_file = true;
    }
    changeMedia(i: number, value: number): void {
        if (value === 1) {
            this.typeMenuform.tutorial_add_more_fields[i].video_url = '';
        }

    }

}

