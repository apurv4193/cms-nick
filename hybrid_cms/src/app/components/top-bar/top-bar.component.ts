import { Component, Injectable, OnDestroy } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonService } from './../../common.service';
import { MessageService } from './../../message.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


@Component({
	selector: 'cat-top-bar',
	templateUrl: './top-bar.component.html',
})

// @Injectable()
export class TopBarComponent implements OnDestroy {
	userData = [];
	appName: any;
	imgUrl: any;
	imgFlag: any;
	msgSub: Subscription;
	profileSub: Subscription;
	headerTitle: any;
	name: any;
	delFlag: any;
	headerTitleMain: any;

	constructor(private commonService: CommonService, private msgService: MessageService) {

		this.profileSub = this.msgService.getCurrentProfile().subscribe(d => {
			this.userData = d;
		})
		this.msgSub = this.msgService.getMessage().subscribe(d => {
			this.setHeader(d.text);
		})
		// get userdata
		this.userData = this.commonService.get_user_data();
		this.getCurrentAppData().subscribe(d => {

		}, err => {

		})


	}

	setHeader(data): void {
		if (data == "delete") {
			this.imgFlag = false;
			this.headerTitleMain = "Admin Panel";
			this.delFlag = true;

		}
		else {
			this.delFlag = false;
			this.appName = data;
			if (this.appName != null) {

				this.imgUrl = data;

				if (this.imgUrl.includes('default')) {

					const a = this.commonService.get_current_app_data();
					const name = a['app_name'];

					this.imgFlag = false;
					this.name = name;
				} else {
					this.imgFlag = true;
				}
			}
			this.headerTitle = 'App Building CMS';

		}

	}

	getCurrentAppData(): Observable<string> {
		return Observable.create((observer) => {

			this.appName = this.commonService.get_current_app_data();
			if (this.appName != null) {
				this.imgUrl = this.appName['basicDetail']['app_icon']['app_icon_thumb_url'];
				if (this.imgUrl.includes('default')) {
					this.imgFlag = false;
					observer.next('img flag set false')
				} else {
					this.imgFlag = true;
					observer.next('img flag set true')
				}
				this.imgUrl;
				observer.next('set imgurl')
			}
		})
	}

	ngOnDestroy(): void {
		this.msgSub.unsubscribe();
	}

}
