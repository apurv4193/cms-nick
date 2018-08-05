import {
    Component, OnInit, Pipe, EventEmitter, Input, Output, ViewChild, ElementRef,
    AfterViewInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';
import { MessageService } from './../../message.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';

declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;
declare var Ladda: any;

function matchCorrectSpace() {
    // const hasExclamation = input.value !== this.o_password.value;
    return (input: FormControl) => {
        // return /^[^-\s][a-zA-Z0-9_\s-]+$/.test(input.value) ? null : {
        return /^[^-\s][a-zA-Z0-9_|\/\s-]+$/.test(input.value) ? null : {
            matchCorrectSpace: {
                valid: false
            }
        };
    }
}

@Component({
    selector: 'menu-configuration-page',
    templateUrl: './menu-configuration.component.html'
})

export class MenuConfigurationComponent implements OnInit, CanComponentDeactivate, AfterViewInit, OnDestroy {
    @ViewChild('editMenuForm') editMenuFormRef: NgForm;
    @ViewChild('addMenuSaveBtn') addMenuSaveBtnRef: ElementRef;
    @ViewChild('saveMenuDisbleBtn') saveMenuDisbleBtnRef: ElementRef;
    @ViewChild('saveMenuOrderDisableBtn') saveMenuOrderDisableBtnRef: ElementRef;

    public form: FormGroup;
    public menuForm: FormGroup;

    private snapShotCssJson: any;
    private boolChildFormDirty: boolean;
    private boolImageChangeValidDirty: boolean;
    private boolSaveDisable: boolean;
    private boolChildFormSub: Subscription;
    private saveDisable: Subscription;

    rdata: any;
    storeData = [];
    rstatus: any;
    currentAppData = [];
    app_id = '';
    menuData = [];
    is_parent = 0;
    fileList: FileList;
    is_file = false;
    is_menu_change = false;

    menu_icon_image = '';
    menuTypeData = [];
    noMenuTypeFound = true;
    menuTypeFound = false;
    noMenuFound = false;
    menuFound = false;
    menuCreateMsg = false;

    menuTypeSel = 0;
    menuTypeHtml = false;
    menuTypeHtmlForm: SafeHtml;
    menuTypeHtmlHidden = [true, true, true, true, true, true, true, true, true, true];
    menuTypeSelValue = '';

    menuTypeMenuSlugData = '';
    finalMenuArray: any;
    finalSubArray: any;
    sampleChildData: any;
    menuTypeSubCssJsonData: any;
    parentMenuData: any;
    parentMenuType: any;
    menuNotSelected: any;
    menuTypeMenuSlugId: any;

    menuLocationArray = [
        {
            'name': 'Side Menu',
            'key': 1
        },
        {
            'name': 'Tab Menu',
            'key': 2
        }
    ];

    imageMenuTitle = false;
    menuTypeIsChild: any;
    menu_icon_name: '';
    menu_font_icon: '';
    subMenuTypeCollapsed: '';
    iterableDiffers: any;
    dropifyId: any;
    drImgEvent: any;
    menuOriginalDataOnclick: any;
    image_input_img_name: any;
    menuLocationType: any;
    isTabMenuCreate = true;

    constructor(private sanitizer: DomSanitizer,
        private commonService: CommonService,
        private http: Http,
        private cssJsonService: MessageService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef) {
        this.currentAppData = this.commonService.get_current_app_data();
        this.menuLocationType = this.currentAppData['menu_location_type'];

        this.app_id = this.currentAppData['id'];
        this.subMenuTypeCollapsed = '';

        this.boolChildFormSub = this.cssJsonService.getdirtyChildActive().subscribe(d => {
            this.boolChildFormDirty = d;
            // console.log(this.boolChildFormDirty, 'Child Menu changes detect in menu configuration');
        });
        this.saveDisable = this.cssJsonService.getSaveDisable().subscribe(d => {
            this.boolSaveDisable = d;
            // console.log(this.boolChildFormDirty, 'Child Menu changes detect in menu configuration');
        });
    }

    ngOnInit() {
        $(function () {
            $('#nestable1').nestable();
            // $('.dropify').dropify();
            $('[data-toggle=tooltip]').tooltip();
        });

        $('#nestable1').nestable({
            maxDepth: 5,
        }).on('change', e => {
            if (this.is_menu_change === false) {
                this.is_menu_change = true;
                // console.log(this.is_menu_change);
            }
        });

        this.form = this.fb.group({
            menu_name: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
            menu_type: ['', Validators.compose([Validators.required])]
        });

        const imageInput = null;
        this.menuForm = this.fb.group({
            menuId: '',
            parentId: '',
            menu_text: [null, Validators.compose([Validators.required])],
            imageInput: [null, Validators.compose([Validators.required])],
            existingFile: '',
            image_url: '',
            selct_menu_type: []
        });

        if (this.form.dirty) {
            // console.log('sdffds');
        }

        this.getAppMenu();
        this.getAppMenuType();
    }

    ngAfterViewInit() {
        // console.log('nativeElement', this.cn1.nativeElement.class);
    }
    ngOnDestroy(): void {
        this.boolChildFormSub.unsubscribe();
        this.saveDisable.unsubscribe();
    }

    private onClickscrollUp(): void {
        $('[data-toggle=tooltip]').tooltip();
        $('html, body').animate({ scrollTop: 0 }, 400);
    }

    /**
     * canDeactivate Implementation
     */
    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
        if (NProgress.isStarted()) {
            NProgress.done();
        }
        // console.log(this.boolImageChangeValidDirty, '<<<Bool Image dirty');
        // no menu change
        if (!this.is_menu_change && !this.boolChildFormDirty && !this.menuForm.dirty && !this.boolImageChangeValidDirty) {
            return true;
        } else if (this.is_menu_change) {
            return new Promise<boolean>((resolve, reject) => {
                swal({
                    title: 'You didn`t save!',
                    text: 'You have unsaved changes, would you like to save?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, (isConfirm) => {
                    // if accept yes
                    if (isConfirm) {
                        this.getOrderData();
                        swal({
                            title: 'Successfully',
                            text: 'Menu Changes Saved',
                            type: 'success',
                            confirmButtonClass: 'btn-success'
                        });
                        this.is_menu_change = false;
                        setTimeout(() => {
                            resolve(true);
                        }, 1000);
                    } else {
                        resolve(true);
                    }
                });
            });
        } else if (this.boolChildFormDirty || this.menuForm.dirty || this.boolImageChangeValidDirty) {
            // if any changes made in child componenet form show alert
            return new Promise<boolean>((resolve, reject) => {
                swal({
                    title: 'You didn`t save!',
                    text: 'You have unsaved changes, would you like to save?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                    (isConfirm) => {
                        // if accept yes
                        if (isConfirm) {
                            // console.log(this.editMenuFormRef.value);
                            // save form data
                            this.onMenuFormSubmit(this.editMenuFormRef);
                            swal({
                                title: 'Successfully',
                                text: 'Data Saved Successfully',
                                type: 'success',
                                confirmButtonClass: 'btn-success'
                            });
                            setTimeout(() => {
                                resolve(true);
                            }, 1400);
                        } else {
                            resolve(true);
                        }
                    });
            });
        } else {
            return true;
        }
    }

    callToolTip() {
        return $(function () {
            $('[data-toggle=tooltip]').tooltip();
        });
    }

    getAppMenu(): void {
        // NProgress.start();
        const handlerTimestart = Observable.timer(1000);
        const handlerTimeend = Observable.timer(2000);
        handlerTimestart.subscribe(() => {
            NProgress.start();
        });
        const postData = {
            'app_basic_id': this.app_id
        }
        this.commonService.postData(postData, 'appmenudata').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if ((this.rstatus === '1' || this.rstatus === 1) && this.rdata['data'].length !== 0) {
                this.callToolTip();
                this.noMenuFound = true;
                this.menuCreateMsg = false;
                this.menuFound = false;
                this.menuData = this.rdata['data'];

                if (this.menuLocationType == '2') {
                    if (this.menuData.length < 5) {
                        this.isTabMenuCreate = true;
                    } else {
                        this.isTabMenuCreate = false;
                    }
                } else {
                    this.isTabMenuCreate = true;
                }
                this.cssJsonService.setMenuListData(this.menuData);

                handlerTimeend.subscribe(() => {
                    NProgress.done();
                });
                // NProgress.done();
            } else {
                this.noMenuFound = false;
                this.menuCreateMsg = true;
                this.callToolTip();
                this.menuFound = false;
                this.menuData = this.rdata['data'];
                const error_message = this.rdata['message'];

                handlerTimeend.subscribe(() => {
                    NProgress.done();
                });

                // NProgress.done();
                // $(function() {
                //     $.notify({
                //         title: '',
                //         message: error_message
                //     },{
                //         type: 'danger'
                //     });
                // });
            }
        });
    }

    afterSaveGetAppMenu() {
        NProgress.start();
        const postData = {
            'app_basic_id': this.app_id
        }
        this.commonService.postData(postData, 'appmenudata').subscribe(res => {
            NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus === '1' || this.rstatus === 1) {
                this.menuData = this.rdata['data'];
                this.cssJsonService.setMenuListData(this.menuData);
            }
            else {
                this.noMenuFound = false;
                this.menuCreateMsg = true;
                this.callToolTip();
                this.menuFound = false;
                const error_message = this.rdata['message'];
            }
        });
    }

    getAppMenuType() {
        NProgress.start();
        const postData = {
            'app_basic_id': this.app_id
        }
        this.commonService.postData(postData, 'allmenutypedata').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus === '1' || this.rstatus === 1) {
                NProgress.done();
                this.noMenuTypeFound = false;
                this.menuTypeFound = true;
                this.menuTypeData = this.rdata['data'];
                // console.log(this.menuTypeData);
            }
            else {
                NProgress.done();
                let error_message = this.rdata['message'];
                // $(function() {
                //     $.notify({
                //         title: '',
                //         message: error_message
                //     },{
                //         type: 'danger'
                //     });
                // });
            }
        });
    }

    setIsParent(id: any) {
        this.is_parent = id;
    }

    getOrderData() {
        NProgress.start();
        this.saveMenuOrderDisableBtnRef.nativeElement.disabled = true;
        var finalArray = [];
        var self = this;
        var orderMenuArray = [];
        var orderSubMenuArray = [];
        $(function () {
            $('#my_screen .dd3-content').each(function () {
                var menuData = $(this).data('id').split('parent');
                var menu_ide = $(this).data('ide');
                // var subData = $(this).data('id').split('child');

                // console.log(menuData);
                // console.log('MenuData');
                // console.log(subData);
                // console.log('subData');

                if (menuData.indexOf('parent')) {
                    const mainMenuData = $(this).data('id').split('parent');
                    if (mainMenuData[1] !== undefined) {
                        const menu = {
                            'menu': mainMenuData[1],
                            'ide': menu_ide
                        };
                        finalArray.push(menu);
                    }
                }
                // if (subData.indexOf('child')) {
                //     var subMenuData = $(this).data('id').split('child');
                //     if (subMenuData[1] != undefined) {
                //         var submenu = 'submenu:' + subMenuData[1];
                //         finalArray.push(submenu);
                //     }
                // }
            });
            // console.log(finalArray);
            // console.log('sdffds');
            self.changeAddScreenShotOrder(finalArray);
        });
    }

    changeAddScreenShotOrder(finalArray) {
        this.commonService.custompostData({ 'finalArray': finalArray }, 'storeOrderedMenuData').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus === 1) {
                this.saveMenuOrderDisableBtnRef.nativeElement.disabled = false;
                NProgress.done();
                // $('#createmenu').modal('toggle');
                const success_message = this.rdata['message'];
                this.getAppMenu();
                $(function () {
                    $.notify({
                        title: '',
                        message: success_message
                    }, {
                            type: 'success'
                        });
                });
            } else {
                this.saveMenuOrderDisableBtnRef.nativeElement.disabled = false;
                NProgress.done();
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    }, {
                            type: 'danger'
                        });
                });
            }
        });
    }

    onSubmit(form: NgForm) {
        this.addMenuSaveBtnRef.nativeElement.disabled = true;
        NProgress.start();
        form.value.app_basic_id = this.app_id;
        form.value.is_parent = this.is_parent;

        this.commonService.postData(form.value, 'saveappmenu').subscribe(res => {
            this.is_parent = 0;
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus === '1' || this.rstatus === 1) {
                this.addMenuSaveBtnRef.nativeElement.disabled = false;
                NProgress.done();
                form.resetForm();
                $('#createmenu').modal('toggle');
                const success_message = this.rdata['message'];
                this.getAppMenu();
                $(function () {
                    $.notify({
                        title: '',
                        message: success_message
                    }, {
                            type: 'success'
                        });
                });
            } else {
                this.addMenuSaveBtnRef.nativeElement.disabled = false;
                NProgress.done();
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    }, {
                            type: 'danger'
                        });
                });
            }
        }, err => {
            $('#createmenu').modal('toggle');
        });
    }

    appIconFileChange(event) {
        this.fileList = event.target.files;
        const file = event.target.files[0];
        this.menuForm.controls['existingFile'].setValue(this.image_input_img_name);
        this.menuForm.controls['imageInput'].setValue(event.target.files[0].name);
        this.is_file = false;
        this.boolImageChangeValidDirty = true;
    }

    subMenuCollapseOpen(menuTypeMenuSlugId) {
        if (this.subMenuTypeCollapsed !== menuTypeMenuSlugId) {
            const self = this;
            swal({
                title: 'Are you sure?',
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

    // revert back
    revertBack(): void {
        if (this.snapShotCssJson) {
            swal({
                title: 'Are you sure?',
                text: 'You want to revert back with previous data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn-warning',
                confirmButtonText: 'Yes, Revert Back',
                cancelButtonText: 'Cancel',
                closeOnConfirm: false,
                closeOnCancel: true
            }, (isConfirm) => {
                if (isConfirm) {
                    this.editMenuDetails(this.snapShotCssJson);
                    swal({
                        title: 'Success!',
                        text: 'Your record revert back.',
                        type: 'success',
                        confirmButtonClass: 'btn-success'
                    });
                    if (this.boolChildFormDirty === true) {

                        // reset all dirty state after revert back
                        // this.resetAlldirty();
                        this.boolChildFormDirty = false;
                        this.boolImageChangeValidDirty = false;

                    }
                } else {
                    // swal({
                    //     title: 'Cancelled',
                    //     text: 'Your record is safe :)',
                    //     type: 'error',
                    //     confirmButtonClass: 'btn-danger'
                    // });
                }
            });

        } else {
            console.log('snapshot empty..!!');
        }
    }


    editMenuDetails(data) {
        // boolSaveDisable false for save button
        this.boolSaveDisable = false;

        // for dropify reset
        $('.dropify-render img').attr('src', null);
        // for revert logic
        this.menuOriginalDataOnclick = data;
        this.onClickscrollUp();

        // for revert logic
        this.snapShotCssJson = data;
        this.dropifyId = data.id;

        this.menu_icon_name = data.menu_type_icon_name;
        this.menu_font_icon = data.menu_type_icon;
        this.getAppMenuType();

        let parentId = data.is_parent;
        if (parentId === 0) {
            // this ref
            var self = this;
            this.menu_icon_image = '';
            this.noMenuFound = false;
            this.menuFound = true;
            this.menuCreateMsg = false;

            let menuId = data.id;
            let menu_text = data.menu_name;
            let existing_img = data.app_existing_img_name;
            this.imageMenuTitle = false;

            if (data.menu_type === 0 || data.menu_type == null) {
                this.menuTypeSelValue = null;
                this.menuNotSelected = null;
                this.menuTypeHtml = false;
            } else {
                // this.getAppMenuType();
                this.menuTypeMenuSlugData = this.menuTypeData[0 + (data.menu_type - 1)]['menuTypeSlug'];
                this.menuTypeMenuSlugId = this.menuTypeMenuSlugData + '_' + data.id;

                this.menuTypeSelValue = data.menu_type;
                this.menuNotSelected = data.menu_type;

                this.menuTypeHtml = true;
                for (let x in this.menuTypeHtmlHidden) {
                    if (this.menuTypeHtmlHidden.hasOwnProperty(x)) {
                        this.menuTypeHtmlHidden[x] = false;
                    }
                }
                this.menuTypeHtmlHidden[data.menu_type - 1] = true;
            }

            this.menu_icon_image = data.app_default_icon_thumb_url;
            // this.menu_icon_image = data.app_default_icon_original_url;

            this.menuTypeIsChild =
                {
                    'menuId': menuId,
                    'parentId': parentId,
                    'menu_text': menu_text
                };

            this.cssJsonService.setListMenuShowChildData(this.menuTypeIsChild);

            if (data.menu_type_json_data !== null && data.menu_type_json_data.length > 0) {
                this.menuTypeSubCssJsonData = JSON.parse(data.menu_type_json_data);
                this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
            } else {
                this.menuTypeSubCssJsonData = '';
                this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
            }

            // if (typeof (this.sampleChildData) !== undefined && typeof (this.sampleChildData) !== 'undefined')
            // {
            //    this.sampleChildData.delete('existingImage');
            // }

            this.menuForm = this.fb.group({
                menuId: menuId,
                parentId: parentId,
                menu_text: [menu_text, Validators.compose([Validators.required])],
                selct_menu_type: [this.menuTypeSelValue, []]
            });
        }
        else {
            this.editSubMenuDetails(data);
        }
    }

    editSubMenuDetails(subData) {
        // for dropify reset
        $('.dropify-render img').attr('src', null);

        // console.log('Submenu Exsting Data', subData.app_existing_img_name);
        this.menu_icon_image = '';
        this.image_input_img_name = '';
        this.noMenuFound = false;
        this.menuFound = true;
        this.menuCreateMsg = false;
        let self = this;
        let menuId = subData.id
        let parentId = subData.is_parent
        let menu_text = subData.menu_name;
        // let existing_img = subData.app_existing_img_name;

        let existing_img: any;
        let image_input_img = subData.app_existing_img_name;
        this.image_input_img_name = subData.app_existing_img_name;
        if (subData.app_existing_img_name !== 'default.png') {
            existing_img = subData.app_existing_img_name;
        }
        else {
            existing_img = null;
        }

        let menu_type_sub_json_data;
        let imageTitleData;
        let imageUrlData;

        this.menuTypeIsChild = {
            'menuId': menuId,
            'parentId': parentId,
            'menu_text': menu_text
        };

        this.cssJsonService.setListMenuShowChildData(this.menuTypeIsChild);

        if (subData.menu_type_json_data !== null && subData.menu_type_json_data.length > 0) {
            menu_type_sub_json_data = JSON.parse(subData.menu_type_json_data);
            this.menuTypeSubCssJsonData = menu_type_sub_json_data;
            this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
        }
        else {
            this.menuTypeSubCssJsonData = '';
            this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
        }

        if (subData.menu_type == 0 || subData.menu_type == null) {
            this.menuTypeSelValue = null;
            this.menuNotSelected = null;
            this.menuTypeHtml = false;
        }
        else {
            // this.menuTypeSelValue = this.radioArray[0+(subData.menu_type - 1)]['data_'+subData.menu_type];
            this.menuTypeMenuSlugData = this.menuTypeData[0 + (subData.menu_type - 1)]['menuTypeSlug'];
            this.menuTypeMenuSlugId = this.menuTypeMenuSlugData + '_' + subData.id;

            this.menuTypeSelValue = subData.menu_type;
            this.menuNotSelected = subData.menu_type;
            this.menuTypeHtml = true;

            for (let x in this.menuTypeHtmlHidden) {
                if (this.menuTypeHtmlHidden.hasOwnProperty(x)) {
                    this.menuTypeHtmlHidden[x] = false;
                }
            }
            this.menuTypeHtmlHidden[subData.menu_type - 1] = true;
        }

        this.menuForm = this.fb.group({
            menuId: menuId,
            parentId: parentId,
            menu_text: [menu_text, Validators.compose([Validators.required])],
            // imageInput: [],
            // existingFile: [],
            selct_menu_type: [this.menuTypeSelValue, []]
        });

        this.menu_icon_image = subData.app_default_icon_thumb_url;
        // this.menu_icon_image = subData.app_default_icon_original_url;
        let dropifyImageUploadId: any;
        dropifyImageUploadId = '#image_upload_' + this.dropifyId;

        setTimeout(() => {
            // $('#image_upload_' + this.dropifyId).dropify();
            this.callToolTip();
            let beforeClearType: any;
            const subdrEvent = $(dropifyImageUploadId).dropify({
                defaultFile: self.menu_icon_image,
                messages: {
                    'default': 'Drag and drop a file here or click',
                    'replace': 'Drag and drop or click to replace',
                    'remove': 'Remove',
                    'error': ''
                },
                tpl: {
                    wrap: '<div class="dropify-wrapper"></div>',
                    loader: '<div class="dropify-loader"></div>',
                    message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                    preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                    filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                    clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                    errorLine: '<p class="dropify-error">{{ error }}</p>',
                    errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1240x646), please upload your image in these dimensions</div>'
                }
            });

            let checkDropifyClass = $(".dropify-wrapper").hasClass("has-preview");
            if (!checkDropifyClass) {
                $(".dropify-wrapper").removeClass("has-error").addClass("has-preview");
                $('.dropify-wrapper .dropify-preview').css('display', 'block')
                $('.dropify-wrapper .dropify-preview .dropify-render').prepend('<img src="" />')
            }

            subdrEvent.on('dropify.beforeClear', function (event, element) {
                self.onClickOnDropify(event, element)
                    .then(res => {
                        if (res === true) {
                            self.removeFileOnDropify(event, subdrEvent);
                        } else {
                            $('.dropify-render img').attr('src', self.menu_icon_image);
                        }
                    });
                return false;
            });

            subdrEvent.on('dropify.afterClear', function (event, element) {
                // self.removeFileChange(event);
                self.removeFileChange(event, subdrEvent);
            });

            subdrEvent.on('dropify.error.minWidth', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                // decline imge dirty status coz of error
                self.boolImageChangeValidDirty = false;
            });

            subdrEvent.on('dropify.error.maxWidth', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                // decline imge dirty status coz of error
                self.boolImageChangeValidDirty = false;
            });

            subdrEvent.on('dropify.error.minHeight', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                // decline imge dirty status coz of error
                self.boolImageChangeValidDirty = false;
            });

            subdrEvent.on('dropify.error.maxHeight', function (event, element) {
                self.removeFileChange(event, subdrEvent);
                // decline imge dirty status coz of error
                self.boolImageChangeValidDirty = false;
            });

            $('.dropify-render img').attr('src', this.menu_icon_image);
            $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);

        }, 100);

        if (parentId !== 0 && parentId !== null) {
            this.getParentMenuType(parentId)
                .then(res => {
                    if (res !== 'undefined' && res !== null && res['menu_type'] == 1) {
                        this.imageMenuTitle = true;
                        this.is_file = false;
                        this.menuForm = this.fb.group({
                            menuId: menuId,
                            parentId: parentId,
                            menu_text: [menu_text, Validators.compose([Validators.required])],
                            imageInput: [existing_img, Validators.compose([Validators.required])],
                            existingFile: [existing_img, Validators.compose([Validators.required])],
                            selct_menu_type: [this.menuTypeSelValue, []]
                        });
                        // this.menuForm.controls['imageInput'].setValue(existing_img);
                        // this.menuForm.controls['existingFile'].setValue(existing_img);
                    } else {
                        this.imageMenuTitle = false;
                        this.menuForm = this.fb.group({
                            menuId: menuId,
                            parentId: parentId,
                            menu_text: [menu_text, Validators.compose([Validators.required])],
                            selct_menu_type: [this.menuTypeSelValue, []]
                        });
                    }
                });
        }
        else {
            this.imageMenuTitle = false;
            this.menuForm = this.fb.group({
                menuId: menuId,
                parentId: parentId,
                menu_text: [menu_text, Validators.compose([Validators.required])],
                selct_menu_type: [this.menuTypeSelValue, []]
            });
        }
    }

    public getParentMenuType(parentId: any) {
        return new Promise(resolve => {
            const postData = {
                'parentId': parentId
            }
            this.commonService.postData(postData, 'getparentmenutypedata').subscribe(res => {
                let parentMenuJsonData;
                let parentStatus;

                parentMenuJsonData = JSON.parse(res);
                parentStatus = parentMenuJsonData['status'];
                if (parentStatus == 1) {
                    this.parentMenuData = parentMenuJsonData['data'];
                    resolve(parentMenuJsonData['data']);
                } else {
                    this.parentMenuData = null;
                    resolve('undefined');
                }
            });
        });
    }

    onMenuFormSubmit(mform: NgForm) {
        return new Promise<boolean>(resolve => {
            this.saveMenuDisbleBtnRef.nativeElement.disabled = true;
            NProgress.start();
            mform.value.selct_menu_type = this.menuTypeSelValue;
            if (typeof (this.sampleChildData) === 'undefined') {
                this.sampleChildData = new FormData();
            }

            if (mform.value.hasOwnProperty('existingFile')
                && typeof (mform.value.existingFile) !== 'undefined'
                && mform.value.existingFile !== '') {
                this.sampleChildData.append('existingImage', mform.value.existingFile);
            }

            // let formData:FormData = new FormData();
            // formData.append('existingImage', mform.value.existingFile);

            if (this.fileList != null) {
                const file: File = this.fileList[0];
                this.sampleChildData.append('image_upload', file);
            }

            const obj = {
                'app_basic_id': this.app_id,
                'menu_id': mform.value.menuId,
                'is_parent': mform.value.parentId,
                'menu_text': mform.value.menu_text,
                'selct_menu_type': mform.value.selct_menu_type,
                'select_menu_slug': this.menuTypeMenuSlugData
            };

            this.sampleChildData.append('mainMenuData', JSON.stringify(obj));
            this.commonService.filePostData(this.sampleChildData, 'updatemenutypedata').subscribe(res => {
                this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
                NProgress.done();
                this.rdata = JSON.parse(res);
                this.rstatus = this.rdata['status'];
                const updatedMenuTypeData = this.rdata['data'];

                if (this.rstatus === '1' || this.rstatus === 1) {
                    this.afterSaveGetAppMenu();
                    if (updatedMenuTypeData.menu_type_json_data !== null && updatedMenuTypeData.menu_type_json_data.length > 0) {
                        this.menuTypeSubCssJsonData = JSON.parse(updatedMenuTypeData.menu_type_json_data);
                        this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
                    } else {
                        this.menuTypeSubCssJsonData = '';
                        this.cssJsonService.setCssJsonData(this.menuTypeSubCssJsonData);
                    }
                    this.image_input_img_name = this.rdata['data'].menu_icon;
                    $('.dropify-infos .dropify-filename .dropify-filename-inner').html(this.image_input_img_name);
                    const success_message = this.rdata['message'];
                    //  reset all dirty and menu changes false
                    this.resetAlldirty();
                    $(function () {
                        $.notify({
                            title: '',
                            message: success_message
                        },
                            {
                                type: 'success'
                            });
                    });
                    mform.form.markAsPristine();
                    resolve(true);
                } else {
                    const error_message = this.rdata['message'];
                    $(function () {
                        $.notify({
                            title: '',
                            message: error_message
                        }, {
                                type: 'danger'
                            });
                    });
                    mform.form.markAsPristine();
                    resolve(false);
                }
            }, err => {
                this.saveMenuDisbleBtnRef.nativeElement.disabled = false;
            });
        });
    }

    onClickOnDropify(event, element) {
        // const self = this;
        return new Promise(resolve => {
            swal({
                title: "Are You Sure?",
                text: "Are you sure you want to remove the panel image? This cannot be reversed.",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                (isConfirm) => {
                    if (isConfirm) {
                        swal({
                            title: "Successfully",
                            text: "Remove the Panel Image",
                            type: "success",
                            confirmButtonClass: "btn-success"
                        });
                        resolve(true);
                    } else {
                        swal({
                            title: "Cancelled",
                            text: "Not Remove the Panel Image",
                            type: "error",
                            confirmButtonClass: "btn-danger"
                        });
                        resolve(false);
                    }
                });
        });
    }

    showMenuTypesForm(menuTypeData, index, menuId, menuTypeSlug) {
        this.menuTypeSelValue = menuId;
        this.menuTypeHtml = true;
        this.menuTypeMenuSlugData = menuTypeSlug;

        if (typeof (menuTypeData) !== 'undefined' && menuTypeData !== null) {
            for (const x in this.menuTypeHtmlHidden) {
                if (this.menuTypeHtmlHidden.hasOwnProperty(x)) {
                    this.menuTypeHtmlHidden[x] = true;
                }
            }
            this.menuTypeHtmlHidden[index] = false;

            menuTypeData.app_basic_id = this.app_id;
        }
    }

    public handleEvent(childData: any) {
        this.sampleChildData = childData;
    }

    removeFileChange(event, drEvent: any) {
        this.fileList = event.target.files;
        this.is_file = true;
        this.menuForm.controls['imageInput'].setValue(null);
    }

    removeFileOnDropify(event, drEvent: any) {
        let dropifyImgId = drEvent.attr("id");
        this.fileList = event.target.files;
        this.is_file = true;
        this.menuForm.controls['imageInput'].setValue(null);

        $('.dropify-render img').attr('src', null);
        $('.dropify-infos .dropify-filename .dropify-filename-inner').html(null);

        // drEvent = $('#'+dropifyImgId).dropify();
        // drEvent = drEvent.data('dropify');
        // drEvent.resetPreview();
    }

    public removeMenu(data) {
        const self = this;
        swal({
            title: 'Are You Sure?',
            text: 'You will not be able to recover this menu item',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel',
            closeOnConfirm: false,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    self.deleteAppMenu(data);
                    swal({
                        title: 'Menu Removed',
                        text: 'The menu item has been removed',
                        type: 'success',
                        confirmButtonClass: 'btn-success'
                    });
                } else {
                    swal({
                        title: 'Cancelled',
                        text: 'Your menu item is safe :)',
                        type: 'error',
                        confirmButtonClass: 'btn-danger'
                    });
                }
            });
    }

    public deleteAppMenu(data) {
        const postData =
            {
                'id': data.id,
                'app_basic_id': data.app_basic_id,
                'order': data.order,
                'is_parent': data.is_parent
            }
        this.commonService.postData(postData, 'deleteappmenu').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus === '1' || this.rstatus === 1) {
                this.getAppMenu();
            }
            else {
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    },
                        {
                            type: 'danger'
                        });
                });
            }
        });
    }
    resetAlldirty(): void {
        this.boolChildFormDirty = false;
        this.boolImageChangeValidDirty = false;
        this.is_menu_change = false;
    }
}
