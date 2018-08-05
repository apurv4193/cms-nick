import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { DomSanitizer } from '@angular/platform-browser';

import { SharedService } from './../../shared.service';
import { SafeHtmlPipe } from './safehtmlpipe.pipe';

import { MenuConfigurationComponent } from './menu-configuration.component';

import { MenuTypeMenuComponent } from './menu-types/menu-type-menu.component';
import { MenuTypeIframeComponent } from './menu-types/menu-type-iframe.component';
import { MenuTypeNotificationComponent } from './menu-types/menu-type-notification.component';

import { MenuTypePdfComponent } from './menu-types/menu-type-pdf.component';
import { MenuTypePhotoComponent } from './menu-types/menu-type-photo.component';
import { MenuTypeRssComponent } from './menu-types/menu-type-rss.component';
import { MenuTypeTutorialComponent } from './menu-types/menu-type-tutorial.component';
import { MenuTypeVideoComponent } from './menu-types/menu-type-video.component';
import { MenuTypeYoutubeVideoComponent } from './menu-types/menu-type-youtube-video.component';
import { MenuTypeWebsiteComponent } from './menu-types/menu-type-website.component';
import { MenuTypeListMenuComponent } from './menu-types/menu-type-list-menu.component';
import { MenuRecuTreeViewComponent } from './menu-recu-tree-view/menu-recu-tree-view.component';

import { ScrollNestableDirective } from './../directive/scroll-nestable.directive';
import { OnlyNumDirective } from './../directive/only-num.directive';
import { AllowValidUrlDirective } from './../directive/allow-valid-url.directive';
import { AllowValidEmailDirective } from './../directive/allow-valid-email.directive';
import { MenupipePipe } from './../../menupipe.pipe';
import { RgbaToHexPipe } from './menu-types/rgba-to-hex.pipe';

export const routes: Routes = [
  {
    path: 'menu-configuration',
    component: MenuConfigurationComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuardService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ColorPickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SafeHtmlPipe,
    MenuConfigurationComponent,
    MenuTypeMenuComponent,
    MenuTypeIframeComponent,
    MenuTypeNotificationComponent,
    MenuTypePdfComponent,
    MenuTypePhotoComponent,
    MenuTypeRssComponent,
    MenuTypeTutorialComponent,
    MenuTypeVideoComponent,
    MenuTypeWebsiteComponent,
    MenuTypeYoutubeVideoComponent,
    MenuTypeListMenuComponent,
    MenuRecuTreeViewComponent,
    ScrollNestableDirective,
    OnlyNumDirective,
    AllowValidUrlDirective,
    AllowValidEmailDirective,
    MenupipePipe,
    RgbaToHexPipe
  ],
  providers: [SharedService, RgbaToHexPipe],
  exports: [ScrollNestableDirective, OnlyNumDirective, AllowValidUrlDirective, AllowValidEmailDirective]

})

export class MenuModule { }
