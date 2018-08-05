import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;

@Component({
	selector: 'app-add-fitness-challenge-loop',
	templateUrl: './add-fitness-challenge-loop.component.html',
	styleUrls: []
})
export class AddFitnessChallengeLoopComponent implements OnInit 
{
	public form : FormGroup;
	rdata = [];
	success_message = '';
	is_success = false;
	is_error = false;
	is_image_file = false;
	fileList: FileList;
	dayData = '';
	error_message =  '';
	rstatus = '';
	editId = '';
	statusArray = [
	{
		"name": "Active",
		"key": 1
	},
	{
		"name": "In Active",
		"key": 2
	}
	];
	editIdArray = {
		'value': {
			'id':''
		}
	};
	constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute) 
	{ 
		this.commonService.isAuthorizedRoute();
		this.commonService.getData('fetchAllActiveFitnessChallengeDay').subscribe(res =>
		{
			this.rdata = JSON.parse(res);
			this.dayData = this.rdata['data'];
		},
		error => {
			this.rdata = JSON.parse(error._body);
			this.is_error = true;
			this.is_success = false;
			this.error_message = this.rdata['message'];
		}
		);
	}

	ngOnInit() 
	{
		let self = this;

		let image = null;

		this.form = this.fb.group({
			day : ['' , Validators.required],
			loop_name: [null, Validators.compose([Validators.required])],
			video_url: [null, Validators.compose([Validators.required])],
			status: [1, Validators.compose([Validators.required])]
		});
	}
	onSubmit(form : NgForm)
	{
		this.commonService.postData(form.value,'addFitnessChallengeLoop').subscribe(res =>
		{
			NProgress.start();
			this.rdata = JSON.parse(res);
			this.rstatus = this.rdata['status'];
			if(this.rstatus == '1')
			{
				NProgress.done();
				let success_message = this.rdata['message'];
				$(function() {
					$.notify({
						title: '',
						message: success_message
					},{
						type: 'success'
					});
				});
				this.router.navigate(['/fitness-challenge-loops']);
			}
			else
			{
				let error_message = this.rdata['message'];
				$(function() {
					$.notify({
						title: '',
						message: error_message
					},{
						type: 'danger'
					});
				});
			}
		}

		);
	}

}
