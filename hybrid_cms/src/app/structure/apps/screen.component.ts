import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';

import { CommonService } from './../../common.service';
import { SharedService } from './../../shared.service';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { MessageService } from './../../message.service';
import * as moment from 'moment';




declare var $: any;
declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

@Component({
  selector: 'cat-page',
  templateUrl: './screen.component.html',
})

export class AppsScreenComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('basicInformationForm') basicInfo_form: NgForm;
  @ViewChild('AppIconForm') appicon_form: NgForm;
  @ViewChild('splashScreenForm') splashScreen_form: NgForm;
  @ViewChild('sponsorSplashForm') sponsorSplash_form: NgForm;
  @ViewChild('AddScreenShotForm') AddScreenShot_form: NgForm;
  @ViewChild('AddIpadScreenShotForm') AddIpadScreenShot_form: NgForm;
  @ViewChild('appIconSave') appIconSaveRef: ElementRef;
  @ViewChild('appSplashSave') appSplashSaveRef: ElementRef;
  @ViewChild('appSponsorSplashSave') appSponsorSplashSaveRef: ElementRef;
  @ViewChild('appInformationSave') appInformationSaveRef: ElementRef;
  @ViewChild('screenShotSave') screenShotSaveSaveRef: ElementRef;
  @ViewChild('iphnSaveOrderBtn') iphnSaveOrderBtnRef: ElementRef;
  @ViewChild('ipadBtnSave') ipadBtnSaveRef: ElementRef;
  @ViewChild('ipadBtnSaveMain') ipadBtnSaveMainRef: ElementRef;



  // dirty state form ref for app icon
  public boolAppIconForm: boolean;
  // dirty state form ref for splash screen
  public boolSplashScreenForm: boolean;
  // dirty state form ref for sponser splash screen
  public boolSponserSplashScreenForm: boolean;
  // dirty state form ref for screenshot
  public boolScreenShotForm: boolean;
  // dirty state form ref for ipad screenshot
  public boolIpadScreenShotForm: boolean;

  public sponsorsplashform: FormGroup;
  public addscreenshotform: FormGroup;
  public addipadscreenshotform: FormGroup;
  public addPreviewImg: FormGroup;
  public spscreenform: FormGroup;
  public biform: FormGroup;
  public appiconform: FormGroup;
  public gaform: FormGroup;

  fontFamilyVar: any;
  fontSizeVar: any;
  industryData: any;
  appNameLengthErrMsg: any;
  appDescLengthErrMsg: any;
  categoryDataFlag: any;
  mobileNumberErrLen: any;
  emailErrCheck: any;
  urlErrCheck: any;
  disableGenralFlag: any;
  marketingUrlErrCheck: any;
  marketing_website: any;
  appLengthCnt: any;
  app_keyword: any;
  appNameSpaceCheck: any;
  promotionalTextSpaceCheck: any;
  appDescriptionSpaceCheck: any;
  biformFlag: any;

  public removeScreenShotform = {
    'value': {
      'id': '',
      'add_screenshot': '',
      'order': ''
    }
  };



  public changeOrderScreenShotform = {
    'value': {
      'id': '',
      'order_data': '',
      'app_id': ''
    }
  };

  public changeOrderIpadScreenShotform = {
    'value': {
      'id': '',
      'order_data': '',
      'app_id': ''
    }
  };

  public removeIpadScreenShotform = {
    'value': {
      'id': '',
      'add_screenshot': '',
      'order': ''
    }
  };

  // public spsplashform: FormGroup;

  currentAppData = [];
  rdata: any;
  storeData = [];
  rstatus = '';
  fileList: FileList;
  app_icon_data = '';
  splash_screen_data = '';
  sponsor_splash_data = '';
  basic_information_data = '';
  google_analytic_data = '';
  add_screenshot_data = '';
  add_ipad_screenshot_data: any;
  splash_screen_section_data = '';
  app_icon_section_data = '';
  sponsor_splash_section_data = '';
  basic_information_section_data = [];
  google_analytic_section_data = [];
  add_screenshot_section_data = [];
  add_ipad_screenshot_section_data = [];
  add_screenshot_list_data = [];
  add_screenshot_list_ipad_data = [];

  industryTypeData: any;
  categoryTypeData: any;
  priceTypeData: any;

  fileName = '';
  is_file = false;
  is_bcImage_file = false;
  is_ssImage_file = false;
  is_assImage_file = false;
  is_as_IpadImage_file = false;
  emptyFileMsg = '';
  total_add_screenshot = 0;
  total_add_ipad_screenshot = 0;
  is_remove_screenshot_after_submit = false;
  is_remove_ipad_screenshot_after_submit = false;
  imageData: any;
  appImgUrl: any;
  splashImgUrl: any;
  sponsorSplashImgData: any;
  screenShortData: any;
  screenShortIpadData: any;
  downloadButtonFlag: any;
  buttonFlagImgDownload: any;
  buttonFlagIpadImgDownload: any;
  downloadImgButtonFlag: any;
  splashImgUrlFlag: any;
  appIndustryData: any;
  appIconUrl: any;
  priceData: any;
  categoryData: any;
  c: any;
  app_industry: any;
  app_category: any;
  app_price: any;
  langData: any;
  defaultLenData: any;
  secondryData: any;
  primaryData: any;
  mobileNumberErrCheck: any;
  appCnt: any;
  appDesLengthCnt: any;
  appDesCnt: any;
  appPromCnt: any;
  appPromLengthCnt: any;
  appPromLengthErrMsg: any;
  valueCategoryData: any;
  valueSecondryData: any;
  keywordCount: any;
  selectedFields: any;
  supportUrlErr: any;
  phoneNumberErrFlag: any;
  keywordErrMsg: any;
  appKeywordCnt: number;
  tempappKeywordCnt: number;
  appKeywordLengthCnt = true;
  appKeywordcLengthErrMsg: any;
  lenCount: any;
  mainKeywordLength = 100;
  fileListIcon: any;
  fileListSponsor: any;
  iconSave: any;
  blankSpaceAppName: any;
  blankSpacePramotionalText: any;
  blankSpaceDescriptionText: any;

  // set basic info

  tagArrayCharlen: number;

  tagKeyCharArr: string[];
  background_image_error = false;
  sponsor_splash_image_error = false;
  app_icon_error = true;
  add_screenshot_image_error = false;
  keywordReqMsgFlag: any;


  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private route: Router,
    private http: Http,
    private sharedService: SharedService,
    private msgService: MessageService) {
    this.appKeywordCnt = 100;
    this.tempappKeywordCnt = 100;
    this.lenCount = '';
    this.emailErrCheck = true;
    this.appLengthCnt = false;
    this.appPromLengthCnt = false;
    this.appDesLengthCnt = false;
    this.appKeywordLengthCnt = false;
    this.langData = [];
    this.screenShortData = [];
    this.screenShortIpadData = [];
    this.currentAppData = this.commonService.get_current_app_data();

    this.app_icon_data = this.currentAppData['basicDetail']['app_icon'];

    this.appImgUrl = this.app_icon_data['app_icon_original_url'];
    if (this.appImgUrl.indexOf('default') !== -1) {
      this.downloadImgButtonFlag = false;
    } else {
      this.downloadImgButtonFlag = true;
    }

    this.app_icon_section_data = JSON.parse(this.app_icon_data['section_json_data']);
    this.splash_screen_data = this.currentAppData['basicDetail']['splash_screen'];
    this.splashImgUrl = this.splash_screen_data['bc_image_original_url'];
    if (this.splashImgUrl.indexOf('default') != -1) {
      this.splashImgUrlFlag = false;
    } else {
      this.splashImgUrlFlag = true;
    }
    this.splash_screen_section_data = JSON.parse(this.splash_screen_data['section_json_data']);

    this.sponsor_splash_data = this.currentAppData['basicDetail']['sponsor_splash'];
    this.sponsorSplashImgData = this.sponsor_splash_data['sponsorsplash_image_original_url'];

    if (this.sponsorSplashImgData.indexOf('default') != -1) {
      this.downloadButtonFlag = false;
    } else {
      this.downloadButtonFlag = true;
    }
    this.sponsor_splash_section_data = JSON.parse(this.sponsor_splash_data['section_json_data']);

    this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
    this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);

    this.google_analytic_data = this.currentAppData['basicDetail']['google_analytic'];
    this.google_analytic_section_data = JSON.parse(this.google_analytic_data['section_json_data']);
    this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];

    this.msgService.sendMessage(this.currentAppData['basicDetail']['app_icon']['app_icon_thumb_url']);

    if (this.add_screenshot_data['add_screenshot_data'].length == 0) {
      this.buttonFlagImgDownload = true;
    } else {
      this.buttonFlagImgDownload = false;
      for (let i = 0; i < this.add_screenshot_data['add_screenshot_data'].length; ++i) {
        this.screenShortData.push(this.add_screenshot_data['add_screenshot_data'][i]['add_screenshot_original_url']);
      }
    }

    this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
    this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];
    this.total_add_screenshot = this.add_screenshot_data['order'];

    this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];

    if (this.add_ipad_screenshot_data['add_screenshot_data'].length == 0) {
      this.buttonFlagIpadImgDownload = true;
    } else {
      this.buttonFlagIpadImgDownload = false;
      for (let i = 0; i < this.add_ipad_screenshot_data['add_screenshot_data'].length; ++i) {
        this.screenShortIpadData.push(this.add_ipad_screenshot_data['add_screenshot_data'][i]['add_screenshot_original_url']);
      }
    }

    this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
    this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];
    this.total_add_ipad_screenshot = this.add_ipad_screenshot_data['order'];

    const iconData = this.currentAppData['basicDetail']['app_icon'];
    const app_icon = iconData.app_icon_thumb_url;
    if (app_icon) {
      this.appIconUrl = app_icon;
    }

    if (this.currentAppData['app_name']) {
      this.appLengthCnt = true;
      this.appCnt = 29 - this.currentAppData['app_name'].length;
    }

  }

  ngOnInit() {

    this.commonService.getData('getLangData').subscribe(res => {
      // console.log('js data: ');
      res = JSON.parse(res);
      for (let i = 0; i < res.length; ++i) {
        this.langData.push(res[i]['name']);
      }
    });


    // current component ref
    const self = this;

    let app_description = '';
    let contact_email = '';
    let default_language = '';

    let official_website = '';
    let copy_right = '';
    let app_price = '';
    let phone_number = '';
    let no_sec_display = '';
    let google_key = '';
    let is_bc_image = false;
    let bcimageInput = null;
    let ssimageInput = null;
    let imageInput = null;
    let app_category = null;
    let app_industry = '';
    let app_promotional = '';
    let app_keywords = '';


    // $(function () {

    $('.message_body').summernote({
      height: 200
      // placeholder: 'write here...'
    });

    $('[data-toggle=tooltip]').tooltip();

    setTimeout(() => {
      // $('.nav-item a[href="#splashscreen"]').tab('show');


      $('#app_keywords_tag').tagEditor({
        placeholder: 'Enter App Keywords',
        onChange: (field, editor, tags) => {
          const keywordValue = tags.length;
          // console.log(keywordValue);
          // console.log(tags);
          this.lenCount = 100 - keywordValue;
          //  self.keywordFun(this.lenCount);
          // self.keywordCharCount(tags);
          self.countkeywordLen(tags);
          // this.biformFlag = true;
          this.biform.markAsDirty();
        },
        beforeTagSave: (field, editor, tags, tag, val) => {
          this.addKeywordCount(val);
        },
        beforeTagDelete: (field, editor, tags, val) => {
          self.countkeywordLen(tags);
          // this.removeKeywordCount(val);
        }
      });

      jQuery('.select2-tags').on(
        'change',
        (e) => {
          // this._selectedFields = jQuery(e.target).val();

          // this._keywordCount = 100 - this._selectedFields.length;
          // console.log(this._keywordCount);
          // this._countFun();

        });

      $('#appicon .dropify-clear').html('X');
      // $('#us-phone-mask-input').value();
      jQuery('.select2-tags').select2();
      jQuery('.select2-tags').on(
        'change',
        (e) => {
          // this._selectedFields = jQuery(e.target).val();

          // this._keywordCount = 100 - this._selectedFields.length;
          // console.log(this._keywordCount);
          // this._countFun();

        });

      $('#us-phone-mask-input').mask('(000) 000-0000', { placeholder: '(___) ___-____' });
      $('.selectpicker').selectpicker('refresh');
      $('.select2-tags').select2({
        tags: true,
        tokenSeparators: [',', ' ']
      });

    }, 500);
    // });


    this.commonService.getData('getBasicInfo').subscribe(res => {

      res = JSON.parse(res);
      this.industryTypeData = res['industry_type'];
      this.categoryTypeData = res['category_type'];
      this.priceTypeData = res['price_type'];

      // this.app_industry = this.industryTypeData[0]['name'];
      // this.app_category = this.categoryTypeData[0]['name'];
      // this.app_price = this.priceTypeData[0]['name'];
    });


    // if(this.valueCategoryData == undefined){
    // this.valueCategoryData = false;
    // }
    // if(this.appPromLengthErrMsg == undefined){
    // this.appPromLengthErrMsg = true;
    // }
    // if(this.appDescLengthErrMsg == undefined){
    // this.appDescLengthErrMsg = true;
    // }
    // if(this.appKeywordcLengthErrMsg == undefined){
    // this.appKeywordcLengthErrMsg = true;
    // }
    // if(this.supportUrlErr == undefined){
    // this.supportUrlErr = true;
    // }
    // if(this.phoneNumberErrFlag == undefined){
    // this.phoneNumberErrFlag = true
    // }

    if (this.basic_information_section_data != null) {
      this.valueCategoryData = true;
      this.appPromLengthErrMsg = false;
      this.appDescLengthErrMsg = false;
      this.appKeywordcLengthErrMsg = false;
      this.supportUrlErr = false;
      this.phoneNumberErrFlag = false;
      this.disableGenralFlag = true;

      if (this.basic_information_section_data.hasOwnProperty('app_description')) {
        app_description = this.basic_information_section_data['app_description'];
        this.appDesLengthCnt = true;
        this.appDesCnt = 4000 - app_description.length;
      }
      if (this.basic_information_section_data.hasOwnProperty('contact_email')) {
        contact_email = this.basic_information_section_data['contact_email'];
      }
      if (this.basic_information_section_data.hasOwnProperty('default_language')) {
        default_language = this.basic_information_section_data['default_language'];
        this.defaultLenData = this.basic_information_section_data['default_language'];
      }
      if (this.basic_information_section_data.hasOwnProperty('app_keywords')) {
        app_keywords = this.basic_information_section_data['app_keywords'];
        this.appKeywordLengthCnt = true;
        // this.appKeywordCnt = 100 - app_keywords.length;
        const splitApp_keywords = app_keywords.split(',');
        this.countkeywordLen(splitApp_keywords);
        // console.log(app_keywords.split(','));
        // var a = [];
        // this.c = this.basic_information_section_data['app_keyword'].split(',');
      }
      if (this.basic_information_section_data.hasOwnProperty('official_website')) {
        official_website = this.basic_information_section_data['official_website'];
      }
      if (this.basic_information_section_data.hasOwnProperty('copy_right')) {
        copy_right = this.basic_information_section_data['copy_right'];
      }
      if (this.basic_information_section_data.hasOwnProperty('app_price')) {
        app_price = this.basic_information_section_data['app_price'];
        this.priceData = app_price;
        this.app_price = app_price;
      }
      if (this.basic_information_section_data.hasOwnProperty('phone_number')) {
        phone_number = this.basic_information_section_data['phone_number'];
      }
      if (this.basic_information_section_data.hasOwnProperty('app_category')) {
        app_category = this.basic_information_section_data['app_category'];
        this.categoryData = app_category;
        this.app_category = app_category;
      }
      if (this.basic_information_section_data.hasOwnProperty('app_industry')) {
        app_industry = this.basic_information_section_data['app_industry'];
        this.industryData = app_industry;
        this.app_industry = this.basic_information_section_data['app_industry'];
      }
      if (this.basic_information_section_data.hasOwnProperty('marketing_website')) {
        this.marketing_website = this.basic_information_section_data['marketing_website'];
      }
      if (this.basic_information_section_data.hasOwnProperty('app_promotional')) {
        app_promotional = this.basic_information_section_data['app_promotional'];
        this.appPromLengthCnt = true;
        this.appPromCnt = 170 - app_promotional.length;
      }
    } else {
      const userData = JSON.parse(localStorage.getItem('currentUser'));
      contact_email = userData.email;
      copy_right = '© ' + moment().format('YYYY') + ' The APP Company';
      this.defaultLenData = 'English (U.S.)';
    }


    if (this.sponsor_splash_section_data != null) {
      if (this.sponsor_splash_section_data.hasOwnProperty('no_sec_display')) {
        no_sec_display = this.sponsor_splash_section_data['no_sec_display'];
      }
      ssimageInput = this.sponsor_splash_section_data['sponsorsplash_image'];
    }

    if (this.google_analytic_section_data != null) {
      if (this.google_analytic_section_data.hasOwnProperty('google_key')) {
        google_key = this.google_analytic_section_data['google_key'];
      }
    }

    if (this.splash_screen_section_data != null) {
      const is_bc_image_string = this.splash_screen_section_data['is_bc_image'];
      if (is_bc_image_string == 'true') {
        is_bc_image = true;
      }
      bcimageInput = this.splash_screen_section_data['bc_image'];
    }

    if (this.app_icon_section_data != null) {
      imageInput = this.app_icon_section_data['app_icon'];
    }

    //  Background Image in Dropify

    let drBCImageEvent = $('#background_image').dropify({
      defaultFile: self.splash_screen_data['bc_image_original_url'],
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    });

    drBCImageEvent.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeBCFileChange(event);
    });

    drBCImageEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;

    });
    drBCImageEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;
    });
    drBCImageEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;
    });
    drBCImageEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeBCFileError(event);
      // reset dirty state
      self.boolSplashScreenForm = false;
    });

    //  Sponsor Splash Image in Dropify

    const drssImageEvent = $('#sponsor_splash_image').dropify({
      defaultFile: self.sponsor_splash_data['sponsorsplash_image_original_url'],
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    });

    drssImageEvent.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeSSFileChange(event);
    });

    drssImageEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state

      self.boolSponserSplashScreenForm = false;
    });
    drssImageEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state
      self.boolSponserSplashScreenForm = false;
    });
    drssImageEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state
      self.boolSponserSplashScreenForm = false;
    });
    drssImageEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeSSFileError(event);
      // reset dirty state
      self.boolSponserSplashScreenForm = false;
    });

    //  App Icon

    // 'error':   'Ooops, something wrong happended.'
    const drEvent = $('#app_icon').dropify({
      defaultFile: self.app_icon_data['app_icon_original_url'],
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1024x1024), please upload your image in these dimensions</div>'
      }
    });

    drEvent.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeFileChange(event);
    });

    drEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    drEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    drEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    drEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeAppIconError(event);
      // reset bool app icon dirty state if not valid
      self.boolAppIconForm = false;
    });

    // Add Screenshot Image

    const drassImageEvent = $('#add_screenshot_image').dropify({
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (1242x2208), please upload your image in these dimensions</div>'
      }
    });

    drassImageEvent.on('dropify.beforeClear', function (event, element) {
      // return confirm('Do you really want to delete \'' + element.filename + '\' ?');
      self.removeASSFileChange(event);
    });
    drassImageEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });
    drassImageEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeASSFileError(event);
      // reset dirty
      self.boolScreenShotForm = false;
    });


    // Add Ipad Screenshot Image

    let drIpadImageEvent = $('#add_ipad_screenshot').dropify({
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
        errorsContainer: '<div class="dropify-errors-container">The image uploaded is not (2048x2732), please upload your image in these dimensions</div>'
      }
    });

    drIpadImageEvent.on('dropify.beforeClear', function (event, element) {
      self.removeAssIpadImgChange(event);
    });
    drIpadImageEvent.on('dropify.error.minWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent.on('dropify.error.maxWidth', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent.on('dropify.error.minHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });
    drIpadImageEvent.on('dropify.error.maxHeight', function (event, element) {
      self.removeAssIpadError(event);
      // reset dirty
      self.boolIpadScreenShotForm = false;
    });


    // FormController  Manage

    this.appiconform = this.fb.group({
      imageInput: [imageInput, Validators.required]
    });

    this.spscreenform = this.fb.group({
      is_bc_image: [is_bc_image, Validators.compose([Validators.required])],
      bcimageInput: [bcimageInput, Validators.required]
    });

    this.sponsorsplashform = this.fb.group({
      no_sec_display: [no_sec_display, Validators.compose([Validators.required, Validators.maxLength(4)])],
      ssimageInput: [ssimageInput, Validators.required]
    });

    this.gaform = this.fb.group({
      google_key: [google_key, Validators.compose([Validators.required])]
    });


    this.biform = this.fb.group({
      app_name: [this.currentAppData['app_name'],
      Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
      app_description: [app_description, Validators.compose([Validators.required])],
      contact_email: ['nickm@theappcompany.com', Validators.compose([Validators.required])],
      default_language: [default_language, ''],
      official_website: [official_website, Validators.compose([Validators.required])],
      copy_right: [copy_right, Validators.compose([Validators.required])],
      // app_price: [this.app_price, ''],
      app_price: ['USD 0 (Free)'],
      // phone_number: [phone_number, Validators.compose([Validators.required])],
      // remove required validation for launch
      phone_number: ['9197916441'],
      app_category: [this.app_category, ''],
      app_industry: [this.app_industry, ''],
      marketing_website: [this.marketing_website, ''],
      app_promotional: [app_promotional, Validators.compose([Validators.required])],
      app_keywords: [app_keywords, ''],
    });

    this.addscreenshotform = this.fb.group({
      assimageInput: [null, Validators.required]
    });

    this.addipadscreenshotform = this.fb.group({
      asIpadImageInput: [null, Validators.required]
    });

    this.addPreviewImg = this.fb.group({
      previewImg: [null, Validators.required]
    });

    $(function () {
      $('.draggable-element').arrangeable('destroy');
      $('.draggable-element').arrangeable();
    });

  }

  // keywordFun(data: string) {
  //   var self = this;
  //   self.mainKeywordLength = data;
  //   console.log(self.mainKeywordLength);
  //   const a = data;
  //   if (a.length === 100) {

  //     this.appKeywordCnt = 100 - a.length;
  //     this.appKeywordLengthCnt = true;
  //     this.appKeywordcLengthErrMsg = false;
  //     this.basicFormCheck();
  //     this.lengthCount(this.appKeywordCnt, 'appKeyword');

  //   } else {

  //     this.appKeywordCnt = 100 - a.length;
  //     this.appKeywordLengthCnt = true;
  //     this.appKeywordcLengthErrMsg = false;
  //     this.basicFormCheck();
  //     this.lengthCount(this.appKeywordCnt, 'appKeyword');

  //   }
  // };


  /**
  * canDeactivate implementation
  */
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    /**
  * if basic information form have unsaved changes guard active
  */
    // console.log('biform', this.biform.dirty, 'boolappicon', this.boolAppIconForm
    //   , 'boolsplashscreen', this.boolSplashScreenForm,
    //   'boolsponsersplash', this.boolSponserSplashScreenForm
    //   , 'boolscreenshot', this.boolScreenShotForm,
    //   'boolipadscreenshot', this.boolIpadScreenShotForm);
    if (this.biform.dirty
      || this.boolAppIconForm
      || this.boolSplashScreenForm
      || this.boolSponserSplashScreenForm
      || this.boolScreenShotForm
      || this.boolIpadScreenShotForm
    ) {
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
        },
          (isConfirm) => {
            // if accept yes
            if (isConfirm) {
              // console.log(this.biform.dirty);
              if (this.biform.dirty) {
                this.basicInformatoinSubmitObservable(this.basicInfo_form).subscribe(d => {

                  if (d === 'field required') {
                    jQuery('.nav-tabs li:nth-child(4n) a').tab('show');
                    // console.log(d);
                    // console.log(NProgress.isStarted());
                    NProgress.done();
                    this.basicInfo_form.form.markAsPristine();
                    resolve(false);
                  } else {
                    resolve(true);
                  }
                }, err => {
                  resolve(false);
                });
                // swal({
                //   title: 'Successfully',
                //   text: 'Your Data Saved Successfully',
                //   type: 'success',
                //   confirmButtonClass: 'btn-success',
                //   confirmButtonText: 'Ok'
                // });
                // NProgress.done();
                // resolve(true);
              }

              if (this.boolAppIconForm) {
                this.onSubmitAppIconObservable().subscribe(d => {
                  this.boolAppIconForm = false;
                  resolve(true);
                }, err => {
                  this.boolAppIconForm = false;
                  resolve(false);
                }, () => { });

              }
              if (this.boolSplashScreenForm) {
                this.splashScreenSubmitObservable(this.splashScreen_form).subscribe(d => {
                  this.boolSplashScreenForm = false;
                  resolve(true);
                }, err => {
                  this.boolSplashScreenForm = false;
                  resolve(false);
                }, () => {

                })
              }
              if (this.boolSponserSplashScreenForm) {
                this.sponsorSplashSubmitObservable(this.sponsorSplash_form).subscribe(d => {
                  this.boolSponserSplashScreenForm = false;
                  resolve(true);
                }, err => {
                  this.boolSponserSplashScreenForm = false;
                  resolve(false);
                }, () => {

                })
              }
              if (this.boolScreenShotForm) {
                this.onSubmitAddScreenShotObservable(this.AddScreenShot_form).subscribe(d => {
                  this.boolScreenShotForm = false;
                  resolve(true);
                }, err => {
                  this.boolScreenShotForm = false;
                  resolve(false);
                })
              }
              if (this.boolIpadScreenShotForm) {
                this.onSubmitAddIpadScreenShotObservable(this.AddIpadScreenShot_form).subscribe(d => {
                  this.boolIpadScreenShotForm = false;
                  resolve(true);
                }, err => {
                  this.boolIpadScreenShotForm = false;
                  resolve(false);
                })
              }
            } else {
              resolve(true);
            }
          });
      });
    } else {
      return true;
    }


    // return true;
  }

  removeFileChange(event) {
    this.fileList = event.target.files;
    this.is_file = true;
    this.appiconform.controls['imageInput'].setValue(null);
  }

  removeAppIconError(event) {
    this.fileList = event.target.files;
    this.appiconform.controls['imageInput'].setValue(null);
  }

  removeBCFileChange(event) {
    this.fileList = event.target.files;
    this.is_bcImage_file = true;
    this.spscreenform.controls['bcimageInput'].setValue(null);
  }

  removeBCFileError(event) {
    this.fileList = event.target.files;
    this.spscreenform.controls['bcimageInput'].setValue(null);
  }

  bcfileChange(event) {

    this.fileList = null;
    this.fileList = event.target.files;
    const file = event.target.files[0];
    this.spscreenform.controls['bcimageInput'].setValue(event.target.files[0].name);
    this.is_bcImage_file = false;
    // set dirty bool
    this.boolSplashScreenForm = true;
  }

  removeSSFileChange(event) {
    this.fileList = event.target.files;
    this.is_ssImage_file = true;
    this.sponsorsplashform.controls['ssimageInput'].setValue(null);
  }

  removeSSFileError(event) {
    this.fileList = event.target.files;
    this.sponsorsplashform.controls['ssimageInput'].setValue(null);
  }

  sponsorfileChange(event) {
    this.fileListSponsor = null;
    this.fileListSponsor = event.target.files;
    // let file = event.target.files[0];
    this.sponsorsplashform.controls['ssimageInput'].setValue(event.target.files[0].name);
    this.is_ssImage_file = false;
    // set dirty
    this.boolSponserSplashScreenForm = true;
  }

  appIconFileChange(event) {

    this.fileListIcon = event.target.files;
    // let file = event.target.files[0];
    this.appiconform.controls['imageInput'].setValue(event.target.files[0].name);
    this.is_file = false;

    // set dirty state true
    this.boolAppIconForm = true;
  }

  addScreenShotFileChanges(event) {
    this.fileList = null;
    this.fileList = event.target.files;
    // let file = event.target.files[0];
    this.addscreenshotform.controls['assimageInput'].setValue(event.target.files[0].name);
    this.is_assImage_file = false;
    this.is_remove_screenshot_after_submit = false;
    // set dirty state true
    this.boolScreenShotForm = true;
  }

  removeASSFileChange(event) {
    this.fileList = event.target.files;
    if (!this.is_remove_screenshot_after_submit) {
      this.is_assImage_file = true;
    }
    this.addscreenshotform.controls['assimageInput'].setValue(null);
  }

  removeASSFileError(event) {
    this.fileList = event.target.files;
    this.addscreenshotform.controls['assimageInput'].setValue(null);
  }

  addIpadScreenShotChanges(event) {
    this.fileList = null;
    this.fileList = event.target.files;
    let file = event.target.files[0];
    this.addipadscreenshotform.controls['asIpadImageInput'].setValue(event.target.files[0].name);
    this.is_as_IpadImage_file = false;
    this.is_remove_ipad_screenshot_after_submit = false;
    // set dirty state
    this.boolIpadScreenShotForm = true;
  }

  removeAssIpadImgChange(event) {
    this.fileList = event.target.files;
    if (!this.is_remove_ipad_screenshot_after_submit) {
      this.is_as_IpadImage_file = true;
    }
    this.addipadscreenshotform.controls['asIpadImageInput'].setValue(null);
  }

  removeAssIpadError(event) {
    this.fileList = event.target.files;
    this.addipadscreenshotform.controls['asIpadImageInput'].setValue(null);
  }

  splashScreenSubmit(form: NgForm) {
    this.splashScreenSubmitObservable(form).subscribe(d => {

    }, err => {

    }, () => {

    })
  }


  splashScreenSubmitObservable(form: NgForm): Observable<string> {
    return Observable.create((observer) => {

      this.splashImgUrlFlag = true;
      NProgress.start();
      this.appSplashSaveRef.nativeElement.disabled = true;
      let formData = new FormData();
      if (this.fileList != null) {

        const file: File = this.fileList[0];
        formData.append('bc_image', file);
        // console.log('splash screen');
        // console.log(file);
      }

      let old_bc_image = '';
      if (this.splash_screen_section_data != null) {
        old_bc_image = this.splash_screen_section_data['bc_image'];
      }

      formData.append('old_bc_image', old_bc_image);

      formData.append('is_bc_image', form.value.is_bc_image);

      formData.append('id', this.splash_screen_data['id']);
      formData.append('app_id', this.currentAppData['id']);


      this.commonService.filePostData(formData, 'splashscreen').subscribe(res => {
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];

        if (this.rstatus === '1') {
          this.currentAppData['basicDetail']['splash_screen']['bc_image_thumb_url'] = this.rdata['data']['bc_image_thumb_url'];
          this.currentAppData['basicDetail']['splash_screen']['bc_image_original_url'] = this.rdata['data']['bc_image_original_url'];
          this.currentAppData['basicDetail']['splash_screen']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.splash_screen_data = this.currentAppData['basicDetail']['splash_screen'];
          this.splash_screen_section_data = JSON.parse(this.splash_screen_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));

          const success_message = this.rdata['message'];
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          this.boolSplashScreenForm = false;
          observer.next(success_message);
          if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
            swal({
              title: 'Please Contact Us',
              text: 'These changes require approval from Apple and Google. Please contact us to update for you.',
              type: 'warning',
              confirmButtonClass: 'btn-success',
              confirmButtonText: 'Ok',
              closeOnConfirm: true
            }, (isConfirm) => {
              if (isConfirm) {
                observer.next('redirect to contact us');
                this.route.navigate(['contact-us']);
              }
            });
          }
          observer.complete();
          this.appSplashSaveRef.nativeElement.disabled = false;
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
          observer.throw(error_message);
          this.appSplashSaveRef.nativeElement.disabled = false;
        }
      });
    })
  }
  sponsorSplashSubmit(form: NgForm) {
    this.sponsorSplashSubmitObservable(form).subscribe(d => {

    }, err => {

    }, () => {

    })
  }

  sponsorSplashSubmitObservable(form: NgForm): Observable<string> {
    return Observable.create((observer) => {

      this.downloadButtonFlag = true;
      NProgress.start();
      this.appSponsorSplashSaveRef.nativeElement.disabled = true;
      let formData: FormData = new FormData();
      if (this.fileListSponsor != null) {
        let file: File = this.fileListSponsor[0];
        formData.append('sponsorsplash_image', file);
      }
      let old_sponsorsplash_image = '';

      formData.append('no_sec_display', form.value.no_sec_display);
      formData.append('id', this.sponsor_splash_data['id']);
      if (this.sponsor_splash_section_data != null) {
        old_sponsorsplash_image = this.sponsor_splash_section_data['sponsorsplash_image'];
      }
      formData.append('old_sponsorsplash_image', old_sponsorsplash_image);

      this.commonService.filePostData(formData, 'sponsorsplash').subscribe(res => {
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];

        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['sponsor_splash']['sponsorsplash_image_thumb_url'] = this.rdata['data']['sponsorsplash_image_thumb_url'];
          this.currentAppData['basicDetail']['sponsor_splash']['sponsorsplash_image_original_url'] = this.rdata['data']['sponsorsplash_image_original_url'];
          this.currentAppData['basicDetail']['sponsor_splash']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.sponsor_splash_data = this.currentAppData['basicDetail']['sponsor_splash'];
          this.sponsor_splash_section_data = JSON.parse(this.sponsor_splash_data['section_json_data']);

          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));

          const success_message = this.rdata['message'];
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          this.boolSponserSplashScreenForm = false;
          observer.next(success_message);
          observer.complete();
          this.appSponsorSplashSaveRef.nativeElement.disabled = false;
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
          observer.throw(error_message);
          this.appSponsorSplashSaveRef.nativeElement.disabled = false;
        }
      });
    })
  }

  downloadImg() {
    const link = document.createElement('a');
    link.setAttribute('download', null);
    link.style.display = 'none';

    document.body.appendChild(link);

    for (let i = 0; i < this.screenShortData.length; i++) {
      link.setAttribute('href', this.screenShortData[i]);
      link.click();
    }
    document.body.removeChild(link);
  }

  downloadIpadImg() {
    const link = document.createElement('a');
    link.setAttribute('download', null);
    link.style.display = 'none';

    document.body.appendChild(link);

    for (let i = 0; i < this.screenShortIpadData.length; i++) {
      link.setAttribute('href', this.screenShortIpadData[i]);
      link.click();
    }
    document.body.removeChild(link);
  }
  basicInformatoinSubmit(form: NgForm) {
    this.basicInformatoinSubmitObservable(form).subscribe(d => {

    }, err => {

    })
  }
  /**
   * Observable fun while submit basicinformation data
   * @param form
   * @returns Observable<string>
   */
  basicInformatoinSubmitObservable(form: NgForm) {
    return Observable.create((observer) => {
      this.appInformationSaveRef.nativeElement.disabled = true;
      this.app_category = this.categoryTypeData[0]['name'];
      this.app_price = this.priceTypeData[0]['name'];

      form.value.id = this.basic_information_data['id'];
      form.value.app_id = this.currentAppData['id'];
      form.value.app_keywords = $('#app_keywords_tag').val();

      if (form.value.app_industry) {

      } else {
        form.value.app_industry = this.app_industry;
      }

      if (form.value.app_category) {
      } else {
        form.value.app_category = this.app_category;
      }

      if (form.value.app_price) {

      } else {
        form.value.app_price = this.app_price;
      }

      if (form.value.default_language) {

      } else {
        form.value.default_language = this.langData[0];
      }

      // if((this.appNameLengthErrMsg == false || this.appNameLengthErrMsg == undefined)
      // && (this.appDescLengthErrMsg == false || this.appDescLengthErrMsg == undefined)
      // && (this.appPromLengthErrMsg == false || this.appPromLengthErrMsg == undefined)
      // && (this.categoryDataFlag == false || this.categoryDataFlag == undefined)
      // && (this.mobileNumberErrLen == false || this.mobileNumberErrLen == undefined)
      // && (this.emailErrCheck == true || this.emailErrCheck == undefined)
      // && (this.urlErrCheck == true || this.urlErrCheck == undefined)
      // && (this.marketingUrlErrCheck == true || this.marketingUrlErrCheck == undefined)
      // && this.valueCategoryData == true
      // )
      // {
      // this.disableGenralFlag = true;
      // }else{
      // this.disableGenralFlag = false;
      // }

      if (this.valueCategoryData === undefined) {
        this.valueCategoryData = false;
        this.appInformationSaveRef.nativeElement.disabled = false;
        observer.next('field required');
      }
      if (this.appPromLengthErrMsg === undefined) {
        this.appPromLengthErrMsg = true;
        this.appInformationSaveRef.nativeElement.disabled = false;
        observer.next('field required');
      }
      if (this.appDescLengthErrMsg === undefined) {
        this.appDescLengthErrMsg = true;
        this.appInformationSaveRef.nativeElement.disabled = false;
        observer.next('field required');
      }
      if (this.appKeywordcLengthErrMsg === undefined) {
        this.appKeywordcLengthErrMsg = true;
        this.appInformationSaveRef.nativeElement.disabled = false;
        observer.next('field required');
      }
      if (this.supportUrlErr === undefined) {
        this.supportUrlErr = true;
        this.appInformationSaveRef.nativeElement.disabled = false;
        observer.next('field required');
      }
      if (this.phoneNumberErrFlag === undefined) {
        // For Lunch we set to false
        this.appInformationSaveRef.nativeElement.disabled = false;
        this.phoneNumberErrFlag = false;
        // observer.next('field required');
      }

      // app_keywords  && (this.appKeywordcLengthErrMsg == false || this.appKeywordcLengthErrMsg == undefined)


      if (this.tempappKeywordCnt === 100) {
        this.keywordReqMsgFlag = true;
        this.appInformationSaveRef.nativeElement.disabled = false;
        observer.next('field required');
      } else {
        this.keywordReqMsgFlag = false;
      }

      if (this.biform.valid) {

        if ((this.appNameLengthErrMsg == false || this.appNameLengthErrMsg == undefined)
          && (this.appNameSpaceCheck == false || this.appNameSpaceCheck == undefined)
          && (this.promotionalTextSpaceCheck == false || this.promotionalTextSpaceCheck == undefined)
          && (this.appDescriptionSpaceCheck == false || this.appDescriptionSpaceCheck == undefined)
          && (this.appDescLengthErrMsg == false || this.appDescLengthErrMsg == undefined)
          && (this.appPromLengthErrMsg == false || this.appPromLengthErrMsg == undefined)
          && (this.categoryDataFlag == false || this.categoryDataFlag == undefined)
          && (this.mobileNumberErrLen == false || this.mobileNumberErrLen == undefined)
          && (this.emailErrCheck == true || this.emailErrCheck == undefined)
          && (this.urlErrCheck == true || this.urlErrCheck == undefined)
          && (this.marketingUrlErrCheck == true || this.marketingUrlErrCheck == undefined)
          && this.valueCategoryData == true
          && this.keywordReqMsgFlag == false
        ) {

          this.disableGenralFlag = true;
          NProgress.start();
          this.commonService.postData(form.value, 'basicinformation').subscribe(resBs => {
            NProgress.done();

            this.rdata = JSON.parse(resBs);
            // console.log(this.rdata);
            observer.next('');
            this.rstatus = this.rdata['status'];
            if (this.rstatus == '1') {
              this.currentAppData['basicDetail']['basic_information']['section_json_data'] = this.rdata['data']['section_json_data'];
              this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
              this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);
              // localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
              // this.sharedService.emit_appdata(this.currentAppData);

              const postData = {
                'id': this.currentAppData['id']
              };
              this.commonService.postData(postData, 'getsingleappdata').subscribe(res => {
                const resdata = JSON.parse(res);
                const appData = resdata['data'];
                localStorage.setItem('currentAppData', JSON.stringify(appData));
                this.sharedService.emit_appdata(appData);
              });

              const success_message = this.rdata['message'];
              this.biform.markAsPristine();
              observer.next(success_message);
              $(function () {
                $.notify({
                  title: '',
                  message: success_message
                }, {
                    type: 'success'
                  });
              });

              if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
                swal({
                  title: 'Please Contact Us',
                  text: 'These changes require approval from Apple and Google. Please contact us to update for you.',
                  type: 'warning',
                  confirmButtonClass: 'btn-success',
                  confirmButtonText: 'Ok',
                  closeOnConfirm: true
                }, (isConfirm) => {
                  if (isConfirm) {
                    observer.next('redirect to contact us');
                    this.route.navigate(['contact-us']);
                  }
                });
              }
              // set form as pristine after save it
              form.form.markAsPristine();
              this.appInformationSaveRef.nativeElement.disabled = false;
            } else {
              const error_message = this.rdata['message'];
              observer.throw(error_message);
              $(function () {
                $.notify({
                  title: '',
                  message: error_message
                }, {
                    type: 'danger'
                  });
              });
              // set form as pristine after save it
              form.form.markAsPristine();
              this.appInformationSaveRef.nativeElement.disabled = false;
            }
          });


        } else {

          this.disableGenralFlag = false;

        }

        if (this.valueCategoryData == undefined) {
          this.valueCategoryData = false;
        }
        if (this.appPromLengthErrMsg == undefined) {
          this.appPromLengthErrMsg = true;
        }


      } else {
        this.disableGenralFlag = false;
      }
    })

  }
  onSubmitAppIcon(form: NgForm) {
    this.onSubmitAppIconObservable().subscribe(d => {

    }, err => {

    }, () => {

    })

  }

  onSubmitAppIconObservable(): Observable<string> {
    return Observable.create((observer) => {

      this.downloadImgButtonFlag = true;
      NProgress.start();
      this.appIconSaveRef.nativeElement.disabled = true;
      const formData: FormData = new FormData();
      if (this.fileListIcon != null) {

        const file: File = this.fileListIcon[0];
        formData.append('app_icon', file);
        console.log('app icon');
        console.log(file);
      }
      let old_app_icon = '';

      formData.append('id', this.app_icon_data['id']);
      formData.append('app_id', this.currentAppData['id']);

      if (this.app_icon_section_data != null) {
        old_app_icon = this.app_icon_section_data['app_icon'];
      }
      formData.append('old_app_icon', old_app_icon);

      this.commonService.filePostData(formData, 'appicon').subscribe(res => {

        NProgress.done();

        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['app_icon']['app_icon_thumb_url'] = this.rdata['data']['app_icon_thumb_url'];
          this.currentAppData['basicDetail']['app_icon']['app_icon_original_url'] = this.rdata['data']['app_icon_original_url'];
          this.currentAppData['basicDetail']['app_icon']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.app_icon_data = this.currentAppData['basicDetail']['app_icon'];
          this.app_icon_section_data = JSON.parse(this.app_icon_data['section_json_data']);
          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          this.sharedService.emit_appdata(this.currentAppData);
          // form.resetForm();
          const success_message = this.rdata['message'];

          this.msgService.sendMessage(this.currentAppData['basicDetail']['app_icon']['app_icon_thumb_url']);
          // this.TopBarComponent.setHeader();

          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          // reset dirty
          this.boolAppIconForm = false;
          observer.next(success_message);
          if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
            swal({
              title: 'Please Contact Us',
              text: 'These changes require approval from Apple and Google. Please contact us to update for you.',
              type: 'warning',
              confirmButtonClass: 'btn-success',
              confirmButtonText: 'Ok',
              closeOnConfirm: true
            }, (isConfirm) => {
              if (isConfirm) {
                observer.next('redirect to contact us');
                this.route.navigate(['contact-us']);
              }
            });

          }
          const iconData = this.currentAppData['basicDetail']['app_icon'];
          const app_icon = iconData.app_icon_thumb_url;
          if (app_icon) {
            this.appIconUrl = app_icon;
          }
          observer.complete();
          this.appIconSaveRef.nativeElement.disabled = false;
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
          observer.throw(error_message);
          this.appIconSaveRef.nativeElement.disabled = false;
        }
      });
    })
  }

  onSubmitAddScreenShot(form: NgForm) {
    this.onSubmitAddScreenShotObservable(form).subscribe(d => {

    }, err => {

    }, () => { })
  }
  onSubmitAddScreenShotObservable(form: NgForm) {
    return Observable.create((observer) => {

      this.buttonFlagImgDownload = false;
      NProgress.start();
      this.screenShotSaveSaveRef.nativeElement.disabled = true;
      const self = this;
      if (this.total_add_screenshot < 5) {
        const formData: FormData = new FormData();
        if (this.fileList != null) {
          const file: File = this.fileList[0];
          formData.append('add_screenshot', file);
        }

        formData.append('id', this.add_screenshot_data['id']);
        // add app id
        formData.append('app_id', this.currentAppData['id']);

        this.commonService.filePostData(formData, 'addscreenshot').subscribe(res => {
          NProgress.done();
          this.rdata = JSON.parse(res);
          this.rstatus = this.rdata['status'];
          if (this.rstatus == '1') {
            this.currentAppData['basicDetail']['add_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
            this.currentAppData['basicDetail']['add_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
            this.currentAppData['basicDetail']['add_screenshot']['order'] = this.rdata['data']['order'];
            this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];
            this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
            this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];
            this.total_add_screenshot = this.add_screenshot_data['order'];
            localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
            form.resetForm();
            const success_message = this.rdata['message'];
            $(function () {
              $.notify({
                title: '',
                message: success_message
              }, {
                  type: 'success'
                });
              $('.draggable-element').arrangeable('destroy');
              $('.draggable-element').arrangeable();
              self.is_remove_screenshot_after_submit = true;
              $('#add_screenshot_group .dropify-clear').click();
            })
            this.boolScreenShotForm = false;
            observer.next(success_message);
            // if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
            //   swal({
            //     title: 'Please Contact Us',
            //     text: 'These changes require approval from Apple and Google. Please contact us to update for you.',
            //     type: 'warning',
            //     confirmButtonClass: 'btn-success',
            //     confirmButtonText: 'Ok',
            //     closeOnConfirm: true
            //   }, (isConfirm) => {
            //     if (isConfirm) {
            //       observer.next('redirect to contact us');
            //       this.route.navigate(['contact-us']);
            //     }
            //   });
            // }
            observer.complete();
            this.screenShotSaveSaveRef.nativeElement.disabled = false;
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
            observer.throw(error_message);
          }
          this.screenShotSaveSaveRef.nativeElement.disabled = false;
        });
      } else {
        const error_message = 'You cannot add more than 5 screenshots';
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
        NProgress.done();
        this.screenShotSaveSaveRef.nativeElement.disabled = false;
      }
    })

  }

  googleAnalyticOnSubmit(form: NgForm) {
    this.googleAnalyticOnSubmitObservable(form).subscribe(d => {

    }, err => {

    }, () => { })
  }

  googleAnalyticOnSubmitObservable(form: NgForm) {
    return Observable.create((observer) => {
      NProgress.start();
      form.value.id = this.google_analytic_data['id'];
      this.commonService.postData(form.value, 'googleanalytic').subscribe(res => {
        NProgress.done();
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        if (this.rstatus == '1') {
          this.currentAppData['basicDetail']['google_analytic']['section_json_data'] = this.rdata['data']['section_json_data'];
          this.google_analytic_data = this.currentAppData['basicDetail']['google_analytic'];
          this.google_analytic_section_data = JSON.parse(this.basic_information_data['section_json_data']);
          localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
          observer.complete();
          const success_message = this.rdata['message'];
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
    })
  }

  deleteScreenshot(data) {
    const self = this;
    this.buttonFlagImgDownload = true;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
      closeOnConfirm: false,
      closeOnCancel: true
    },
      function (isConfirm) {
        if (isConfirm) {
          self.removeScreenShot(data);
          swal({
            title: 'Deleted!',
            text: 'Screenshot has been deleted.',
            type: 'success',
            confirmButtonClass: 'btn-success',
            confirmButtonText: 'Ok'
          });
        } else {
          swal({
            title: 'Cancelled',
            text: 'Your record is safe :)',
            type: 'error',
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'Ok'
          });
        }
      });
  }

  removeScreenShot(data) {
    const self = this;
    this.removeScreenShotform.value.add_screenshot = data.add_screenshot;
    this.removeScreenShotform.value.order = data.order;
    this.removeScreenShotform.value.id = this.add_screenshot_data['id'];

    this.commonService.postData(this.removeScreenShotform.value, 'removescreenshot').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.currentAppData['basicDetail']['add_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.currentAppData['basicDetail']['add_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
        this.currentAppData['basicDetail']['add_screenshot']['order'] = this.rdata['data']['order'];
        this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];
        this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
        this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];
        this.total_add_screenshot = this.add_screenshot_data['order'];
        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));

        $(function () {
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
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
  onSubmitAddIpadScreenShot(form: NgForm): void {
    this.onSubmitAddIpadScreenShotObservable(form).subscribe(d => {

    }, err => {

    })
  }

  onSubmitAddIpadScreenShotObservable(form: NgForm) {
    return Observable.create((observer) => {
      this.buttonFlagIpadImgDownload = false;
      NProgress.start();
      this.ipadBtnSaveMainRef.nativeElement.disabled = true;
      const self = this;

      if (this.total_add_ipad_screenshot < 5) {
        const formData: FormData = new FormData();
        if (this.fileList != null) {
          const file: File = this.fileList[0];
          formData.append('add_screenshot', file);
        }

        formData.append('id', this.add_ipad_screenshot_data['id']);
        // add app id
        formData.append('app_id', this.currentAppData['id']);

        this.commonService.filePostData(formData, 'addipadscreenshot').subscribe(res => {
          NProgress.done();
          this.rdata = JSON.parse(res);
          this.rstatus = this.rdata['status'];
          if (this.rstatus == '1') {
            this.currentAppData['basicDetail']['add_ipad_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
            this.currentAppData['basicDetail']['add_ipad_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
            this.currentAppData['basicDetail']['add_ipad_screenshot']['order'] = this.rdata['data']['order'];

            this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];
            this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
            this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];
            this.total_add_ipad_screenshot = this.add_ipad_screenshot_data['order'];


            localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
            form.resetForm();
            const success_message = this.rdata['message'];
            // reset all dirty state
            this.boolIpadScreenShotForm = false;
            observer.next(success_message);
            $(function () {
              $.notify({
                title: '',
                message: success_message
              }, {
                  type: 'success'
                });
              $('.draggable-element').arrangeable('destroy');
              $('.draggable-element').arrangeable();
              self.is_remove_ipad_screenshot_after_submit = true;
              $('#add_ipad_screenshot_group .dropify-clear').click();
            })
            // if (this.rdata.hasOwnProperty('change') && this.rdata.change === true)
            // {
            //   swal({
            //     title: 'Please Contact Us',
            //     text: 'These changes require approval from Apple and Google. Please contact us to update for you.',
            //     type: 'warning',
            //     confirmButtonClass: 'btn-success',
            //     confirmButtonText: 'Ok',
            //     closeOnConfirm: true
            //   }, (isConfirm) => {
            //     if (isConfirm) {
            //       observer.next('redirect to contact us');
            //       this.route.navigate(['contact-us']);
            //     }
            //   });
            // }
            observer.complete();
            this.ipadBtnSaveMainRef.nativeElement.disabled = false;
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
            // reset all dirty state
            this.boolIpadScreenShotForm = false;
            observer.throw(error_message);
            this.ipadBtnSaveMainRef.nativeElement.disabled = false;
          }
        });
      } else {
        const error_message = 'You cannot add more than 5 screenshots';
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
        NProgress.done();
        this.ipadBtnSaveMainRef.nativeElement.disabled = false;
      }
    })

  }

  deleteIpadScreenshot(data) {
    const self = this;
    this.buttonFlagIpadImgDownload = true;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
      closeOnConfirm: false,
      closeOnCancel: true
    },
      function (isConfirm) {
        if (isConfirm) {
          self.removeIpadScreenShot(data);
          swal({
            title: 'Deleted!',
            text: 'Screenshot has been deleted.',
            type: 'success',
            confirmButtonClass: 'btn-success',
            confirmButtonText: 'Ok'
          });
        } else {
          swal({
            title: 'Cancelled',
            text: 'Your record is safe :)',
            type: 'error',
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'Ok'
          });
        }
      });
  }

  removeIpadScreenShot(data) {
    const self = this;
    this.removeIpadScreenShotform.value.add_screenshot = data.add_screenshot;
    this.removeIpadScreenShotform.value.order = data.order;
    this.removeIpadScreenShotform.value.id = this.add_ipad_screenshot_data['id'];

    this.commonService.postData(this.removeIpadScreenShotform.value, 'removeipadscreenshot').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {

        this.currentAppData['basicDetail']['add_ipad_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.currentAppData['basicDetail']['add_ipad_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
        this.currentAppData['basicDetail']['add_ipad_screenshot']['order'] = this.rdata['data']['order'];

        this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];
        this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
        this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];
        this.total_add_ipad_screenshot = this.add_ipad_screenshot_data['order'];
        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));

        $(function () {
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
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

  changeAddScreenShotOrder(data) {
    NProgress.start();
    this.iphnSaveOrderBtnRef.nativeElement.disabled = true;
    this.changeOrderScreenShotform.value.order_data = data;
    this.changeOrderScreenShotform.value.id = this.add_screenshot_data['id'];
    this.changeOrderScreenShotform.value.app_id = this.currentAppData['id'];

    this.commonService.postData(this.changeOrderScreenShotform.value, 'changescreenshotorder').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];

      if (this.rstatus == '1') {
        this.currentAppData['basicDetail']['add_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.currentAppData['basicDetail']['add_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];
        this.add_screenshot_data = this.currentAppData['basicDetail']['add_screenshot'];
        this.add_screenshot_section_data = JSON.parse(this.add_screenshot_data['section_json_data']);
        this.add_screenshot_list_data = this.add_screenshot_data['add_screenshot_data'];
        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
        const success_message = this.rdata['message'];
        NProgress.done();
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
        });
        if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
          swal({
            title: 'Please Contact Us',
            text: 'These changes require approval from Apple and Google. Please contact us to update for you.',
            type: 'warning',
            confirmButtonClass: 'btn-success',
            confirmButtonText: 'Ok',
            closeOnConfirm: true
          },
            (isConfirm) => {
              if (isConfirm) {
                this.route.navigate(['contact-us']);
              }
            });
        }
        this.iphnSaveOrderBtnRef.nativeElement.disabled = false;
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
        this.ipadBtnSaveRef.nativeElement.disabled = false;
      }
    });
  }

  getOrderData() {
    var self = this;
    let orderArray = [];
    $(function () {
      $('#my_screen .draggable-element').each(function () {
        orderArray.push($(this).data('id'));
      });
      self.changeAddScreenShotOrder(orderArray);
    });
  }

  changeAddScreenShotIpadOrder(data) {
    NProgress.start();
    this.changeOrderIpadScreenShotform.value.order_data = data;
    this.changeOrderIpadScreenShotform.value.id = this.add_ipad_screenshot_data['id'];
    this.changeOrderIpadScreenShotform.value.app_id = this.currentAppData['id'];
    this.ipadBtnSaveRef.nativeElement.disabled = true;
    this.commonService.postData(this.changeOrderIpadScreenShotform.value, 'changeipadscreenshotorder').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {
        this.currentAppData['basicDetail']['add_ipad_screenshot']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.currentAppData['basicDetail']['add_ipad_screenshot']['add_screenshot_data'] = this.rdata['data']['add_screenshot_data'];

        this.add_ipad_screenshot_data = this.currentAppData['basicDetail']['add_ipad_screenshot'];
        this.add_ipad_screenshot_section_data = JSON.parse(this.add_ipad_screenshot_data['section_json_data']);
        this.add_screenshot_list_ipad_data = this.add_ipad_screenshot_data['add_screenshot_data'];

        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
        NProgress.done();
        const success_message = this.rdata['message'];
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
          $('.draggable-element').arrangeable('destroy');
          $('.draggable-element').arrangeable();
        });

        if (this.rdata.hasOwnProperty('change') && this.rdata.change === true) {
          swal({
            title: 'Please Contact Us',
            text: 'These changes require approval from Apple and Google. Please contact us to update for you.',
            type: 'warning',
            confirmButtonClass: 'btn-success',
            confirmButtonText: 'Ok',
            closeOnConfirm: true
          },
            (isConfirm) => {
              if (isConfirm) {
                this.route.navigate(['contact-us']);
              }
            });
        }
        this.ipadBtnSaveRef.nativeElement.disabled = false;
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
        this.ipadBtnSaveRef.nativeElement.disabled = false;
      }
    });
  }

  getIpadOrderScreenData() {
    var self = this;
    let orderArray = [];
    $(function () {
      $('#my_screen_ipad .draggable-element').each(function () {
        orderArray.push($(this).data('id'));
      });
      self.changeAddScreenShotIpadOrder(orderArray);
    });
  }


  lengthCount($event, name) {

    if (name == 'appName') {
      const a = $event;
      this.appLengthCnt = true;
      if (!a.replace(/\s/g, '').length) {
        this.appNameSpaceCheck = true;
        this.basicFormCheck();
      } else {
        this.appNameSpaceCheck = false;
        this.basicFormCheck();
      }
      if (a.length == '1') {
        if (a[0] == ' ') {
          this.blankSpaceAppName = true;
        }
      } else {
        this.blankSpaceAppName = false;
      }

      if (a.length === 30) {
        this.appCnt = 30 - a.length;
        this.appNameLengthErrMsg = false;
        this.basicFormCheck();
      } else {
        this.appCnt = 30 - a.length;
        this.appNameLengthErrMsg = false;
        this.basicFormCheck();
      }
    }

    if (name === 'pramotionalText') {
      const a = $event;

      if (!a.replace(/\s/g, '').length) {
        this.promotionalTextSpaceCheck = true;
        this.basicFormCheck();
      } else {
        this.promotionalTextSpaceCheck = false;
        this.basicFormCheck();
      }

      if (a.length == '1') {
        if (a[0] == ' ') {
          this.blankSpacePramotionalText = true;
        }
      } else {
        this.blankSpacePramotionalText = false;
      }

      if (a.length === 170) {

        this.appPromCnt = 170 - a.length;
        this.appPromLengthCnt = true;
        this.appPromLengthErrMsg = false;
        this.basicFormCheck();
      } else {

        this.appPromCnt = 170 - a.length;
        this.appPromLengthCnt = true;
        this.appPromLengthErrMsg = false;
        this.basicFormCheck();
      }
    }

    if (name == 'appDescription') {
      const a = $event;
      if (!a.replace(/\s/g, '').length) {
        this.appDescriptionSpaceCheck = true;
        this.basicFormCheck();
      } else {
        this.appDescriptionSpaceCheck = false;
        this.basicFormCheck();
      }

      if (a.length == '1') {
        if (a[0] == ' ') {
          this.blankSpaceDescriptionText = true;
        }
      } else {
        this.blankSpaceDescriptionText = false;
      }

      if (a.length == 4000) {

        this.appDesCnt = 4000 - a.length;
        this.appDesLengthCnt = true;
        this.appDescLengthErrMsg = false;
        this.basicFormCheck();
      } else {

        this.appDesCnt = 4000 - a.length;
        this.appDesLengthCnt = true;
        this.appDescLengthErrMsg = false;
        this.basicFormCheck();
      }
    }

    if (name === 'appKeyword') {
      var a = $event;

      if (a.length === 100) {

        this.appKeywordCnt = 100 - a.length;
        this.appKeywordLengthCnt = true;
        this.appKeywordcLengthErrMsg = false;
        this.basicFormCheck();
      } else {

        this.appKeywordCnt = 100 - a.length;
        this.appKeywordLengthCnt = true;
        this.appKeywordcLengthErrMsg = false;
        this.basicFormCheck();
      }
    }


  }

  appCategoryCheck($event) {
    this.valueCategoryData = true;
    this.primaryData = $event;
    if (this.secondryData == this.primaryData) {
      this.categoryDataFlag = true;
      this.basicFormCheck();
    } else {
      this.categoryDataFlag = false;
      this.basicFormCheck();
    }
  }

  appSecondryData($event) {
    this.secondryData = $event;
    if (this.secondryData == this.primaryData) {
      this.categoryDataFlag = true;
      this.basicFormCheck();
    } else {
      this.categoryDataFlag = false;
      this.basicFormCheck();
    }

  }

  mobileNoCheck($event) {
    this.phoneNumberErrFlag = false;
    if ($event.length < 14) {
      this.mobileNumberErrLen = true;
      this.basicFormCheck();
    } else {
      this.mobileNumberErrLen = false;
      this.basicFormCheck();
    }

  }
  emailCheck($event) {

    const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (re.test($event)) {
      this.emailErrCheck = true;
      this.basicFormCheck();
    } else {
      this.emailErrCheck = false;
      this.basicFormCheck();
    }
  }

  urlCheck($event, name) {
    this.supportUrlErr = false;
    var re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-z0-9A-Z]+([\-\.]{1}[a-z0-9A-Z]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    if (name == 'officialwebsite') {
      if (re.test($event)) {
        this.urlErrCheck = true;
        this.basicFormCheck();
      } else {
        this.urlErrCheck = false;
        this.basicFormCheck();
      }
    }

    if (name == 'marketing') {
      if (re.test($event)) {
        this.marketingUrlErrCheck = true;
        this.basicFormCheck();
      } else {
        this.marketingUrlErrCheck = false;
        this.basicFormCheck();
      }
      if ($event.length < 1) {
        this.marketingUrlErrCheck = true;
        this.basicFormCheck();
      }
    }

  }

  basicFormCheck() {
    // console.log('marketingUrlErrCheck: ' + this.marketingUrlErrCheck);
    if (this.biform.valid) {


      // if((this.appNameLengthErrMsg == false || this.appNameLengthErrMsg == undefined)
      //     && (this.appDescLengthErrMsg == false || this.appDescLengthErrMsg == undefined)
      //     && (this.appPromLengthErrMsg == false || this.appPromLengthErrMsg == undefined)
      //     && (this.categoryDataFlag == false || this.categoryDataFlag == undefined)
      //     && (this.mobileNumberErrLen == false || this.mobileNumberErrLen == undefined)
      //     && (this.emailErrCheck == true || this.emailErrCheck == undefined)
      //     && (this.urlErrCheck == true || this.urlErrCheck == undefined)
      //     && (this.marketingUrlErrCheck == true || this.marketingUrlErrCheck == undefined)
      //     && this.valueCategoryData == true
      //  )
      // {
      //   this.disableGenralFlag = true;
      // }else{
      //    this.disableGenralFlag = false;
      // }

      if (this.valueCategoryData == undefined) {
        this.valueCategoryData = false;
      }
      if (this.appPromLengthErrMsg == undefined) {
        this.appPromLengthErrMsg = true;
      }


    } else {
      this.disableGenralFlag = false;
    }
  }
  // count tageditor string array character count

  private countkeywordLen(arr: string[]) {
    this.appKeywordCnt = 100;
    arr.forEach(element => {
      this.appKeywordCnt -= element.length;
    });
    // set ref of tags char count
    this.tempappKeywordCnt = this.appKeywordCnt;
  }

  private addKeywordCount(data: string) {

    if (this.tempappKeywordCnt >= 0) {
      this.tempappKeywordCnt = this.tempappKeywordCnt - data.length;
      // if suddenly tempappkeywordcnt become negative
      if (this.tempappKeywordCnt < 0) {
        this.removalTag(data);
      }
    }

  }
  private removalTag(val: string) {
    $('#app_keywords_tag').tagEditor('removeTag', val);
  }

}

