import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { Observable } from 'rxjs/Observable';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

function matchCorrectPass() {
    // const hasExclamation = input.value !== this.o_password.value;
    return (input: FormControl) => {
        return /(?=.*\d)(?=.*)(?=.*[A-Z]).*/.test(input.value) ? null : {
            matchCorrectPass: {
                valid: false
            }
        };
    }
}

const password = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(6), matchCorrectPass()]));
const confirmPassword = new FormControl(null, CustomValidators.equalTo(password));

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styles: []
})

export class EditUserComponent implements OnInit, AfterViewInit, CanComponentDeactivate {

    @ViewChild('addUserForm') addUserFormRef: NgForm;
    @ViewChild('cgpassform') cgpassformRef: NgForm;
    @ViewChild('submitBtn') submitBtnRef: ElementRef;
    @ViewChild('changePwdBtn') changePwdBtnRef: ElementRef;

    optionsModel: number[];
    public form: FormGroup;
    cgpassForm: FormGroup;
    selectedValues = null;
    rdata = [];
    success_message = '';
    is_success = false;
    is_error = false;
    error_message = '';
    rstatus = '';
    editId = '';
    myapp: any;
    saveAppData: {};
    rdataapp = [];
    appMyData = [];
    other_app = [];
    all_app = [];
    statusArray = [
        {
            'name': 'Active',
            'key': 1
        },
        {
            'name': 'Inactive',
            'key': 2
        }
    ];
    editIdArray = {
        'value': {
            'id': ''
        }
    };

    constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute) {
        this.commonService.isAuthorizedRoute();
        this.editId = this.linkValue.snapshot.params.id;
        this.form = this.fb.group({
            first_name: [null, Validators.compose([Validators.required])],
            last_name: [null, Validators.compose([Validators.required])],
            email: [null, Validators.compose([Validators.required, CustomValidators.email])],
            app_basic_id: '',
            status: [1, Validators.compose([Validators.required])]
        });
        this.cgpassForm = this.fb.group({
            password: password,
            confirmpassword: confirmPassword,
        });

    }

    ngOnInit() {
        this.fetchUserById().subscribe(res => {
            if (res === 'datafill') {
                // NProgress.done();
            }
        }, err => {
            NProgress.done();
        });
        NProgress.done();
    }

    ngAfterViewInit(): void {
        $(function () {
            // $('.password').password({
            //     eyeClass: '',
            //     eyeOpenClass: 'icmn-eye',
            //     eyeCloseClass: 'icmn-eye-blocked'
            // });
            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 500);
        });
    }

    onSubmit(form: NgForm) {

        this.onSubmitObservable(form, false).subscribe(data => {

        }, err => {

        })
    }

    onSubmitObservable(form: NgForm, canDeactivate:
        boolean): Observable<any> {
        return Observable.create((observer) => {

            NProgress.start();

            if (form.value.app_basic_id == null) {
                form.value.app_basic_id = [];
            }
            this.submitBtnRef.nativeElement.disabled = true;
            form.value.id = this.editId;
            this.commonService.postData(form.value, 'updateUser').subscribe(res => {
                this.rdata = JSON.parse(res);
                this.rstatus = this.rdata['status'];
                if (this.rstatus === '1') {
                    this.is_success = true;
                    this.is_error = false;
                    form.resetForm();
                    this.success_message = this.rdata['message'];
                    // this.commonService.storeMessage(this.success_message);

                    $.notify({
                        title: '',
                        message: this.success_message
                    }, {
                            type: 'success'
                        });

                    this.form.markAsPristine();
                    observer.next(this.success_message)
                    this.submitBtnRef.nativeElement.disabled = false;
                    if (!canDeactivate) {
                        // this.commonService.storeMessage(this.success_message);
                        this.router.navigate(['/users']);
                    } else {

                        this.fetchUserById().subscribe(r => {

                        }, err => {

                        })
                    }
                    NProgress.done();

                } else {
                    const error_message = this.rdata['message'];
                    this.form.markAsPristine();
                    $(function () {
                        $.notify({
                            title: '',
                            message: error_message
                        }, {
                                type: 'danger'
                            });
                    });
                    observer.next(error_message);
                    this.submitBtnRef.nativeElement.disabled = false;
                    NProgress.done();
                }
            }, error => {
                this.rdata = JSON.parse(error._body);
                this.is_error = true;
                this.is_success = false;
                this.error_message = this.rdata['message'];
                this.form.markAsPristine();

                const error_message = this.rdata['message'];
                observer.throw(error);
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    }, {
                            type: 'danger'
                        });
                });

                this.submitBtnRef.nativeElement.disabled = false;
                NProgress.done();
            })
        })
    }


    submitMethod(form: NgForm): void {
        this.submitMethodObservable(form, false).subscribe(data => {

        }, err => {

        })
    }
    submitMethodObservable(form: NgForm, canDeactive: boolean): Observable<any> {
        return Observable.create((observer) => {
            NProgress.start();
            form.value.change_id = this.rdata['id'];
            // console.table(form.value);
            this.changePwdBtnRef.nativeElement.disabled = true;
            this.commonService.postData(form.value, 'updateUser').subscribe(res => {
                this.rdata = JSON.parse(res);
                this.rstatus = this.rdata['status'];
                if (this.rstatus === '1') {
                    this.is_success = true;
                    this.is_error = false;
                    form.resetForm();
                    this.success_message = this.rdata['message'];
                    // this.commonService.storeMessage(this.success_message);
                    this.form.markAsPristine();
                    // console.log(this.success_message, 'fun');
                    $.notify({
                        title: '',
                        message: this.success_message
                    }, {
                            type: 'success'
                        });
                    observer.next(this.success_message);
                    if (!canDeactive) {
                        // this.commonService.storeMessage(this.success_message);
                        // this.router.navigate(['/users']);
                    }
                    this.changePwdBtnRef.nativeElement.disabled = false;
                    NProgress.done();
                } else {
                    const error_message = this.rdata['message'];
                    observer.next(error_message);
                    this.form.markAsPristine();
                    $(function () {
                        $.notify({
                            title: '',
                            message: error_message
                        }, {
                                type: 'danger'
                            });
                    });
                    this.changePwdBtnRef.nativeElement.disabled = false;
                    NProgress.done();
                }
            }, error => {
                this.rdata = JSON.parse(error._body);
                this.is_error = true;
                this.is_success = false;
                this.error_message = this.rdata['message'];
                this.form.markAsPristine();

                const error_message = this.rdata['message'];
                observer.throw(error);
                $(function () {
                    $.notify({
                        title: '',
                        message: error_message
                    }, {
                            type: 'danger'
                        });
                });
                this.changePwdBtnRef.nativeElement.disabled = false;
                NProgress.done();
            });
        })

    }
    /**
     * Method to fetch all app assign to user by userid
     */
    fetchUserById(): Observable<any> {
        const HandleTimer = Observable.timer(800);
        HandleTimer.subscribe(() => {
            NProgress.start();
        })
        return Observable.create((observer) => {

            const selected_id = [];
            const existingApp = [];
            this.editIdArray.value.id = this.editId;
            // console.log(this.editIdArray.value.id);
            this.commonService.postData(this.editIdArray.value, 'fetchUserById').subscribe(res => {

                this.rdata = JSON.parse(res);
                this.myapp = this.rdata['app'];

                if (typeof (this.myapp['AllApp']) !== 'undefined') {
                    for (const x in this.myapp.AllApp) {
                        if (this.myapp.AllApp.hasOwnProperty(x)) {
                            this.myapp['AllApp'][x]['is_mine'] = this.myapp['AllApp'][x]['id'];
                            // this.all_app.push(this.myapp['AllApp'][x]);
                        }
                    }
                }
                else {
                    this.myapp['AllApp'] = [];
                }

                if (typeof (this.myapp['myApp']) !== 'undefined') {
                    for (const x in this.myapp.myApp) {
                        if (this.myapp.myApp.hasOwnProperty(x)) {
                            this.myapp['myApp'][x]['is_mine'] = this.myapp['myApp'][x]['id'];
                            // this.all_app.push(this.myapp['myApp'][x]);
                            // console.log(this.myapp['myApp'][x]);

                            const str = (parseInt(this.myapp['AllApp'].length, 10) + (parseInt(x, 10))) + ": '" +
                                this.myapp['myApp'][x]['id'] + "'";
                            selected_id[x] = str;
                            const existingAppstr = this.myapp['myApp'][x]['id'];
                            existingApp[x] = existingAppstr;
                        }
                    }
                    // NProgress.done();
                    observer.next('ready');
                } else {
                    this.myapp['myApp'] = [];
                    // NProgress.done();
                    observer.next('blank');
                }

                this.myapp = this.myapp['AllApp'].concat(this.myapp['myApp']);
                // console.log(this.myapp);
                this.is_success = true;
                this.is_error = false;

                // this.form = this.fb.group({
                //     first_name: [this.rdata['first_name'], Validators.compose([Validators.required])],
                //     last_name: [this.rdata['last_name'], Validators.compose([Validators.required])],
                //     email: [this.rdata['email'], Validators.compose([Validators.required])],
                //     password: '',
                //     app_basic_id: [existingApp],
                //     status: [this.rdata['status'], Validators.compose([Validators.required])]
                // });
                this.form.patchValue({
                    first_name: this.rdata['first_name'],
                    last_name: this.rdata['last_name'],
                    email: this.rdata['email'],
                    app_basic_id: existingApp,
                    status: this.rdata['status']
                });
                setTimeout(() => {
                    $('.selectpicker').selectpicker('val', selected_id);
                    $('.selectpicker').selectpicker('refresh');
                    NProgress.done();
                    observer.next('datafill');
                }, 150);
            }, error => {
                NProgress.done();
                observer.throw(error);

            })
        })
    }
    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
        if (this.form.dirty || this.cgpassForm.dirty) {
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
                        if (this.form.dirty) {
                            if (this.form.valid) {
                                this.onSubmitObservable(this.addUserFormRef, true).subscribe(data => {
                                    console.log(data, 'basicinfo')
                                    resolve(true);
                                }, err => {
                                    resolve(false);
                                })
                            } else {
                                NProgress.done();
                                this.addUserFormRef.form.markAsPristine();
                                this.addUserFormRef.form.markAsTouched();
                                resolve(false);
                            }
                        }
                        if (this.cgpassForm.dirty) {
                            if (this.cgpassForm.valid) {
                                this.submitMethodObservable(this.cgpassformRef, true).subscribe(data => {
                                    // console.log(data, 'cgpassref');
                                    resolve(true);
                                }, err => {
                                    console.log(err, 'asdas');
                                    resolve(false);
                                })
                            } else {
                                NProgress.done();
                                this.cgpassformRef.form.markAsPristine();
                                this.cgpassformRef.form.markAsTouched();
                                resolve(false);
                            }
                        }

                    } else {
                        resolve(true);
                    }
                })
            })
        } else {
            return true;
        }

    }

}


