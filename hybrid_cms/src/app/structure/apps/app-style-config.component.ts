import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerService, Rgba } from 'ngx-color-picker';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;
@Component({
    selector: 'app-app-style-config',
    templateUrl: './app-style-config.component.html',
    styleUrls: ['./app-style-config.css'],
})

export class AppStyleConfigComponent implements OnInit, CanComponentDeactivate, AfterViewInit {

    @ViewChild('generalForm') gFormRef: NgForm;
    @ViewChild('menuForm') menuFormRef: NgForm;
    @ViewChild('submenuForm') submenuFormRef: NgForm;
    @ViewChild('arrowmenuForm') arrowmenuFormRef: NgForm;
    @ViewChild('tabmenuForm') tabmenuFormRef: NgForm;
    @ViewChild('generalBtnSave') generalBtnSaveRef: ElementRef;
    @ViewChild('menuBtnSave') menuBtnSaveRef: ElementRef;
    @ViewChild('tabBtnSave') tabBtnSaveRef: ElementRef;

    // boolean ref of gFormRef
    private menuLocationFormBoolRef: boolean;
    domloaded: boolean

    private menuFormBoolRef: boolean;
    private submenuFormBoolRef: boolean;
    private arrowmenuBoolRef: boolean;
    private tabmenuFormBoolRef: boolean;

    public homescreenform: FormGroup;
    public menuconfigurationform: FormGroup;
    public menuLocationType: FormGroup;

    // group b changes
    private headerImgDataMain: FormData;

    id = 'qDuKsiwS5xw';
    private player;
    private ytEvent;


    public typeMenuform =
        {
            sel_menu_type: '1',
        };

    cl = "";
    bgcl = "";
    bg_cl = "";
    fileList: FileList;
    rstatus: any;
    model = { alignment: '' };
    is_applogoImage_file = false;
    is_homescreen_file = false;
    is_bcimage_file = false;
    is_menulogo_file = false;
    is_app_bg_file = false;
    is_image_file = false;
    rdata = [];
    is_file = false;
    currentAppData = [];
    basic_information_data = '';
    home_screen_data: any;
    menu_configuration_data: any;
    home_screen_data_json: any;
    menu_configuration_data_json: any;
    alignment = 'Left Right Center'.split(' ');
    menu_alignment_json: any;
    inputcolor = '';
    cssJsonData: any;
    menuCssJsonData: any;
    menuJson: any;
    allMenuData: any;
    appIconUrl: any;
    submenuArrayCss: any;
    menuArrayCss: any;
    arrowArrayCss: any;
    subMenuCssData: any;
    tempArray: any;
    colorData: any;
    menuFontFamily: any;
    menuPaddingTop: any;
    menuPaddingLeft: any;
    backgroundColorData: any;
    parentFontSize: any;
    submenuBackgroundColorData: any;
    submenuColorData: any;
    submenuFontFamily: any;
    submenuMenuPaddingTop: any;
    submenuMenuPaddingLeft: any;
    submenuParentFontSize: any;
    menuBorder: any;
    borderColor: any;
    submenuBorderColor: any;
    submenuBorder: any;
    menuiconArrayCss: any;
    headerArrayCss: any;
    statusbarArrayCss: any;
    commonCssJsonData: any;
    fontFamilyData: any;
    fontDataMainMenu: any;
    fontDataSubmenu: any;
    menuIconCssColor: any;
    statusBarColorCss: any;
    headerBorderColor: any;
    headerBackgroundColor: any;
    heightData: any;
    borderSize: any;
    nonSelectedFontColor: any;
    nonSelectedColor: any;
    selectedFontColor: any;
    selectedColor: any;
    app_id = '';
    menuData = [];
    headerborderColorMain: any;
    logoHideFlag: any;
    logoHideFlagGeneral: any;
    showDownArrow: any;
    showUpArrow: any;
    nonSelectedFontColorSub: any;
    nonSelectedColorSub: any;
    selectedFontColorSub: any;
    selectedColorSub: any;
    marginLeftArrow: any;
    subMenuTypeCollapsed: any;
    confirmFlag: any;
    menuType: any;
    menuIconShow: any;
    menulength: any;
    cssTabShow: any;
    cssTabHide: any;
    tabArrayCss: any;
    tabCss: any;
    iconOne: any;
    iconTwo: any;
    iconThree: any;
    iconFour: any;
    iconFive: any;
    mainCssArray: any;
    fontDataTab: any;
    tabMenuData: any;
    finallTabArray: any;
    menuIconData: any;
    selectedArray: any;
    positionData: any;
    iFrameUrl: any;
    iFrameEnable: any;
    levelThreeData: any;
    listFlag: any;
    videoList: any;
    videoDataFinal: any;
    submenuMarginTop: any;
    subMenuHeaderBorderColor: any;
    sideMenuBorderBottom: any;
    sideMenuBorderColor: any;
    sideMenuHeaderImgData: any;
    sideMenuHeaderImgName: any;
    headerImgData: any;
    headerSideImg: any;
    headerMainImg: any;
    mainHeaderImgData: any;
    mainHeaderImgName: any;
    oldHeaderImg: any;
    oldMainImg: any;
    exctImage: any;
    menuImageChangeFlag: any;
    genralImageChangeFlag: any
    headerLogoWidth: any;
    headerLogoHeight: any;
    headerBorderSize: any;
    subMenuHeaderBorderColorMob: any;
    // generalFlag: any;
    generalImgUrl: any;
    dropifyAppIconHeaderSize: any;
    menuOneVal: any;
    menuTwoVal: any;
    menuThreeVal: any;
    menuFourVal: any;
    menuFiveVal: any;
    menuTypeData: any;
    tabSelectedColor: any;
    tabNonSelectedColor: any;
    appBasicDetail: any;
    pathToDefaultImg: any;
    tabBackgroundColor: any;

    positionArray = [
        {
            'name': 'absolute',
            'key': '1'
        },
        {
            'name': 'relative',
            'key': '2'
        }
    ]
    menuLocationArray = [
        {
            'name': 'Side Menu',
            'key': '1'
        },
        {
            'name': 'Tab Menu',
            'key': '2'
        }
    ];
    menu_location_type: any;
    menuTypeDataSelection: any;
    app_icon_data: any;
    // obseravable time declaration
    handlerTimestart: Observable<any>;

    constructor(
        private cpService: ColorPickerService,
        private commonService: CommonService,
        private fb: FormBuilder,
        private http: Http,
        private sharedService: SharedService,
        private _sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
        private msgService: MessageService
    ) {
        this.domloaded = true;
        // set timer
        this.handlerTimestart = Observable.timer(1000);
        // this.generalFlag = false;
        this.levelThreeData = []
        this.iFrameEnable = false;
        this.iFrameUrl = '';
        this.selectedArray = [];
        this.menuIconData = [];
        this.finallTabArray = [];
        this.tabCss = [];
        this.confirmFlag = false
        this.showDownArrow = true;
        this.logoHideFlagGeneral = true;
        this.logoHideFlag = true;
        // this.menuFontFamily = 'arial';
        this.subMenuCssData = [];
        this.tempArray = [];
        this.borderSize = '1px solid';
        // this.menuBorder = '1px solid';
        this.currentAppData = this.commonService.get_current_app_data();
        this.sideMenuBorderBottom = '1px solid';

        this.app_id = this.currentAppData['id'];
        this.menu_location_type = this.currentAppData['menu_location_type'];

        this.menuTypeDataSelection = this.currentAppData['menu_location_type'];
        this.typeMenuform.sel_menu_type = this.currentAppData['menu_location_type'];

        if (this.typeMenuform.sel_menu_type == '1') {
            this.menuType = 1;
            this.toggleMenuHeaderDefault();
        } else {
            this.menuType = 2;
            this.toggleMenuHeaderDefault();
        }

        this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
        this.home_screen_data = this.currentAppData['basicDetail']['home_screen'];
        this.menu_configuration_data = this.currentAppData['basicDetail']['menu_configuration'];
        // console.log(this.home_screen_data['section_json_data']);
        const iconData = this.currentAppData['basicDetail']['app_icon'];
        const app_icon = iconData.app_icon_thumb_url;
        if (app_icon) {
            this.appIconUrl = app_icon;
        }
        this.appBasicDetail = this.currentAppData['basicDetail'];
        let tempImgVat = this.currentAppData['basicDetail']['app_icon'].app_icon_thumb_url.split('thumb');
        this.pathToDefaultImg = tempImgVat[0] + 'thumb' + '/default.png';

        $(function () {
            $('[data-toggle=tooltip]').tooltip();
        });
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {

        if (NProgress.isStarted()) {
            NProgress.done();
        }

        this.handlerTimestart.subscribe(() => {
            NProgress.start();
        });
        // $(function () {
        //     $('.dropify').dropify();
        // });

        // let drEventTwo = $('#app_iconHeader').dropify({
        //         defaultFile: this.appIconUrl
        //     });
        // this.headerLogoWidth = '64px';
        this.headerLogoHeight = '45px';
        setTimeout(() => {
            $('.select2-tags').select2({
                tags: true,
                tokenSeparators: [',', ' ']
            });

            $('.selectpicker').selectpicker('refresh');
            //
            // $('#menuSelectId').selectpicker('refresh');

            // $('#menuSelectId').val('Bookman').trigger('change');
        }, 3000);

        $(window).scroll(function () {
            const scroll = $(window).scrollTop();
            if (scroll >= 150) {
                $('.sticky_class').addClass('change-position');
            } else {
                $('.sticky_class').removeClass('change-position');
            }
        });



        const self = this;

        let tab = false;
        let sidebar = false;
        let appLogo = null;
        let home_screen_bg = null;
        let height = '';
        let bg_image = false;
        let bg_img = null;
        let color = false;

        const appData = this.commonService.get_current_app_data();
        const appUniqId = JSON.stringify(appData.app_unique_id);
        const cssComponent = 'general_css';
        const sidemenuCssComponent = 'side_menu_css';
        const generalCssDBColumn = 'app_general_css_json_data';
        const sideMenuCssDBColumn = 'app_side_menu_css_json_data';
        const appId = JSON.stringify(appData.id);

        this.fontFamilyData = [];
        this.commonService.getData('getFontData').subscribe(res => {
            this.fontFamilyData = JSON.parse(res);
        })

        // change promiseAPI to callableObservableAPI
        this.callablePromiseAPI().subscribe(res => {
            // console.log(res);
            if (res === 'imgLoaded') {
                this.domloaded = false;
                NProgress.done();
                // console.log(this.domloaded, '<<<<')
            } else {
                NProgress.done();
            }

        }, (err) => {

        });
        // isCSSDataExistAPI
        this.calllableisCssDataExist().then((res) => {

        });

        const postData = { 'app_basic_id': appId };
        this.commonService.postData(postData, 'appmenudata').subscribe(resP => {
            this.rdata = JSON.parse(resP);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                this.menuJson = this.rdata['data'];
                // console.log(this.menuJson);
                for (let i = 0; i < this.menuJson.length; ++i) {
                    if (this.menuJson[i].menu_type_json_data) {
                        const childData = JSON.parse(this.menuJson[i].menu_type_json_data);
                        this.menuJson[i].menu_type_json_data = childData;
                    }
                }

                this.menulength = this.menuJson.length;
                this.cssTabShow = [];
                if (this.menulength === 5) {
                    this.cssTabShow[5] = "block";
                } else {
                    this.cssTabShow[5] = "none";
                }
                if (this.menulength === 4) {
                    this.cssTabShow[4] = "block";
                } else {
                    this.cssTabShow[4] = "none";
                }
                if (this.menulength === 3) {
                    this.cssTabShow[3] = "block";
                } else {
                    this.cssTabShow[3] = "none";
                }
                if (this.menulength === 2) {
                    this.cssTabShow[2] = "block";
                } else {
                    this.cssTabShow[2] = "none";
                }
                if (this.menulength === 1) {
                    this.cssTabShow[1] = "block";
                } else {
                    this.cssTabShow[1] = "none";
                }

                this.commonService.getData('getMenuIcon').subscribe(res => {
                    this.menuIconData = [{ iconData: JSON.parse(res), menuData: this.menuJson }];
                    this.AfterMenuIconSelectPickerInit();
                    // , selectedMenu : this.selectedArray

                })

            } else {
                const error_message = this.rdata['message'];
            }
        });



        this.menuLocationType = this.fb.group({
            menu_location_type: [this.menu_location_type, Validators.compose([Validators.required])]
        });

        $(window).scroll(function () {
            if ($(this).scrollTop() > 105 && $(window).width() > 767) {
                $('#homescreenform .custom_tabpanel_phone').addClass("custom_tab_panel_phone_stick");
                $('#homescreenform .custom_tabpanel_phone .screen_outer').addClass("phone_stick_scroll");
            } else {
                $('#homescreenform .custom_tabpanel_phone').removeClass("custom_tab_panel_phone_stick");
                $('#homescreenform .custom_tabpanel_phone .screen_outer').removeClass("phone_stick_scroll");
            }
            if ($(this).scrollTop() > 105 && $(window).width() > 767) {
                $('#menuconfigurationform .custom_tabpanel_phone').addClass("custom_tab_panel_phone_stick");
                $('#menuconfigurationform .custom_tabpanel_phone .screen_outer').addClass("phone_stick_scroll");
            } else {
                $('#menuconfigurationform .custom_tabpanel_phone').removeClass("custom_tab_panel_phone_stick");
                $('#menuconfigurationform .custom_tabpanel_phone .screen_outer').removeClass("phone_stick_scroll");
            }

        });

    }
    /**
     * Method to get all menu data related to app
     */
    getAppMenu(): void {
        const postData = { 'app_basic_id': this.app_id };
        this.commonService.postData(postData, 'appmenudata').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                this.menuData = this.rdata['data'];
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
            }
        });
    }
    /**
     * Method to update menulocation type
     * @param selMenuType
     */
    sendMenuTypeData(selMenuType: any) {
        this.menuType = selMenuType;
        $(function () {
            $('[data-toggle=tooltip]').tooltip();
        });
        if (this.menuType == 1) {
            this.calllableisCssDataExist();
            this.menuTypeData = 'sidemenu';
            this.logoHideFlag = false;
            this.menuIconShow = true;
            this.AfterMenuIconSelectPickerInit();
        } else {
            this.AfterMenuIconSelectPickerInit();
            this.logoHideFlag = true;
            this.menuIconShow = false;
            this.calllableisCssDataExist();
            this.menuTypeData = 'tabmenu';
            this.fontDataTab = 'Arial';
            // setTimeout(() => {
            //     $('.select2-tags').select2({
            //         tags: true,
            //         tokenSeparators: [',', ' ']
            //     });

            //     $('.selectpicker').selectpicker('refresh');
            //     //
            //     // $('#menuSelectId').selectpicker('refresh');

            //     // $('#menuSelectId').val('Bookman').trigger('change');
            // }, 1000);

            $(window).scroll(function () {
                const scroll = $(window).scrollTop();
                if (scroll >= 150) {
                    $('.sticky_class').addClass('change-position');
                } else {
                    $('.sticky_class').removeClass('change-position');
                }
            });


            setTimeout(() => {

                function formatFA(icon) {
                    if (!icon.id) {
                        return icon.text;
                    }
                    const $icon = $('<span></span>').append($('<i class="' + icon.id + ' "></i>').css({
                        'color': icon.text
                    })).append(icon.text);
                    return $icon;
                };
                $('#gyr_ind0').select2({
                    templateResult: formatFA
                });

                $('#gyr_ind0').change(function (e) {
                    self.selectMenuChange('0', $(this).val());
                    self.menuOneVal = $(this).val();
                })

            }, 2000)

            setTimeout(() => {
                function formatFA(icon) {
                    if (!icon.id) {
                        return icon.text;
                    }
                    const $icon = $('<span></span>').append($('<i class="' + icon.id + ' "></i>').css({
                        'color': icon.text
                    })).append(icon.text);
                    return $icon;
                };
                $('#gyr_ind1').select2({
                    templateResult: formatFA
                });

                $('#gyr_ind1').change(function (e) {
                    self.selectMenuChange('1', $(this).val());
                    self.menuTwoVal = $(this).val();
                })

            }, 2000)

            setTimeout(() => {
                function formatFA(icon) {
                    if (!icon.id) {
                        return icon.text;
                    }
                    const $icon = $('<span></span>').append($('<i class="' + icon.id + ' "></i>').css({
                        'color': icon.text
                    })).append(icon.text);
                    return $icon;
                };
                $('#gyr_ind2').select2({
                    templateResult: formatFA
                });

                $('#gyr_ind2').change(function (e) {
                    self.selectMenuChange('2', $(this).val());
                    self.menuThreeVal = $(this).val();
                })
            }, 2000)

            setTimeout(() => {
                function formatFA(icon) {
                    if (!icon.id) {
                        return icon.text;
                    }
                    const $icon = $('<span></span>').append($('<i class="' + icon.id + ' "></i>').css({
                        'color': icon.text
                    })).append(icon.text);
                    return $icon;
                };
                $('#gyr_ind3').select2({
                    templateResult: formatFA
                });

                $('#gyr_ind3').change(function (e) {
                    self.selectMenuChange('3', $(this).val());
                    self.menuFourVal = $(this).val();
                })
            }, 2000)


            setTimeout(() => {
                function formatFA(icon) {
                    if (!icon.id) {
                        return icon.text;
                    }
                    const $icon = $('<span></span>').append($('<i class="' + icon.id + ' "></i>').css({
                        'color': icon.text
                    })).append(icon.text);
                    return $icon;
                };
                $('#gyr_ind4').select2({
                    templateResult: formatFA
                });

                $('#gyr_ind4').change(function (e) {
                    self.selectMenuChange('4', $(this).val());
                    self.menuFiveVal = $(this).val();
                })

            }, 2000)
            const self = this;
        }
        const onChangeSelMenuType = {
            value: {
                app_basic_id: this.app_id,
                menu_location_type: selMenuType
            }

        };

        NProgress.start();
        this.commonService.postData(onChangeSelMenuType.value, 'updatemenulocationtype').subscribe(res => {
            NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == 1 || this.rstatus == '1') {
                this.menuTypeDataSelection = selMenuType;
                this.currentAppData['menu_location_type'] = selMenuType;
                localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
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
                $(function () {
                    $('[data-toggle=tooltip]').tooltip();
                });
                if (this.menuTypeData == 'sidemenu') {

                } else {
                    this.menuTypeData = 'tabmenu';
                    this.logoHideFlag = true;
                    this.menuIconShow = false;
                }
            } else {

                $(function () {
                    $('[data-toggle=tooltip]').tooltip();
                });
                this.menuType = 1;
                this.typeMenuform.sel_menu_type = this.menuTypeDataSelection;
                const error_message = this.rdata['message'];
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    }, {
                            type: 'danger'
                        });
                });
                this.menuTypeData = 'sidemenu';
                this.logoHideFlag = false;
                this.menuIconShow = true;
            }
        });

    }

    onMenuLocationTypeSubmit(menuLocationTypeform: NgForm) {
        // NProgress.start();
        menuLocationTypeform.value.app_basic_id = this.app_id;

        this.commonService.postData(menuLocationTypeform.value, 'updatemenulocationtype').subscribe(res => {
            // NProgress.done();
            this.rdata = JSON.parse(res);
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
                // menuLocationTypeform.resetForm();
                this.menu_location_type = menuLocationTypeform.value.menu_location_type;
                this.currentAppData['menu_location_type'] = menuLocationTypeform.value.menu_location_type;
                localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
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
    homescreenSubmit(): void {
        // get current selected app data
        this.homeScreenSubmitObservable().subscribe((d) => {
            // console.log(d);
            this.gFormRef.form.markAsPristine();
            this.resetAllDirtyStateMenuForm();
        }, (err) => {
            this.gFormRef.form.markAsPristine();
            this.resetAllDirtyStateMenuForm();
        }, () => {
            // console.log('complete');
        })


    }
    // group b Changes
    private homeScreenSubmitObservable(): Observable<any> {

        return Observable.create((observe) => {
            NProgress.start();
            this.generalBtnSaveRef.nativeElement.disabled = true;
            // const appData = this.commonService.get_current_app_data();
            const appData = this.currentAppData;//this.commonService.get_current_app_data();

            const appId = appData['id'];
            const stringJsonData = JSON.stringify(this.cssJsonData);
            const generalCssDBColumn = 'app_general_css_json_data';

            this.mainCssArray = [{ 'menuIconCss': this.menuiconArrayCss },
            { 'headerCss': this.headerArrayCss },
            { 'statusBarCss': this.statusbarArrayCss }];


            this.headerImgDataMain = new FormData();

            const promise = new Promise((resolve) => {
                for (let i = 0; i < this.headerArrayCss.length; ++i) {
                    if (this.headerArrayCss[i]['key'] == 'headerIcon') {
                        this.exctImage = this.headerArrayCss[i]['value']
                    }
                }
                resolve(true);
            })

            promise.then(() => {
                if (this.mainHeaderImgData) {
                    const file: File = this.mainHeaderImgData[0];
                    this.headerImgDataMain.append('headerMainImg', file);
                }

                if (this.exctImage) {
                    this.headerMainImg = this.exctImage;
                    let drEventTwo = $('#app_iconHeader').dropify({
                        defaultFile: this.headerMainImg
                    });

                    // let data = JSON.parse(localStorage.getItem('headerImg'));
                    // console.log("data");
                    // console.log(data);

                    // const file: File = JSON.parse(localStorage.getItem('headerImg'));
                    // this.headerImgDataMain.append('headerMainImg', file);

                }

                this.headerImgDataMain.append('data', JSON.stringify(this.mainCssArray));
                this.headerImgDataMain.append('appId', appId);
                this.headerImgDataMain.append('dbColumn', generalCssDBColumn);
                this.headerImgDataMain.append('selMenuType', this.menuTypeDataSelection);

                if (this.oldHeaderImg) {
                    this.headerImgDataMain.append('oldMainImg', this.oldHeaderImg[1]);
                }

                this.commonService.filePostData(this.headerImgDataMain, 'saveCssData').subscribe(res => {
                    this.rdata = JSON.parse(res);
                    this.rstatus = this.rdata['status'];
                    if (this.rdata['mainMenuHeaderLogo']) {
                        this.headerMainImg = this.rdata['mainMenuHeaderLogo'];
                    }
                    localStorage.setItem('headerMainImg', this.headerMainImg);
                    this.oldHeaderImg = this.headerMainImg.split('headerImg/');
                    // this.msgService.sendMessage(this.headerMainImg);

                    this.cdr.detectChanges();

                    const promiseForloop = new Promise((resolve) => {
                        for (let i = 0; i < this.headerArrayCss.length; ++i) {
                            if (this.headerArrayCss[i]['key'] == 'headerIcon') {
                                this.headerArrayCss[i]['value'] = this.headerMainImg;
                            }
                        }
                        resolve(true);
                    })

                    promiseForloop.then(() => {

                        this.mainCssArray = [{ 'menuIconCss': this.menuiconArrayCss },
                        { 'headerCss': this.headerArrayCss },
                        { 'statusBarCss': this.statusbarArrayCss }];


                        this.headerImgDataMain = new FormData();

                        this.headerImgDataMain.append('data', JSON.stringify(this.mainCssArray));
                        this.headerImgDataMain.append('appId', appId);
                        this.headerImgDataMain.append('dbColumn', generalCssDBColumn);
                        this.headerImgDataMain.append('selMenuType', this.menuTypeDataSelection);

                        this.commonService.filePostData(this.headerImgDataMain, 'saveCssData').subscribe(res => { });
                    }
                    )

                    if (this.rstatus == '1') {
                        this.typeMenuform.sel_menu_type = this.menuTypeDataSelection;
                        this.currentAppData['menu_location_type'] = this.menuTypeDataSelection;
                        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
                        const success_message = this.rdata['message'];

                        if (this.genralImageChangeFlag == true) {
                            this.genralImageChangeFlag = false;
                        } else {
                            $(function () {
                                $.notify({
                                    title: '',
                                    message: success_message
                                }, {
                                        type: 'success'
                                    });
                            });
                        }
                        observe.next(success_message);
                        NProgress.done();
                        observe.complete();
                        this.generalBtnSaveRef.nativeElement.disabled = false;

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
                        NProgress.done();
                        observe.throw(error_message);
                        this.generalBtnSaveRef.nativeElement.disabled = false;

                    }
                });
            })
        })
    }

    sideMenuCssSubmit() {

        this.sideMenuCssSubmitObservable().subscribe(d => {
            // console.log(d);

            // reset all dirty boolFormRef
            this.resetAllDirtyStateMenuForm();
        }, err => {
            console.log(err);
        }, () => {

        });
    }
    /**
     * Method to trigger while save tab menu design chnage Observable
     */
    sideMenuCssSubmitObservable(): Observable<any> {
        return Observable.create((observe) => {
            // get current app data
            NProgress.start();
            const data = [];
            for (let i = 0; i < this.menuJson.length; ++i) {

                if (i == 0) {
                    this.tabArrayCss[7][0].value = this.menuJson[i]['menu_name'];
                    this.tabArrayCss[7][0].icon = this.menuOneVal;
                }

                if (i == 1) {
                    this.tabArrayCss[7][1].value = this.menuJson[i]['menu_name'];
                    this.tabArrayCss[7][1].icon = this.menuTwoVal;
                }

                if (i == 2) {
                    this.tabArrayCss[7][2].value = this.menuJson[i]['menu_name'];
                    this.tabArrayCss[7][2].icon = this.menuThreeVal;
                }

                if (i == 3) {
                    this.tabArrayCss[7][3].value = this.menuJson[i]['menu_name'];
                    this.tabArrayCss[7][3].icon = this.menuFourVal;
                }

                if (i == 4) {
                    this.tabArrayCss[7][4].value = this.menuJson[i]['menu_name'];
                    this.tabArrayCss[7][4].icon = this.menuFiveVal;
                }
            }

            setTimeout(() => {
                this.tabArrayCss[8][0].menutype = this.menuTypeData;
                this.menuBtnSaveRef.nativeElement.disabled = true;
                const appData = this.currentAppData;//this.commonService.get_current_app_data();
                const appId = appData['id'];

                const sideMenuCssDBColumn = 'app_side_menu_css_json_data';

                if (this.finallTabArray) {
                    for (let i = 0; i < this.tabArrayCss.length; ++i) {
                        if (this.tabArrayCss[i]['key'] == 'menuname') {
                            this.tabArrayCss[i]['value'] = this.finallTabArray;
                        }
                    }
                }

                // setTimeout(() => {
                // savemenucssflag
                for (let i = 0; i < this.arrowArrayCss.length; ++i) {
                    if (this.arrowArrayCss[i].key == "backarrowcolor") {
                        this.arrowArrayCss[i].value = this.menuIconCssColor;
                    }
                }

                // setTimeout(() => {

                this.mainCssArray = {
                    sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
                    { 'subMenu': this.submenuArrayCss },
                    { 'arrow': this.arrowArrayCss },
                    { 'tabMenu': this.tabArrayCss }]
                };
                this.headerImgData = new FormData();

                if (this.sideMenuHeaderImgData) {
                    const file: File = this.sideMenuHeaderImgData[0];
                    this.headerImgData.append('headerImg', file);
                }

                this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
                this.headerImgData.append('appId', appId);
                this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
                this.headerImgData.append('selMenuType', this.menuTypeDataSelection);

                if (this.oldMainImg) {
                    this.headerImgData.append('oldMainImg', this.oldMainImg[1]);
                }

                this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => {
                    this.rdata = JSON.parse(res);
                    this.rstatus = this.rdata['status'];
                    if (this.rdata['sideMenuHeaderLogo']) {
                        this.headerSideImg = this.rdata['sideMenuHeaderLogo'];
                    }
                    this.oldMainImg = this.headerSideImg.split('headerImg/');

                    const promise = new Promise((resolve) => {
                        for (let i = 0; i < this.menuArrayCss.length; ++i) {
                            if (this.menuArrayCss[i]['key'] == 'sideMenuImg') {
                                this.menuArrayCss[i]['value'] = this.headerSideImg;
                            }
                        }
                        resolve(true);
                    })

                    promise.then(() => {

                        this.mainCssArray = {
                            sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
                            { 'subMenu': this.submenuArrayCss },
                            { 'arrow': this.arrowArrayCss },
                            { 'tabMenu': this.tabArrayCss }]
                        };
                        this.headerImgData = new FormData();

                        // if(this.oldHeaderImg){
                        //     this.headerImgDataMain.append('oldHeaderImg', this.oldHeaderImg[1]);
                        // }

                        this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
                        this.headerImgData.append('appId', appId);
                        this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
                        this.headerImgData.append('selMenuType', this.menuTypeDataSelection);

                        // if(this.oldMainImg){
                        //     this.headerImgData.append('oldMainImg', this.oldMainImg[1]);
                        // }

                        this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => { });
                    })

                    if (this.rstatus == '1') {
                        const success_message = this.rdata['message'];
                        if (this.menuImageChangeFlag == true) {
                            this.menuImageChangeFlag = false;
                        } else {
                            $(function () {
                                $.notify({
                                    title: '',
                                    message: success_message
                                }, {
                                        type: 'success'
                                    });
                            });
                        }
                        observe.next(success_message);
                        NProgress.done();
                        observe.complete();
                        this.menuBtnSaveRef.nativeElement.disabled = false;
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
                        NProgress.done();
                        observe.throw(error_message);
                        this.menuBtnSaveRef.nativeElement.disabled = false;
                    }
                });

                //   }, 400);

                // }, 500)
            }, 1000)
        })

    }
    // group b changes
    // sideMenuCssSubmit() {
    //     // get current app data
    //     const appData = this.commonService.get_current_app_data();
    //     const appId = JSON.stringify(appData.id);

    //     const sideMenuCssDBColumn = 'app_side_menu_css_json_data';

    //     if (this.finallTabArray) {
    //         for (let i = 0; i < this.tabArrayCss.length; ++i) {
    //             if (this.tabArrayCss[i]['key'] == 'menuname') {
    //                 this.tabArrayCss[i]['value'] = this.finallTabArray;
    //             }
    //         }
    //     }

    //     // setTimeout(() => {
    //     // savemenucssflag
    //     for (let i = 0; i < this.arrowArrayCss.length; ++i) {
    //         if (this.arrowArrayCss[i].key == "backarrowcolor") {
    //             this.arrowArrayCss[i].value = this.menuIconCssColor;
    //         }
    //     }
    //     // setTimeout(() => {

    //     this.mainCssArray = {
    //         sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
    //         { 'subMenu': this.submenuArrayCss },
    //         { 'arrow': this.arrowArrayCss },
    //         { 'tabMenu': this.tabArrayCss }]
    //     };
    //     this.headerImgData = new FormData();

    //     if (this.sideMenuHeaderImgData) {
    //         const file: File = this.sideMenuHeaderImgData[0];
    //         this.headerImgData.append('headerImg', file);
    //     }

    //     if (this.oldHeaderImg) {
    //         this.headerImgDataMain.append('oldHeaderImg', this.oldHeaderImg[1]);
    //     }

    //     this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
    //     this.headerImgData.append('appId', appId);
    //     this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
    //     this.headerImgData.append('selMenuType', this.menuTypeDataSelection);

    //     if (this.oldMainImg) {
    //         this.headerImgData.append('oldMainImg', this.oldMainImg[1]);
    //     }

    //     this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => {
    //         this.rdata = JSON.parse(res);
    //         this.rstatus = this.rdata['status'];

    //         this.headerSideImg = this.rdata['sideMenuHeaderLogo'];
    //         this.oldMainImg = this.headerSideImg.split('headerImg/');

    //         const promise = new Promise((resolve) => {
    //             for (let i = 0; i < this.menuArrayCss.length; ++i) {
    //                 if (this.menuArrayCss[i]['key'] == 'sideMenuImg') {
    //                     this.menuArrayCss[i]['value'] = this.headerSideImg;
    //                 }
    //             }
    //             resolve(true);
    //         })

    //         promise.then(() => {

    //             this.mainCssArray = {
    //                 sideMenuCss: [{ 'mainMenu': this.menuArrayCss },
    //                 { 'subMenu': this.submenuArrayCss },
    //                 { 'arrow': this.arrowArrayCss },
    //                 { 'tabMenu': this.tabArrayCss }]
    //             };
    //             this.headerImgData = new FormData();

    //             // if(this.oldHeaderImg){
    //             //     this.headerImgDataMain.append('oldHeaderImg', this.oldHeaderImg[1]);
    //             // }

    //             this.headerImgData.append('data', JSON.stringify(this.mainCssArray));
    //             this.headerImgData.append('appId', appId);
    //             this.headerImgData.append('dbColumn', sideMenuCssDBColumn);
    //             this.headerImgData.append('selMenuType', this.menuTypeDataSelection);

    //             // if(this.oldMainImg){
    //             //     this.headerImgData.append('oldMainImg', this.oldMainImg[1]);
    //             // }


    //             this.commonService.filePostData(this.headerImgData, 'saveCssData').subscribe(res => { });
    //         }
    //         )

    //         if (this.rstatus == '1') {
    //             const success_message = this.rdata['message'];
    //             $(function () {
    //                 $.notify({
    //                     title: '',
    //                     message: success_message
    //                 }, {
    //                         type: 'success'
    //                     });
    //             });
    //         } else {
    //             const error_message = this.rdata['message'];
    //             $(function () {
    //                 $.notify({
    //                     title: '',
    //                     message: error_message
    //                 }, {
    //                         type: 'danger'
    //                     });
    //             });
    //         }
    //     });

    //     //   }, 400);

    //     // }, 500)
    // }

    // menu css
    sendMenuTypeVideoData(id, value, cssPropName, f: NgForm) {

        if (cssPropName == 'fontSize') {
            this.parentFontSize = value + 'px';
        }
        if (cssPropName == 'paddingLeft') {
            this.menuPaddingLeft = value + 'px';
        }
        if (cssPropName == 'paddingTop') {
            this.menuPaddingTop = value + 'px';
        }
        if (cssPropName == 'background color') {
            this.menuPaddingTop = value + 'px';
        }
        if (cssPropName == 'lineDividerColor') {

            this.menuArrayCss[id]['value'] = value;
            this.borderColor = value;
        }
        if (cssPropName == 'lineDividerHeight') {
            this.menuBorder = value + 'px solid' + this.borderColor;
            this.menuArrayCss[id]['value'] = value;
        }
        if (cssPropName == 'selectedColor') {
            this.menuArrayCss[id]['value'] = value;
            this.selectedColor = value;
            this.selectedColorSub = value;

        }
        if (cssPropName == 'selectedFontColor') {
            this.menuArrayCss[id]['value'] = value;
            this.selectedFontColor = value;
            this.selectedFontColorSub = value;
        }
        if (cssPropName == 'nonSelectedColor') {
            this.menuArrayCss[id]['value'] = value;
            this.menuArrayCss[11]['value'] = value;
            this.nonSelectedColor = value;
            this.nonSelectedColorSub = value;
        }
        if (cssPropName == 'nonSelectedFontColor') {
            this.menuArrayCss[id]['value'] = value;
            this.nonSelectedFontColor = value;
            this.nonSelectedFontColorSub = value;
        }

        if (cssPropName == 'selectedColorTab') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss[3] = value;
        }
        if (cssPropName == 'fontselectedColor') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss[4] = value;
        }
        if (this.menuFormRef.dirty === f.dirty) {

            this.menuFormBoolRef = true;
            // console.log('menuform bool')

        } else if (this.submenuFormRef.dirty === f.dirty) {

            this.submenuFormBoolRef = true;
            // console.log('submenu form bool')

        } else if (this.arrowmenuFormRef.dirty === f.dirty) {

            this.arrowmenuBoolRef = true;
            // console.log('arrow bool ref');

        } else if (this.tabmenuFormRef.dirty === f.dirty) {

            this.tabmenuFormBoolRef = true;
            // console.log('tabmenu bool')
        }
    }

    selectMenuFun(id, $event, cssPropName) {

        if (cssPropName == 'fonttype') {

            this.menuArrayCss[id]['value'] = $event.target.value;
            // this.subMenuCssData['fonttype'] = { 'font-family': $event.target.value };
            this.menuFontFamily = $event.target.value;
            // console.log(this.menuFontFamily);
        }

        if (cssPropName == 'position') {
            this.arrowArrayCss[id]['value'] = $event.target.value;

        }

    }

    onChangefontcolor(i, $event, cssPropName): any {
        this.submenuArrayCss[i]['value'] = $event
        this.colorData = $event;

        // menu form set dirty
        this.menuFormBoolRef = true;
    }

    onChangebackgroundcolor(i, $event, cssPropName, f: NgForm): any {

        if (cssPropName == 'borderBottom') {
            if (this.headerBorderSize) {
                this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid ' + $event;
            } else {
                this.subMenuHeaderBorderColorMob = '1px solid ' + $event;
            }
            this.subMenuHeaderBorderColor = $event
            this.menuArrayCss[i]['value'] = this.subMenuHeaderBorderColorMob;
        }
        if (cssPropName == 'borderBottomSize') {
            this.headerBorderSize = $event;
            let a = this.menuArrayCss[i]['value'].split('#');
            if (a[1]) {
                this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid #' + a[1];
            } else {
                this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid black';
            }
            this.menuArrayCss[i]['value'] = this.subMenuHeaderBorderColorMob;
        }
        // this.submenuArrayCss[i]['value'] = $event
        this.backgroundColorData = $event;
    }

    // submenu css
    submenuModelChange(id, value, cssPropName) {

        if (cssPropName == 'fontSize') {
            this.submenuParentFontSize = value + 'px';
        }
        if (cssPropName == 'paddingLeft') {
            this.submenuMenuPaddingLeft = value + 'px';
        }
        if (cssPropName == 'paddingTop') {
            this.submenuMenuPaddingTop = value + 'px';
        }
        if (cssPropName == 'borderBottom') {
            this.submenuBorder = value + 'px solid ' + this.submenuBorderColor;
        }
        if (cssPropName == 'borderColor') {
            this.menuArrayCss[id]['value'] = value;
            this.submenuBorderColor = value;
        }

        if (cssPropName == 'marginTop') {
            this.submenuMarginTop = value + 'px';
        }

        if (cssPropName == 'arrow padding left') {
            this.arrowArrayCss[id]['value'] = value;
            this.marginLeftArrow = value + "px";
        }

        if (cssPropName == 'fontsizetab') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss[0] = value + "px";
        }

        if (cssPropName == 'tabheight') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss[1] = value + "px";
        }

        if (cssPropName == 'bordertab') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss[2] = value + "px solid";
        }
    }

    submenuBorderChange(id, value, cssPropName, f: NgForm) {
        if (cssPropName == 'borderColor') {
            this.submenuArrayCss[id]['value'] = value;
            this.submenuBorderColor = value;
        }

        if (cssPropName == 'fontselectedColor') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss[4] = value;
        }

        if (cssPropName == 'separatorColor') {
            this.tabArrayCss[id]['value'] = value;
            this.tabCss[6] = value;
        }

        if (cssPropName == 'tabSelectedColor') {
            this.tabArrayCss[id]['value'] = value;
            // this.tabCss[7] = value;
            this.tabNonSelectedColor = value;
        }

        if (cssPropName == 'tabNonSelectedColor') {
            this.tabArrayCss[id]['value'] = value;
            // this.tabCss[8] = value;
            this.tabSelectedColor = value;
        }

        if (cssPropName == 'tabBackgroundColor') {
            this.tabArrayCss[id]['value'] = value;
            // this.tabCss[8] = value;
            this.tabCss[7] = value;
        }

        if (this.submenuFormRef && this.submenuFormRef.dirty === f.dirty) {
            this.submenuFormBoolRef = true;
        } else if (this.tabmenuFormRef && this.tabmenuFormRef.dirty === f.dirty) {
            this.tabmenuFormBoolRef = true;
        }
    }

    submenuSelectMenuFun(id, $event, cssPropName) {
        if (cssPropName == 'fonttype') {
            this.submenuArrayCss[id]['value'] = $event.target.value;
            this.submenuFontFamily = $event.target.value;
            // console.log(this.submenuFontFamily)
        }

        if (cssPropName == 'fonttypeTab') {
            this.tabArrayCss[id]['value'] = $event.target.value;
            this.tabCss[5] = $event.target.value;
        }
    }

    submenuOnChangefontcolor(i, $event, cssPropName): any {
        this.menuArrayCss[i]['value'] = $event
        this.submenuColorData = $event;
        // set dirty if any changes made in submenuform detect via callback fun
        // console.log('submenu bool');
        this.submenuFormBoolRef = true;
    }

    submenuOnChangebackgroundcolor(i, $event, cssPropName): any {
        this.submenuArrayCss[i]['value'] = $event
        this.submenuBackgroundColorData = $event;

        // set dirty if any changes made in submenuform detect via callback fun
        // console.log('submenu bool');
        this.submenuFormBoolRef = true;
    }

    // general menu css
    genralMenuOnChangefontcolor(i, $event, cssPropName, formRef: NgForm): any {

        if (cssPropName == 'backgroundColorMenu') {
            this.menuiconArrayCss[i]['value'] = $event;
            this.menuIconCssColor = $event;
            this.arrowArrayCss[5]['value'] = $event;
            // set general menufrom ref dirty
            this.menuLocationFormBoolRef = true;
        }

        if (cssPropName == 'backgroundColorHeader') {
            this.headerArrayCss[i]['value'] = $event;
            this.headerBackgroundColor = $event;
            // set general menufrom ref dirty
            this.menuLocationFormBoolRef = true;
        }

        if (cssPropName == 'headerbordercolor') {
            this.headerArrayCss[i]['value'] = $event;
            this.headerBorderColor = $event;
            // set general menufrom ref dirty
            this.menuLocationFormBoolRef = true;
        }

        if (cssPropName == 'statusbarcolor') {
            this.statusbarArrayCss[i]['value'] = $event;
            this.statusBarColorCss = $event;
            // set general menufrom ref dirty
            this.menuLocationFormBoolRef = true;
        }

        if (cssPropName == 'arrowColor') {

            $('.left_menu .arrow-down').css('border-top-color', $event);
            $('.left_menu .arrow-up').css('border-bottom-color', $event);
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;

        }

        if (cssPropName == 'toggleinner') {
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;
        }
        if (cssPropName == 'toggleouter') {
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;
        }
        if (cssPropName == 'backarrowcolor') {
            this.arrowArrayCss[i]['value'] = $event;
            // set arrow menufrom ref dirty
            this.arrowmenuBoolRef = true;
        }
    }

    generalCssChange(i, value, cssPropName) {

        if (cssPropName == 'borderbottom') {
            this.borderSize = value + 'px solid ' + this.headerBorderColor;
            let a = 40 - value;
            this.headerLogoWidth = a + 'px';
            this.headerLogoHeight = a + 'px';
        }

        if (cssPropName == 'height') {
            this.heightData = value + 'px';
        }
        // if general form dirty
        if (this.gFormRef.dirty) {
            this.menuLocationFormBoolRef = this.gFormRef.dirty;
        }
    }

    toggleMenuGeneral() {

        $('.sidemenuGeneral1').toggleClass('hide_menu');
        $('.sidemenuGeneral').toggleClass('left_view');
        if (this.logoHideFlagGeneral == true) {
            this.logoHideFlagGeneral = false;
        } else {
            this.logoHideFlagGeneral = true;
        }
    }

    toggleMenu() {
        $('.sidemenu1').toggleClass('hide_menu');
        $('.sidemenu').toggleClass('left_view');
        if (this.logoHideFlag == true) {
            this.logoHideFlag = false;
        } else {
            this.logoHideFlag = true;
        }
    }

    toggleMenuGeneralDefault() {
        // $('.mob_header')
        // mob_header:     margin-left: 160px-> 0
        //
        // $('.mob_header').;
        // $('.left_menu').removeClass('sidemenuGeneral1');

    }
    toggleMenuHeaderDefault() {
        if (this.menuType == 1 || this.menuType == undefined) {
            $('.sidemenu1').addClass('hide_menu');
            $('.sidemenu').addClass('left_view');
            this.logoHideFlag = false;
            this.menuIconShow = true;
        }
        if (this.menuType == 2) {
            $('.sidemenu1').removeClass('hide_menu');
            $('.sidemenu').removeClass('left_view');
            this.logoHideFlag = true;
            this.menuIconShow = false;
        }

    }
    menuDownGeneral(i) {
        const className = 'arrowDownGeneral' + i;
        const subClassName = 'subMenuGeneral' + i;
        $('.' + subClassName).removeClass('childDisplayNone');
        if ($('#' + className).hasClass('arrow-down')) {

            $('#' + className).removeClass('arrow-down');
            $('#' + className).addClass('arrow-up');
            $('.' + subClassName).addClass('toggleChild');

            // $('#'+className).css({"border-left":"15px !important;"});

        } else {

            $('.' + subClassName).removeClass('toggleChild')
            $('#' + className).removeClass('arrow-up');
            $('#' + className).addClass('arrow-down');

        }
    }
    menuDown(i) {
        const className = 'arrowDown' + i;
        const subClassName = 'subMenu' + i;
        $('.' + subClassName).removeClass('childDisplayNone');
        if ($('#' + className).hasClass('arrow-down')) {

            $('#' + className).removeClass('arrow-down');
            $('#' + className).addClass('arrow-up');
            $('.' + subClassName).addClass('toggleChild');

            // $('#'+className).css({"border-left":"15px !important;"});

        } else {

            $('.' + subClassName).removeClass('toggleChild')
            $('#' + className).removeClass('arrow-up');
            $('#' + className).addClass('arrow-down');

        }
    }

    menuColorChange(fontColor, backgroundColor) {
        // if(fontColor == this.selectedFontColor || fontColor == this.nonSelectedFontColorSub){
        //     this.selectedFontColor = this.nonSelectedFontColorSub;
        // } else {
        //     this.nonSelectedFontColor = this.selectedFontColorSub;
        // }

        // if(backgroundColor == this.selectedColor || backgroundColor == this.nonSelectedColorSub){
        //     this.selectedColor = this.nonSelectedColorSub;
        // } else {
        //     this.nonSelectedColor = this.selectedColorSub;
        // }
    }

    subMenuCollapseOpen() {
        if (this.confirmFlag == false) {
            this.confirmFlag = true;
        } else {
            this.confirmFlag = false;
        }
    }

    selectMenuChange(i, value) {
        if (i == 0) {
            this.iconOne = value;
            this.tabMenuData = [{ menuName: this.menuJson[0]['menu_name'], icon: value }]
            this.assignTabMenuIcon(0, this.tabMenuData);
        }
        if (i == 1) {
            this.iconTwo = value;
            this.tabMenuData = [{ menuName: this.menuJson[1]['menu_name'], icon: value }]
            this.assignTabMenuIcon(1, this.tabMenuData);
        }
        if (i == 2) {
            this.iconThree = value;
            this.tabMenuData = [{ menuName: this.menuJson[2]['menu_name'], icon: value }]
            this.assignTabMenuIcon(2, this.tabMenuData);

        }
        if (i == 3) {
            this.iconFour = value;
            this.tabMenuData = [{ menuName: this.menuJson[3]['menu_name'], icon: value }]
            this.assignTabMenuIcon(3, this.tabMenuData);

        }
        if (i == 4) {
            this.iconFive = value;
            this.tabMenuData = [{ menuName: this.menuJson[4]['menu_name'], icon: value }]
            this.assignTabMenuIcon(4, this.tabMenuData);
        }
    }

    assignTabMenuIcon(id, value) {
        this.finallTabArray[id] = value;
    }

    menuClick(menu_type, jsonData, isSidemenu) {
        this.listFlag = false;
        this.videoList = false;

        if (isSidemenu == 2) {
            if (jsonData.children) {
                for (let i = 0; i < jsonData.children.length; ++i) {

                    if (jsonData.children[i].menu_type == 9) {
                        const url = JSON.parse(jsonData.children[i].menu_type_json_data);
                        if (url) {
                            this.listFlag = true;
                            this.levelThreeData[i] = { name: jsonData.children[i].menu_name, url: url.web_url };
                        }
                    }
                }
            }

        }
        if (isSidemenu == undefined) {
            if (menu_type == 2) {
                if (jsonData.menu_type_json_data) {
                    if (jsonData.menu_type_json_data.type == "video") {
                        this.videoList = true;
                        const key = 'AIzaSyDQJOsabHfciuqqbPVapUbx1YIqNvnSdTE';
                        const playlistId = "PLwO-rsGhvb7FrKv8kvz8eZ0a5aRtgs6se";
                        this.commonService.getVideoInfo(key, playlistId);
                        setTimeout(() => {
                            // console.log(this.commonService.youtubeJsonData);
                            let allVideoData = JSON.parse(this.commonService.youtubeJsonData);
                            this.videoDataFinal = allVideoData['items'];

                        }, 1500);
                    }
                }
            }
        }

        $('.sidemenu1').removeClass('hide_menu');
        $('.sidemenu').removeClass('left_view');
        this.logoHideFlag = true;
    }

    videoPlay(videoId) {

    }
    /**
    * canDeactivate Implemetation
    */
    canDeactivate(): boolean | Promise<boolean> {
        // console.log(this.submenuFormBoolRef
        //     , 'submenu Bool', this.arrowmenuBoolRef
        //     , 'arrowmenubool ref', this.menuFormBoolRef, 'menulocation bool ref'
        //     , 'tabmenuboolref', this.tabmenuFormBoolRef
        //     , 'menulocationboolref', this.menuLocationFormBoolRef
        //     , 'gformref', this.gFormRef.dirty
        //     , 'submenuformeref', this.submenuFormRef.dirty
        //     , 'menuform ref', this.menuFormRef.dirty
        //     , 'arrowmenu ref', this.arrowmenuFormRef.dirty);
        if (this.submenuFormBoolRef
            || this.arrowmenuBoolRef
            || this.menuFormBoolRef
            || this.tabmenuFormBoolRef
            || this.menuLocationFormBoolRef
            || (this.gFormRef && this.gFormRef.dirty)
            || (this.submenuFormRef && this.submenuFormRef.dirty)
            || (this.tabmenuFormRef && this.tabmenuFormRef.dirty)
            || (this.menuFormRef && this.menuFormRef.dirty)
            || (this.arrowmenuFormRef && this.arrowmenuFormRef.dirty)) {

            return new Promise<boolean>((resolve, reject) => {
                swal({
                    title: 'You didn`t save!',
                    text: 'You have unsaved changes, would you like to save?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-success',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, (isConfirm) => {
                    // if accept yes

                    if (isConfirm) {
                        // console.log(this.submenuFormRef);

                        if ((this.gFormRef && this.gFormRef.dirty) || this.menuLocationFormBoolRef) {
                            this.isGFormDirty().subscribe(d => {
                                resolve(true);
                                // this.menuLocationFormBoolRef = false;
                                // this.gFormRef.form.markAsPristine();
                            }, err => {
                                resolve(false);
                            })
                        }

                        // detect menu submenu arrow forms dirty state
                        if (
                            ((this.menuFormRef && this.menuFormRef.dirty) || this.menuFormBoolRef)
                            || ((this.submenuFormRef && this.submenuFormRef.dirty) || this.submenuFormBoolRef)
                            || ((this.arrowmenuFormRef && this.arrowmenuFormRef.dirty) || this.arrowmenuBoolRef)
                        ) {

                            // console.log('menuform dirty');
                            this.sideMenuCssSubmitObservable().subscribe(d => {
                                //  console.log(d);
                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(true);
                            }, err => {
                                // console.log(err);
                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(false);
                            }, () => {

                            });
                        }
                        // detect submenuform dirty state
                        // if (this.submenuFormRef && (this.submenuFormRef.dirty || this.submenuFormBoolRef)) {
                        //     // console.log('submenuform dirty');
                        //     this.sideMenuCssSubmitObservable().subscribe(d => {
                        //         console.log(d);
                        //         this.submenuFormBoolRef = false;
                        //     }, err => {
                        //         console.log(err);
                        //         this.submenuFormBoolRef = false;
                        //     }, () => {

                        //     });
                        // }
                        // // detect arrowmenuform dirty state
                        // if (this.arrowmenuFormRef && (this.arrowmenuBoolRef || this.arrowmenuFormRef.dirty)) {
                        //     console.log('arrowmenu form');
                        //     this.sideMenuCssSubmitObservable().subscribe(d => {
                        //         console.log(d);
                        //         this.arrowmenuBoolRef = false;
                        //     }, err => {
                        //         console.log(err);
                        //         this.arrowmenuBoolRef = false;
                        //     }, () => {

                        //     });
                        // }
                        // detect tabmenuform dirty state
                        if (this.tabmenuFormRef && (this.tabmenuFormBoolRef || this.tabmenuFormRef.dirty)) {
                            // console.log('tabmenu form');
                            this.sideMenuCssSubmitObservable().subscribe(d => {

                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(true);
                            }, err => {

                                // reset all dirty boolFormRef
                                this.resetAllDirtyStateMenuForm();
                                resolve(false);
                            }, () => {

                            });
                        }
                        // save form data if any of form is dirty

                    } else {
                        resolve(true);
                    }
                });
            });
        }
        return true;
    }
    appHeaderIconFileChange(event) {
        this.sideMenuHeaderImgData = event.target.files;
        this.sideMenuHeaderImgName = event.target.files[0].name;
        this.menuFormBoolRef = true;
        this.menuImageChangeFlag = true;
        let tempData = this.sideMenuHeaderImgName.split('.');

        setTimeout(() => {
            if (this.dropifyAppIconHeaderSize != false) {
                if ((tempData[1] == 'png' || tempData[1] == 'jpeg' || tempData[1] == 'jpg')) {
                    this.sideMenuCssSubmit();
                }
            } else {
                this.dropifyAppIconHeaderSize = true;
            }
        }, 1000)
    }
    appMainHeaderIconFileChange(event) {
        this.mainHeaderImgData = event.target.files;
        this.mainHeaderImgName = event.target.files[0].name;
        this.menuLocationFormBoolRef = true;
        this.genralImageChangeFlag = true;
        let tempData = this.mainHeaderImgName.split('.');
        // this.dropifyAppIconHeaderSize
        setTimeout(() => {
            if (this.dropifyAppIconHeaderSize != false) {
                if ((tempData[1] == 'png' || tempData[1] == 'jpeg' || tempData[1] == 'jpg')) {
                    this.homescreenSubmit();
                }
            } else {
                this.dropifyAppIconHeaderSize = true;
            }
        }, 1000)
    }
    /**
     * Private method to save while general css form data is dirty and use select to save
     * @param
     * @returns boolean
     */
    private isGFormDirty(): Observable<boolean> {
        return Observable.create((ob) => {
            this.homeScreenSubmitObservable().subscribe((d) => {
                // console.log(d);
                this.menuLocationFormBoolRef = false;
                // console.log('cc');
                this.gFormRef.form.markAsPristine();
                // swal({
                //     title: 'Successfully',
                //     text: 'Data Saved Successfully',
                //     type: 'success',
                //     confirmButtonClass: 'btn-success'
                // });

                // give redirection
                ob.next(true)
            }, (err) => {
                console.log(err);
                // stop redirection
                // resolve(false);
                this.menuLocationFormBoolRef = false;
                this.gFormRef.form.markAsPristine();
                ob.throw(err)
            }, () => {
                // console.log('obsever completed');
                ob.complete()
            })
        })
    }

    /**
     * Private method to save while submenyu css form data is dirty and use select to save
     * @param
     * @returns boolean
     */
    private resetAllDirtyStateMenuForm(): void {
        this.tabmenuFormBoolRef = false;
        this.menuFormBoolRef = false;
        this.arrowmenuBoolRef = false;
        this.submenuFormBoolRef = false;
        this.menuLocationFormBoolRef = false;

        //
        if (this.tabmenuFormRef) {
            this.tabmenuFormRef.form.markAsPristine();
        }
        if (this.menuFormRef || this.arrowmenuFormRef || this.submenuFormRef) {

            this.menuFormRef.form.markAsPristine();
            this.arrowmenuFormRef.form.markAsPristine();
            this.submenuFormRef.form.markAsPristine();
            this.gFormRef.form.markAsPristine();
        }
    }

    /**
     * Method to call isCssDataExist API
     */
    callablePromiseAPI(): Observable<any> {

        const appData = this.commonService.get_current_app_data();
        const appId = JSON.stringify(appData.id);
        const appUniqId = JSON.stringify(appData.app_unique_id);
        const cssComponent = 'general_css';
        const generalCssDBColumn = 'app_general_css_json_data';
        const self = this;
        return Observable.create((observer) => {
            this.commonService.postData({
                'appId': appUniqId,
                'id': appId,
                'cssComponent': cssComponent,
                'dbColumn': generalCssDBColumn
            }, 'isCssDataExsist').subscribe(res => {

                this.cssJsonData = JSON.parse(res);
                this.cssJsonData = JSON.parse(res);
                this.menuiconArrayCss = JSON.parse(this.cssJsonData['menuicon_css']);
                this.headerArrayCss = JSON.parse(this.cssJsonData['header_css']);
                this.statusbarArrayCss = JSON.parse(this.cssJsonData['statusbar_css']);
                this.commonCssJsonData = [];

                for (let i = 0; i < this.menuiconArrayCss.length; ++i) {
                    if (this.menuiconArrayCss[i]['key'] == 'backgroundColorMenu') {
                        this.menuIconCssColor = this.menuiconArrayCss[i]['value'];
                    }
                }

                for (let i = 0; i < this.headerArrayCss.length; ++i) {

                    if (this.headerArrayCss[i]['key'] == 'height') {
                        this.heightData = this.headerArrayCss[i]['value'] + 'px';
                    }

                    if (this.headerArrayCss[i]['key'] == 'borderbottom') {
                        this.borderSize = this.headerArrayCss[i]['value'] + 'px solid';
                    }

                    if (this.headerArrayCss[i]['key'] == 'background color border') {
                        this.headerBorderColor = this.headerArrayCss[i]['value'];
                    }

                    if (this.headerArrayCss[i]['key'] == 'background color') {
                        this.headerBackgroundColor = this.headerArrayCss[i]['value'];
                    }
                    // group b changes
                    if (this.headerArrayCss[i]['key'] == 'headerIcon') {
                        if (this.headerArrayCss[i]['value']) {
                            this.headerMainImg = this.headerArrayCss[i]['value'];
                            var a = this.headerArrayCss[i]['value'];
                            this.generalImgUrl = a;
                        } else {
                            this.headerMainImg = this.pathToDefaultImg;
                            var a = this.pathToDefaultImg;
                            this.generalImgUrl = a;
                        }
                        this.oldHeaderImg = this.headerMainImg.split('headerImg/');
                        if (this.headerMainImg == '') {
                            localStorage.setItem('headerMainImg', this.appIconUrl);
                            // this.msgService.sendMessage(this.appIconUrl);
                            $(function () {
                                const drEventTwo = $('#app_iconHeader').dropify({
                                    defaultFile: this.appIconUrl,
                                    messages: {
                                        'default': 'Drag and drop a file here or click',
                                        'replace': 'Drag and drop or click to replace',
                                        'remove': 'Remove',
                                        'error': ''
                                    },
                                    error: {
                                        'fileSize': 'The file size is too big ({{ value }} max).',
                                        'minWidth': 'The image width is too small ({{ value }}px min).',
                                        'maxWidth': 'The image width is too big ({{ value }}px max).',
                                        'minHeight': 'The image height is too small ({{ value }}px min).',
                                        'maxHeight': 'The image height is too big ({{ value }}px max).',
                                        'imageFormat': 'The image format is not allowed ({{ value }} only).'
                                    },
                                    tpl: {
                                        wrap: '<div class="dropify-wrapper"></div>',
                                        loader: '<div class="dropify-loader"></div>',
                                        message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                                        preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                                        filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                                        clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                                        errorLine: '<p class="dropify-error">{{ error }}</p>',
                                        errorsContainer: '<div class="dropify-errors-container">The height of the image exceeds 500 pixels and the width of the image exceeds 500 pixels</div>'
                                    }
                                });

                                //Please upload image between 100 to 500 dimensions

                                // this.domloaded = false;
                                // drEventTwo.on('dropify.error.fileSize', function (event, element) {
                                //     $('.header-icon-dropify .dropify-errors-container').html('The file size is too big (3M max).');
                                // });

                                // For Dropify size Error handle

                                drEventTwo.on('dropify.error.maxWidth', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.minWidth', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.minHeight', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.maxHeight', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });


                            })
                            this.handlerTimestart.subscribe(() => {
                                // NProgress.done();
                                observer.next('imgLoaded');
                                observer.complete();
                            });
                        } else {
                            // this.generalFlag = false;
                            //  this.domloaded = false;
                            // console.log(this.domloaded);
                            $(function () {
                                localStorage.setItem('headerMainImg', a);
                                // this.msgService.sendMessage(a);
                                const drEventTwo = $('#app_iconHeader').dropify({
                                    defaultFile: a,
                                    messages: {
                                        'default': 'Drag and drop a file here or click',
                                        'replace': 'Drag and drop or click to replace',
                                        'remove': 'Remove',
                                        'error': ''
                                    },
                                    error: {
                                        'fileSize': 'The file size is too big ({{ value }} max).',
                                        'minWidth': 'The image width is too small ({{ value }}px min).',
                                        'maxWidth': 'The image width is too big ({{ value }}px max).',
                                        'minHeight': 'The image height is too small ({{ value }}px min).',
                                        'maxHeight': 'The image height is too big ({{ value }}px max).',
                                        'imageFormat': 'The image format is not allowed ({{ value }} only).'
                                    },
                                    tpl: {
                                        wrap: '<div class="dropify-wrapper"></div>',
                                        loader: '<div class="dropify-loader"></div>',
                                        message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                                        preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                                        filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                                        clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                                        errorLine: '<p class="dropify-error">{{ error }}</p>',
                                        errorsContainer: '<div class="dropify-errors-container">The Height of the image exceeds 500 pixels and the width of the image exceeds 500 pixels</div>'
                                    }
                                });

                                // drEventTwo.on('dropify.error.fileSize', function (event, element) {
                                //     $('.header-icon-dropify .dropify-errors-container').html('The file size is too big ( 3M max).');
                                // });

                                // For Dropify size Error handle

                                drEventTwo.on('dropify.error.maxWidth', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.minWidth', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.minHeight', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                                drEventTwo.on('dropify.error.maxHeight', function (event, element) {
                                    self.dropifyAppIconHeaderSize = false;
                                });

                            });
                            // this.generalFlag = true;
                            this.handlerTimestart.subscribe(() => {
                                // NProgress.done();
                                observer.next('imgLoaded');
                                observer.complete();
                            });
                        }
                    }
                }
                for (let i = 0; i < this.statusbarArrayCss.length; ++i) {
                    if (this.statusbarArrayCss[i]['key'] == 'background color') {
                        this.statusBarColorCss = this.statusbarArrayCss[i]['value'];
                        if (this.statusBarColorCss == '') {
                            this.statusBarColorCss = '#000';
                        }
                    }
                }
            });
            //  this.generalFlag = false;
        })
    }
    /**
     * method implementation to call isCssDataExist API
     */
    calllableisCssDataExist(): Promise<boolean> {
        const appData = this.commonService.get_current_app_data();
        const appUniqId = JSON.stringify(appData.app_unique_id);
        const sidemenuCssComponent = 'side_menu_css';
        const sideMenuCssDBColumn = 'app_side_menu_css_json_data';
        const appId = JSON.stringify(appData.id);
        const self = this;
        const isCssDataExsistJSON = {
            'appId': appUniqId,
            'id': appId,
            'cssComponent': sidemenuCssComponent,
            'dbColumn': sideMenuCssDBColumn
        };
        return new Promise((resolve, reject) => {
            this.commonService.postData(isCssDataExsistJSON, 'isCssDataExsist').subscribe(res => {

                this.allMenuData = JSON.parse(res);

                this.submenuArrayCss = JSON.parse(this.allMenuData['submenu css']);
                this.arrowArrayCss = JSON.parse(this.allMenuData['arrow css']);
                this.menuArrayCss = JSON.parse(this.allMenuData['menu css']);
                this.tabArrayCss = JSON.parse(this.allMenuData['tab css']);
                this.menuCssJsonData = [];

                setTimeout(() => {
                    // fontDataTab
                    this.fontDataTab = this.tabArrayCss[2].value;
                    if (this.fontDataTab == '') {
                        this.fontDataTab = 'Arial';
                        $('#l13').val(this.fontDataTab).trigger('change');
                    }
                    this.tabCss[5] = this.tabArrayCss[2].value;

                    // to prevent length error
                    if (this.tabArrayCss && this.tabArrayCss[7]) {
                        for (let k = 0; k < this.tabArrayCss[7].length; k++) {

                            if (k === 0) {

                                if (this.tabArrayCss[7][k].icon) {
                                    this.iconOne = this.tabArrayCss[7][k].icon
                                    this.selectedArray[0] = this.tabArrayCss[7][k].icon
                                } else {
                                    this.iconOne = 'ios-home';
                                    this.selectedArray[0] = 'ios-home';
                                }
                            }
                            if (k === 1) {
                                if (this.tabArrayCss[7][k].icon) {
                                    this.iconTwo = this.tabArrayCss[7][k].icon
                                    this.selectedArray[1] = this.tabArrayCss[7][k].icon;
                                } else {
                                    this.iconTwo = 'ios-home';
                                    this.selectedArray[1] = 'ios-home'
                                }
                            }
                            if (k === 2) {
                                if (this.tabArrayCss[7][k].icon) {
                                    this.iconThree = this.tabArrayCss[7][k].icon
                                    this.selectedArray[2] = this.tabArrayCss[7][k].icon
                                } else {
                                    this.iconThree = 'ios-home';
                                    this.selectedArray[2] = 'ios-home';
                                }
                            }
                            if (k === 3) {
                                if (this.tabArrayCss[7][k].icon) {
                                    this.iconFour = this.tabArrayCss[7][k].icon
                                    this.selectedArray[3] = this.tabArrayCss[7][k].icon
                                } else {
                                    this.iconFour = 'ios-home';
                                    this.selectedArray[3] = 'ios-home'
                                }
                            }
                            if (k === 4) {
                                if (this.tabArrayCss[7][k].icon) {
                                    this.iconFive = this.tabArrayCss[7][k].icon
                                    this.selectedArray[4] = this.tabArrayCss[7][k].icon
                                } else {
                                    this.iconFive = 'ios-home';
                                    this.selectedArray[4] = 'ios-home';
                                }
                            }
                        }
                    }
                    for (let i = 0; i < this.tabArrayCss.length; ++i) {

                        if (this.tabArrayCss[i]['key'] == 'menuname') {
                            for (let j = 0; j < this.tabArrayCss[i]['value'].length; ++j) {
                                for (let k = 0; k < this.tabArrayCss[i]['value'][j].length; ++k) {

                                    if (j === 0) {
                                        this.iconOne = this.tabArrayCss[i]['value'][j][k]['icon'];
                                        this.selectedArray[0] = this.iconOne;
                                    }
                                    if (j === 1) {
                                        this.iconTwo = this.tabArrayCss[i]['value'][j][k]['icon'];
                                        this.selectedArray[1] = this.iconTwo;
                                    }
                                    if (j === 2) {
                                        this.iconThree = this.tabArrayCss[i]['value'][j][k]['icon'];
                                        this.selectedArray[2] = this.iconThree;
                                    }
                                    if (j === 3) {
                                        this.iconFour = this.tabArrayCss[i]['value'][j][k]['icon'];
                                        this.selectedArray[3] = this.iconFour;
                                    }
                                    if (j === 4) {
                                        this.iconFive = this.tabArrayCss[i]['value'][j][k]['icon'];
                                        this.selectedArray[4] = this.iconFive;
                                    }
                                }
                            }
                        }
                        if (this.tabArrayCss[i]['key'] == 'fontsizetab') {
                            this.tabCss[0] = this.tabArrayCss[i]['value'] + 'px';
                        }
                        if (this.tabArrayCss[i]['key'] == 'backgroundColor') {
                            this.tabCss[4] = this.tabArrayCss[i]['value'];
                        }
                        if (this.tabArrayCss[i]['key'] == 'bordertab') {
                            this.tabCss[2] = this.tabArrayCss[i]['value'] + 'px solid';
                        }
                        if (this.tabArrayCss[i]['key'] == 'borderColor') {
                            this.tabCss[6] = this.tabArrayCss[i]['value'];
                        }
                        if (this.tabArrayCss[i]['key'] == 'tabheight') {
                            this.tabCss[1] = this.tabArrayCss[i]['value'] + 'px';
                        }

                        if (this.tabArrayCss[i]['key'] == 'tabSelectedColor') {
                            this.tabNonSelectedColor = this.tabArrayCss[i]['value'];
                        }

                        if (this.tabArrayCss[i]['key'] == 'tabNonSelectedColor') {
                            this.tabSelectedColor = this.tabArrayCss[i]['value'];
                        }

                        if (this.tabArrayCss[i]['key'] == 'tabBackgroundColor') {
                            this.tabCss[7] = this.tabArrayCss[i]['value'];
                        }

                    }
                }, 2000);

                setTimeout(() => {
                    const handlerTimestart = Observable.timer(2000);
                    for (let i = 0; i < this.arrowArrayCss.length; ++i) {

                        if (this.arrowArrayCss[i]['key'] == 'arrowColor') {
                            const clr = this.arrowArrayCss[i]['value'];
                            handlerTimestart.subscribe(() => {
                                $(function () {
                                    $('.left_menu .arrow-down').css("border-top", ' 8px solid ' + clr);
                                });
                            });
                        }
                        if (this.arrowArrayCss[i]['key'] == 'arrowColor') {

                            const clr = this.arrowArrayCss[i]['value'];
                            handlerTimestart.subscribe(() => {
                                $(function () {
                                    $('.left_menu .arrow-down').css("border-top", ' 8px solid ' + clr);
                                });
                            });
                        }
                        if (this.arrowArrayCss[i]['key'] == 'padding left') {
                            this.menuPaddingTop = this.arrowArrayCss[i]['value'] + "px";
                        }
                        if (this.arrowArrayCss[i]['key'] == 'size') {
                            this.menuPaddingTop = this.arrowArrayCss[i]['value'] + "px";
                        }
                        if (this.arrowArrayCss[i]['key'] == 'position') {
                            this.positionData = this.arrowArrayCss[i]['value'];
                        }
                    }
                }, 200);

                for (let i = 0; i < this.submenuArrayCss.length; ++i) {

                    if (this.submenuArrayCss[i]['key'] == 'fontSize') {
                        this.submenuParentFontSize = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'paddingLeft') {
                        this.submenuMenuPaddingLeft = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'paddingTop') {
                        this.submenuMenuPaddingTop = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'marginTop') {
                        this.submenuMarginTop = this.submenuArrayCss[i]['value'] + "px";
                    }
                    if (this.submenuArrayCss[i]['key'] == 'borderBottom') {
                        this.submenuBorder = this.submenuArrayCss[i]['value'] + 'px solid';
                    }
                    if (this.submenuArrayCss[i]['key'] == 'borderColor') {
                        this.submenuBorderColor = this.submenuArrayCss[i]['value'];
                    }
                    if (this.submenuArrayCss[i]['key'] == 'color') {
                        this.submenuColorData = this.submenuArrayCss[i]['value'];
                    }
                    if (this.submenuArrayCss[i]['key'] == 'fontName') {

                        this.submenuFontFamily = this.submenuArrayCss[i]['value'];
                        setTimeout(() => {
                            $('#submenuSelect').val(this.submenuFontFamily).trigger('change');
                        }, 1000);

                    }
                    if (this.submenuArrayCss[i]['key'] == 'backgroundColor') {
                        this.submenuBackgroundColorData = this.submenuArrayCss[i]['value'];
                    }
                }

                for (let i = 0; i < this.menuArrayCss.length; ++i) {

                    if (this.menuArrayCss[i]['key'] == 'fontSize') {
                        this.parentFontSize = this.menuArrayCss[i]['value'] + 'px';
                    }
                    if (this.menuArrayCss[i]['key'] == 'paddingLeft') {
                        this.menuPaddingLeft = '';
                        // this.menuArrayCss[i]['value'] + 'px';
                    }
                    if (this.menuArrayCss[i]['key'] == 'paddingTop') {
                        this.menuPaddingTop = this.menuArrayCss[i]['value'] + 'px';
                    }
                    if (this.menuArrayCss[i]['key'] == 'borderBottom') {
                        // this.menuBorder = this.menuArrayCss[i]['value'] + 'px solid';
                        this.subMenuHeaderBorderColor = this.menuArrayCss[i]['value'];
                        this.sideMenuBorderColor = this.menuArrayCss[i]['value'];
                        const a = this.sideMenuBorderColor.split('#');
                        this.subMenuHeaderBorderColor = '#' + a[1];

                        const b = a[0].split('px');
                        this.headerBorderSize = b[0];

                        if (this.subMenuHeaderBorderColor === '#undefined') {
                            this.subMenuHeaderBorderColor = '#ffffff';
                        }

                        this.subMenuHeaderBorderColorMob = this.headerBorderSize + 'px solid ' + this.subMenuHeaderBorderColor;

                    }
                    if (this.menuArrayCss[i]['key'] == 'lineDividerColor') {
                        this.borderColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'lineDividerHeight') {
                        this.menuBorder = this.menuArrayCss[i]['value'] + 'px solid ';
                    }
                    if (this.menuArrayCss[i]['key'] == 'backgroundColor') {
                        // this.submenuColorData = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'fontName') {
                        this.menuFontFamily = this.menuArrayCss[i]['value'];
                        if (this.menuFontFamily) {
                            if (this.menuFontFamily.indexOf('#') == 0) {
                                setTimeout(() => {
                                    $('#menuSelectId').val('Arial').trigger('change');
                                }, 1000);
                            } else {
                                setTimeout(() => {
                                    $('#menuSelectId').val(this.menuFontFamily).trigger('change');
                                }, 1000);
                            }
                        } else {
                            setTimeout(() => {
                                $('#menuSelectId').val('Arial').trigger('change');
                            }, 1000);
                        }

                    }
                    if (this.menuArrayCss[i]['key'] == 'sidemenubackcolor') {
                        this.submenuBackgroundColorData = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'selectedColor') {
                        this.selectedColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'selectedFontColor') {
                        this.selectedFontColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'nonSelectedColor') {
                        this.nonSelectedColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'nonSelectedFontColor') {
                        this.nonSelectedFontColor = this.menuArrayCss[i]['value'];
                    }
                    if (this.menuArrayCss[i]['key'] == 'nonSelectedFontColor') {
                        this.nonSelectedFontColor = this.menuArrayCss[i]['value'];
                    }
                    // group b Changes
                    if (this.menuArrayCss[i]['key'] == 'sideMenuImg') {
                        this.headerSideImg = this.menuArrayCss[i]['value'];
                        this.oldMainImg = this.headerSideImg.split('headerImg/');
                        this.menuBorder = this.menuBorder + "" + this.borderColor;
                        setTimeout(() => {
                            if (this.menuArrayCss[i]['value']) {
                                this.headerSideImg = this.menuArrayCss[i]['value'];
                                var a = this.menuArrayCss[i]['value'];
                                this.generalImgUrl = a;
                            } else {
                                this.headerSideImg = this.pathToDefaultImg;
                                var a = this.pathToDefaultImg;
                                this.generalImgUrl = a;
                            }
                            // const a = this.menuArrayCss[i]['value'];

                            if (this.headerSideImg == '') {

                                $(function () {

                                    const drEventTwo = $('#app_iconSide').dropify({
                                        defaultFile: this.appIconUrl,
                                        messages: {
                                            'default': 'Drag and drop a file here or click',
                                            'replace': 'Drag and drop or click to replace',
                                            'remove': 'Remove',
                                            'error': ''
                                        },
                                        error: {
                                            'fileSize': 'The file size is too big ({{ value }} max).',
                                            'minWidth': 'The image width is too small ({{ value }}px min).',
                                            'maxWidth': 'The image width is too big ({{ value }}px max).',
                                            'minHeight': 'The image height is too small ({{ value }}px min).',
                                            'maxHeight': 'The image height is too big ({{ value }}px max).',
                                            'imageFormat': 'The image format is not allowed ({{ value }} only).'
                                        },
                                        tpl: {
                                            wrap: '<div class="dropify-wrapper"></div>',
                                            loader: '<div class="dropify-loader"></div>',
                                            message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                                            preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                                            filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                                            clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                                            errorLine: '<p class="dropify-error">{{ error }}</p>',
                                            errorsContainer: '<div class="dropify-errors-container">The height of the image exceeds 500 pixels and the width of the image exceeds 500 pixels</div>'
                                        }
                                    });

                                    // drEventTwo.on('dropify.error.fileSize', function (event, element) {
                                    //     $('.menu-header-icon-dropify .dropify-errors-container').html('The file size is too big ( 3M max).');
                                    // });

                                    drEventTwo.on('dropify.error.maxWidth', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });

                                    drEventTwo.on('dropify.error.minWidth', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });

                                    drEventTwo.on('dropify.error.minHeight', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });

                                    drEventTwo.on('dropify.error.maxHeight', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });

                                })
                            } else {
                                $(function () {

                                    const drEventTwo = $('#app_iconSide').dropify({
                                        defaultFile: a,
                                        messages: {
                                            'default': 'Drag and drop a file here or click',
                                            'replace': 'Drag and drop or click to replace',
                                            'remove': 'Remove',
                                            'error': ''
                                        },
                                        error: {
                                            'fileSize': 'The file size is too big ({{ value }} max).',
                                            'minWidth': 'The image width is too small ({{ value }}px min).',
                                            'maxWidth': 'The image width is too big ({{ value }}px max).',
                                            'minHeight': 'The image height is too small ({{ value }}px min).',
                                            'maxHeight': 'The image height is too big ({{ value }}px max).',
                                            'imageFormat': 'The image format is not allowed ({{ value }} only).'
                                        },
                                        tpl: {
                                            wrap: '<div class="dropify-wrapper"></div>',
                                            loader: '<div class="dropify-loader"></div>',
                                            message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
                                            preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
                                            filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
                                            clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
                                            errorLine: '<p class="dropify-error">{{ error }}</p>',
                                            errorsContainer: '<div class="dropify-errors-container">The height of the image exceeds 500 pixels and the width of the image exceeds 500 pixels</div>'
                                        }
                                    });
                                    drEventTwo.on('dropify.error.fileSize', function (event, element) {
                                        $('.menu-header-icon-dropify .dropify-errors-container').html('The file size is too big ( 3M max).');
                                    });

                                    drEventTwo.on('dropify.error.maxWidth', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });

                                    drEventTwo.on('dropify.error.minWidth', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });

                                    drEventTwo.on('dropify.error.minHeight', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });

                                    drEventTwo.on('dropify.error.maxHeight', function (event, element) {
                                        self.dropifyAppIconHeaderSize = false;
                                    });
                                })
                            }

                        }, 1000)
                    }
                }

                // for (var i = 0; i < this.allMenuData[0]['subMenu'].length; ++i) {
                //     this.menuCssJsonData.push(this.allMenuData[0]['subMenu'][i]);
                // }
                // for (var j = 0; j < this.allMenuData[1]['mainMenu'].length; ++j) {
                //     this.menuCssJsonData.push(this.allMenuData[1]['mainMenu'][j]);
                // }
                resolve(true);
            })
        })

    }
    AfterMenuIconSelectPickerInit() {
        const self = this;

        this.commonService.getData('getMenuIcon').subscribe(res => {
            this.menuIconData = [{ iconData: JSON.parse(res), menuData: this.menuJson }];
            if (res) {
                setTimeout(() => {

                    function formatFA1(icon) {
                        if (!icon.id) {
                            return icon.text;
                        }
                        const $icon = $('<span></span>').append($('<i class="listing_icon ion-' + icon.id + ' "></i>').css({
                            'color': icon.text
                        })).append(icon.text);
                        return $icon;
                    };
                    $('#gyr_ind0').select2({
                        templateResult: formatFA1
                    });

                    $('#gyr_ind0').change(function (e) {
                        self.selectMenuChange('0', $(this).val());
                        self.menuOneVal = $(this).val();
                    })

                    function formatFA2(icon) {
                        if (!icon.id) {
                            return icon.text;
                        }
                        const $icon = $('<span></span>').append($('<i class="listing_icon ion-' + icon.id + ' "></i>').css({
                            'color': icon.text
                        })).append(icon.text);
                        return $icon;
                    };
                    $('#gyr_ind1').select2({
                        templateResult: formatFA2
                    });

                    $('#gyr_ind1').change(function (e) {
                        self.selectMenuChange('1', $(this).val());
                        self.menuTwoVal = $(this).val();
                    })

                    function formatFA3(icon) {
                        if (!icon.id) {
                            return icon.text;
                        }
                        const $icon = $('<span></span>').append($('<i class="listing_icon ion-' + icon.id + ' "></i>').css({
                            'color': icon.text
                        })).append(icon.text);
                        return $icon;
                    };
                    $('#gyr_ind2').select2({
                        templateResult: formatFA3
                    });

                    $('#gyr_ind2').change(function (e) {
                        self.selectMenuChange('2', $(this).val());
                        self.menuThreeVal = $(this).val();
                    })

                    function formatFA4(icon) {
                        if (!icon.id) {
                            return icon.text;
                        }
                        const $icon = $('<span></span>').append($('<i class="listing_icon ion-' + icon.id + ' "></i>').css({
                            'color': icon.text
                        })).append(icon.text);
                        return $icon;
                    };
                    $('#gyr_ind3').select2({
                        templateResult: formatFA4
                    });

                    $('#gyr_ind3').change(function (e) {
                        self.selectMenuChange('3', $(this).val());
                        self.menuFourVal = $(this).val();
                    })

                    function formatFA5(icon) {
                        if (!icon.id) {
                            return icon.text;
                        }
                        const $icon = $('<span></span>').append($('<i class="listing_icon ion-' + icon.id + ' "></i>').css({
                            'color': icon.text
                        })).append(icon.text);
                        return $icon;
                    };
                    $('#gyr_ind4').select2({
                        templateResult: formatFA5
                    });

                    $('#gyr_ind4').change(function (e) {
                        self.selectMenuChange('4', $(this).val());
                        self.menuFiveVal = $(this).val();
                    })

                }, 2000)
            }
        })
    }
}
