<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Config;
use Auth;
use Helpers;
use App\AppBasic;
use App\Services\App\Contracts\AppRepository;
use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use Image;
use Illuminate\Support\Facades\Input;
use File;
use App\AppMenu;
use App\AppAppMenuMenuType;
use DB;
use Carbon\Carbon;

class AppController extends Controller {

    public function __construct(AppRepository $AppRepository,AppAssignUserRepository $AppAssignUserRepository) 
    {
        $this->middleware('jwt.auth');
        $this->objAppBasic = new AppBasic();
        $this->objAppMenu = new AppMenu();
        $this->AppRepository = $AppRepository;
        $this->AppAssignUserRepository = $AppAssignUserRepository;
        $this->appIconOriginalImageUploadPath = Config::get('constant.appIconOriginalImageUploadPath');
        $this->appIconThumbImageUploadPath = Config::get('constant.appIconThumbImageUploadPath');
        $this->appIconThumbImageWidth = Config::get('constant.appIconThumbImageWidth');
        $this->appIconThumbImageHeight = Config::get('constant.appIconThumbImageHeight');
        $this->bcOriginalImageUploadPath = Config::get('constant.bcOriginalImageUploadPath');
        $this->bcThumbImageUploadPath = Config::get('constant.bcThumbImageUploadPath');
        $this->bcThumbImageWidth = Config::get('constant.bcThumbImageWidth');
        $this->bcThumbImageHeight = Config::get('constant.bcThumbImageHeight');
        $this->sponsorsplashOriginalImageUploadPath = Config::get('constant.sponsorsplashOriginalImageUploadPath');
        $this->sponsorsplashThumbImageUploadPath = Config::get('constant.sponsorsplashThumbImageUploadPath');
        $this->sponsorsplashThumbImageWidth = Config::get('constant.sponsorsplashThumbImageWidth');
        $this->sponsorsplashThumbImageHeight = Config::get('constant.sponsorsplashThumbImageHeight');
        $this->addscreenshotOriginalImageUploadPath = Config::get('constant.addscreenshotOriginalImageUploadPath');
        $this->addscreenshotThumbImageUploadPath = Config::get('constant.addscreenshotThumbImageUploadPath');        
        $this->addscreenshotThumbImageWidth = Config::get('constant.addscreenshotThumbImageWidth');
        $this->addscreenshotThumbImageHeight = Config::get('constant.addscreenshotThumbImageHeight');
        
        $this->addIpadScreenshotThumbImageWidth = Config::get('constant.addIpadScreenshotThumbImageWidth');
        $this->addIpadScreenshotThumbImageHeight = Config::get('constant.addIpadScreenshotThumbImageHeight');
        
        $this->appLogoOriginalImageUploadPath = Config::get('constant.appLogoOriginalImageUploadPath');
        $this->appLogoThumbImageUploadPath = Config::get('constant.appLogoThumbImageUploadPath');
        $this->appLogoThumbImageWidth = Config::get('constant.appLogoThumbImageWidth');
        $this->appLogoThumbImageHeight = Config::get('constant.appLogoThumbImageHeight');
        $this->homeScreenBgOriginalImageUploadPath = Config::get('constant.homeScreenBgOriginalImageUploadPath');
        $this->homeScreenBgThumbImageUploadPath = Config::get('constant.homeScreenBgThumbImageUploadPath');
        $this->homeScreenBgThumbImageWidth = Config::get('constant.homeScreenBgThumbImageWidth');
        $this->homeScreenBgThumbImageHeight = Config::get('constant.homeScreenBgThumbImageHeight');
        $this->bgImageOriginalImageUploadPath = Config::get('constant.bgImageOriginalImageUploadPath');
        $this->bgImageThumbImageUploadPath = Config::get('constant.bgImageThumbImageUploadPath');
        $this->bgImageThumbImageWidth = Config::get('constant.bgImageThumbImageWidth');
        $this->bgImageThumbImageHeight = Config::get('constant.bgImageThumbImageHeight');
        $this->menuLogoOriginalImageUploadPath = Config::get('constant.menuLogoOriginalImageUploadPath');
        $this->menuLogoThumbImageUploadPath = Config::get('constant.menuLogoThumbImageUploadPath');
        $this->menuLogoThumbImageWidth = Config::get('constant.menuLogoThumbImageWidth');
        $this->menuLogoThumbImageHeight = Config::get('constant.menuLogoThumbImageHeight');
        $this->appBgOriginalImageUploadPath = Config::get('constant.appBgOriginalImageUploadPath');
        $this->appBgThumbImageUploadPath = Config::get('constant.appBgThumbImageUploadPath');
        $this->appBgThumbImageWidth = Config::get('constant.appBgThumbImageWidth');
        $this->appBgThumbImageHeight = Config::get('constant.appBgThumbImageHeight');
        $this->imageOriginalImageUploadPath = Config::get('constant.imageOriginalImageUploadPath');
        $this->imageThumbImageUploadPath = Config::get('constant.imageThumbImageUploadPath');
        $this->imageThumbImageWidth = Config::get('constant.imageThumbImageWidth');
        $this->imageThumbImageHeight = Config::get('constant.imageThumbImageHeight');

        $this->headerSideMenuImgPath = Config::get('constant.headerImg');
    }

    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();
        
        if($user)
        {
            $userRole = $user->role_id;
            $appArray = array();

            if($userRole != 1)
            {
                $appAssignData = $this->AppAssignUserRepository->getAppByAssignUser($user->id);
                if($appAssignData)
                {
                    foreach($appAssignData as $k=>$v)
                    {
                        $appArray[] = $v->app_basic_id;
                    }
                }

            }

            $appData = $this->AppRepository->getAllAppData($appArray,$userRole,1);

            $data = array();
            foreach($appData as $key=>$val)
            {   
                $basicDetail = $val->getAllBasicDetailData->where('app_section_slug','app_icon');
                $basicDetailData = array();
                foreach($basicDetail as $k=>$v)
                {
                    $detailArray = array();
                    $detailArray['id'] = $v->id;
                    $detailArray['section_json_data'] = $v->section_json_data;
                    if($v->app_section_slug == 'app_icon')
                    {                        
                        $detailArray['app_icon_thumb_url'] = url($this->appIconThumbImageUploadPath.'default.png');
                        $detailArray['app_icon_original_url'] = url($this->appIconOriginalImageUploadPath.'default.png');                       
                        if(isset($v->section_json_data) && $v->section_json_data!='')
                        {
                            $appJsonData = json_decode($v->section_json_data);
                            if(File::exists(public_path($this->appIconThumbImageUploadPath . $appJsonData->app_icon)) && $appJsonData->app_icon != ''){
                                $app_icon_thumb_url = url($this->appIconThumbImageUploadPath.$appJsonData->app_icon);
                                $app_icon_original_url = url($this->appIconOriginalImageUploadPath.$appJsonData->app_icon);
                            }else{
                                $app_icon_thumb_url = url($this->appIconThumbImageUploadPath.'default.png');
                                $app_icon_original_url = url($this->appIconOriginalImageUploadPath.'default.png');
                            }  
                            $detailArray['app_icon_thumb_url'] = $app_icon_thumb_url; 
                            $detailArray['app_icon_original_url'] = $app_icon_original_url; 
                        }   
                    }
                    $basicDetailData[$v->app_section_slug] = $detailArray;
                }
                
                $value = $val->toArray();
                unset($value['get_all_basic_detail_data']);   
                unset($value['app_json_data']);        
                $data[$key] = $value; 
                $data[$key]['basicDetail'] = $basicDetailData;                
            }
            
            $outputArray['data'] = $data;
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function getsingleappdata(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {   
            $app_id = $body['id'];

            // get application assign user data
            $app_assign_data=$this->AppAssignUserRepository->getUserByAppId($app_id);
            if(isset($app_assign_data) && count($app_assign_data)>0){
                $app_assign_bool = true;
            }else {
                $app_assign_bool = false;
            }
            $appData = $this->AppRepository->getSingleAppData($app_id);

            $data = array();                     
            $basicDetail = $appData->getAllBasicDetailData;
          
            $basicDetailData = array();
            foreach($basicDetail as $k=>$v)
            {
                $detailArray = array();
                $detailArray['id'] = $v->id;
                $detailArray['section_json_data'] = $v->section_json_data;
                if($v->app_section_slug == 'app_icon')
                {                        
                    $detailArray['app_icon_thumb_url'] = url($this->appIconThumbImageUploadPath.'default.png');
                    $detailArray['app_icon_original_url'] = url($this->appIconOriginalImageUploadPath.'default.png');                       
                    if(isset($v->section_json_data) && $v->section_json_data!='')
                    {
                        $appJsonData = json_decode($v->section_json_data);
                        if(File::exists(public_path($this->appIconThumbImageUploadPath . $appJsonData->app_icon)) && $appJsonData->app_icon != ''){
                            $app_icon_thumb_url = url($this->appIconThumbImageUploadPath.$appJsonData->app_icon);
                            $app_icon_original_url = url($this->appIconOriginalImageUploadPath.$appJsonData->app_icon);
                        }else{
                            $app_icon_thumb_url = url($this->appIconThumbImageUploadPath.'default.png');
                            $app_icon_original_url = url($this->appIconOriginalImageUploadPath.'default.png');
                        }  
                        $detailArray['app_icon_thumb_url'] = $app_icon_thumb_url; 
                        $detailArray['app_icon_original_url'] = $app_icon_original_url; 
                    }   
                }
                if($v->app_section_slug == 'splash_screen')
                {
                    $detailArray['bc_image_thumb_url'] = url($this->bcThumbImageUploadPath.'default.png');
                    $detailArray['bc_image_original_url'] = url($this->bcOriginalImageUploadPath.'default.png');
                    
                    if(isset($v->section_json_data) && $v->section_json_data!='')
                    {
                        $bcJsonData = json_decode($v->section_json_data);
                        if(File::exists(public_path($this->bcThumbImageUploadPath . $bcJsonData->bc_image)) && $bcJsonData->bc_image != ''){
                            $bc_thumb_url = url($this->bcThumbImageUploadPath.$bcJsonData->bc_image);
                            $bc_original_url = url($this->bcOriginalImageUploadPath.$bcJsonData->bc_image);
                        }else{
                            $bc_thumb_url = url($this->bcThumbImageUploadPath.'default.png');
                            $bc_original_url = url($this->bcOriginalImageUploadPath.'default.png');
                        }  
                        $detailArray['bc_image_thumb_url'] = $bc_thumb_url; 
                        $detailArray['bc_image_original_url'] = $bc_original_url; 
                    }  
                }
                if($v->app_section_slug == 'sponsor_splash')
                {
                    $detailArray['sponsorsplash_image_thumb_url'] = url($this->sponsorsplashThumbImageUploadPath.'default.png');
                    $detailArray['sponsorsplash_image_original_url'] = url($this->sponsorsplashOriginalImageUploadPath.'default.png');
                    $detailArray['section_json_data'] = $v->section_json_data;
                    if(isset($v->section_json_data) && $v->section_json_data!='')
                    {
                        $sponsorsplashJsonData = json_decode($v->section_json_data);
                        if(File::exists(public_path($this->sponsorsplashThumbImageUploadPath . $sponsorsplashJsonData->sponsorsplash_image)) && $sponsorsplashJsonData->sponsorsplash_image != ''){
                            $sponsorsplash_thumb_url = url($this->sponsorsplashThumbImageUploadPath.$sponsorsplashJsonData->sponsorsplash_image);
                            $sponsorsplash_original_url = url($this->sponsorsplashOriginalImageUploadPath.$sponsorsplashJsonData->sponsorsplash_image);
                        }else{
                            $sponsorsplash_thumb_url = url($this->sponsorsplashThumbImageUploadPath.'default.png');
                            $sponsorsplash_original_url = url($this->sponsorsplashOriginalImageUploadPath.'default.png');
                        }  
                        $detailArray['sponsorsplash_image_thumb_url'] = $sponsorsplash_thumb_url; 
                        $detailArray['sponsorsplash_image_original_url'] = $sponsorsplash_original_url; 
                    }  
                }
                if($v->app_section_slug == 'add_screenshot')
                {
                    $add_screenshot_data = array();
                    $order = 0;
                    if(isset($v->section_json_data) && $v->section_json_data!='')
                    {
                        $addscreenshotJsonData = json_decode($v->section_json_data);
                        foreach($addscreenshotJsonData as $k1=>$v1)
                        {
                            $ass_data = array();
                            $ass_data['order'] = $v1->order;
                            if($order < $v1->order)
                            {
                                $order = $v1->order;
                            }
                            if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1->add_screenshot)) && $v1->add_screenshot != ''){
                                $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1->add_screenshot);
                                $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1->add_screenshot);
                            }else{
                                $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
                                $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
                            }  
                            $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
                            $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
                            $ass_data['add_screenshot'] = $v1->add_screenshot;
                            $add_screenshot_data[] = $ass_data;
                        }
                    }
                    $detailArray['add_screenshot_data'] = $add_screenshot_data;
                    $detailArray['order'] = $order;
                    //echo "<Pre>";print_r($detailArray);exit;  
                }
                
                if($v->app_section_slug == 'add_ipad_screenshot')
                {
                    $add_screenshot_data = array();
                    $order = 0;
                    if(isset($v->section_json_data) && $v->section_json_data!='')
                    {
                        $addscreenshotJsonData = json_decode($v->section_json_data);
                        foreach($addscreenshotJsonData as $k1=>$v1)
                        {
                            $ass_data = array();
                            $ass_data['order'] = $v1->order;
                            if($order < $v1->order)
                            {
                                $order = $v1->order;
                            }
                            if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1->add_screenshot)) && $v1->add_screenshot != ''){
                                $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1->add_screenshot);
                                $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1->add_screenshot);
                            }else{
                                $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
                                $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
                            }  
                            $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
                            $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
                            $ass_data['add_screenshot'] = $v1->add_screenshot;
                            $add_screenshot_data[] = $ass_data;
                        }
                    }
                    $detailArray['add_screenshot_data'] = $add_screenshot_data;
                    $detailArray['order'] = $order;  
                }
                
                if($v->app_section_slug == 'home_screen')
                {
                    $detailArray['appLogo_thumb_url'] = url($this->appLogoThumbImageUploadPath.'default.png');
                    $detailArray['appLogo_original_url'] = url($this->appLogoOriginalImageUploadPath.'default.png');
                    $detailArray['home_screen_bg_thumb_url'] = url($this->homeScreenBgThumbImageUploadPath.'default.png');
                    $detailArray['home_screen_bg_original_url'] = url($this->homeScreenBgOriginalImageUploadPath.'default.png');
                    $detailArray['bg_image_thumb_url'] = url($this->bgImageThumbImageUploadPath.'default.png');
                    $detailArray['bg_image_original_url'] = url($this->bgImageOriginalImageUploadPath.'default.png');
                    $detailArray['section_json_data'] = $v->section_json_data;
                    if(isset($v->section_json_data) && $v->section_json_data!='')
                    {
                        $homescreenJsonData = json_decode($v->section_json_data);
                        if(File::exists(public_path($this->appLogoThumbImageUploadPath . $homescreenJsonData->appLogo)) && $homescreenJsonData->appLogo != '' && File::exists(public_path($this->homeScreenBgThumbImageUploadPath . $homescreenJsonData->home_screen_bg)) && $homescreenJsonData->home_screen_bg != '' && File::exists(public_path($this->bgImageThumbImageUploadPath . $homescreenJsonData->bg_img)) && $homescreenJsonData->bg_img != ''){
                            $appLogo_thumb_url = url($this->appLogoThumbImageUploadPath.$homescreenJsonData->appLogo);
                            $appLogo_original_url = url($this->appLogoOriginalImageUploadPath.$homescreenJsonData->appLogo);
                            $home_screen_thumb_url = url($this->homeScreenBgThumbImageUploadPath.$homescreenJsonData->home_screen_bg);
                            $home_screen_original_url = url($this->homeScreenBgOriginalImageUploadPath.$homescreenJsonData->home_screen_bg);
                            $bg_image_thumb_url = url($this->bgImageThumbImageUploadPath.$homescreenJsonData->bg_img);
                            $bg_image_original_url = url($this->bgImageOriginalImageUploadPath.$homescreenJsonData->bg_img);
                        }else{
                            $appLogo_thumb_url = url($this->appLogoThumbImageUploadPath.'default.png');
                            $appLogo_original_url = url($this->appLogoOriginalImageUploadPath.'default.png');
                            $home_screen_thumb_url = url($this->homeScreenBgThumbImageUploadPath.'default.png');
                            $home_screen_original_url = url($this->homeScreenBgOriginalImageUploadPath.'default.png');
                            $bg_image_thumb_url = url($this->bgImageThumbImageUploadPath.'default.png');
                            $bg_image_original_url = url($this->bgImageOriginalImageUploadPath.'default.png');
                        }  
                        $detailArray['appLogo_thumb_url'] = $appLogo_thumb_url; 
                        $detailArray['appLogo_original_url'] = $appLogo_original_url;
                        $detailArray['home_screen_thumb_url'] = $home_screen_thumb_url; 
                        $detailArray['home_screen_original_url'] = $home_screen_original_url; 
                        $detailArray['bg_image_thumb_url'] = $bg_image_thumb_url; 
                        $detailArray['bg_image_original_url'] = $bg_image_original_url;  
                    }  
                }
                if($v->app_section_slug == 'menu_configuration')
                {
                    $detailArray['menuLogo_thumb_url'] = url($this->menuLogoThumbImageUploadPath.'default.png');
                    $detailArray['menuLogo_original_url'] = url($this->menuLogoOriginalImageUploadPath.'default.png');
                    $detailArray['appBg_thumb_url'] = url($this->appBgThumbImageUploadPath.'default.png');
                    $detailArray['appBg_original_url'] = url($this->appBgOriginalImageUploadPath.'default.png');
                    $detailArray['image_thumb_url'] = url($this->imageThumbImageUploadPath.'default.png');
                    $detailArray['image_original_url'] = url($this->imageOriginalImageUploadPath.'default.png');
                    //print_r($detailArray['section_json_data']);
                    $detailArray['section_json_data'] = $v->section_json_data;
                    if(isset($v->section_json_data) && $v->section_json_data!='')
                    {
                        $menuconfigurationJsonData = json_decode($v->section_json_data);
                        if(File::exists(public_path($this->menuLogoThumbImageUploadPath . $menuconfigurationJsonData->menuLogo)) && $menuconfigurationJsonData->menuLogo != '' && File::exists(public_path($this->appBgThumbImageUploadPath . $menuconfigurationJsonData->app_bg)) && $menuconfigurationJsonData->app_bg != '' && File::exists(public_path($this->imageThumbImageUploadPath . $menuconfigurationJsonData->image)) && $menuconfigurationJsonData->image != ''){
                            $menuLogo_thumb_url = url($this->menuLogoThumbImageUploadPath.$menuconfigurationJsonData->menuLogo);
                            $menuLogo_original_url = url($this->menuLogoOriginalImageUploadPath.$menuconfigurationJsonData->menuLogo);
                            $appBg_thumb_url = url($this->appBgThumbImageUploadPath.$menuconfigurationJsonData->app_bg);
                            $appBg_original_url = url($this->appBgOriginalImageUploadPath.$menuconfigurationJsonData->app_bg);
                            $image_thumb_url = url($this->imageThumbImageUploadPath.$menuconfigurationJsonData->image);
                            $image_original_url = url($this->imageOriginalImageUploadPath.$menuconfigurationJsonData->image);
                        }else{
                            $menuLogo_thumb_url = url($this->menuLogoThumbImageUploadPath.'default.png');
                            $menuLogo_original_url = url($this->menuLogoOriginalImageUploadPath.'default.png');
                            $appBg_thumb_url = url($this->appBgThumbImageUploadPath.'default.png');
                            $appBg_original_url = url($this->appBgOriginalImageUploadPath.'default.png');
                            $image_thumb_url = url($this->imageThumbImageUploadPath.'default.png');
                            $image_original_url = url($this->imageOriginalImageUploadPath.'default.png');
                        }  
                        $detailArray['menuLogo_thumb_url'] = $menuLogo_thumb_url; 
                        $detailArray['menuLogo_original_url'] = $menuLogo_original_url;
                        $detailArray['appBg_thumb_url'] = $appBg_thumb_url; 
                        $detailArray['appBg_original_url'] = $appBg_original_url; 
                        $detailArray['image_thumb_url'] = $image_thumb_url; 
                        $detailArray['image_original_url'] = $image_original_url;  
                    }  
                }
                $basicDetailData[$v->app_section_slug] = $detailArray;
            }
            $data = $appData->toArray();
            unset($data['get_all_basic_detail_data']);   
            unset($data['app_json_data']); 
            $data['basicDetail'] = $basicDetailData;
            // append assign app user details
            $data['app_assign']=$app_assign_bool;                          
            $outputArray['data'] = $data;
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function createApp(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
       // echo JWTAuth::getToken(); exit;
        if($user)
        {
            $user_id = $user->id;
            $app_name = $body['app_name'];
            $app_exist = AppBasic::where('app_name',$app_name)->first();
            // check app name is exist
            if($app_exist != null) {

                $outputArray['status']= 0;
                $outputArray['message'] = trans('appmessages.app_name_unique');
                
            } 
            else {
                $insertData['app_name'] = $app_name;
                $insertData['app_code'] = str_slug($app_name, "_");
                $insertData['app_unique_id'] = Helpers::generateRandomString();
                $insertData['app_created_by'] = $user_id;
                $insertData['version'] = '1.0';
                $appDetail = $this->AppRepository->saveAppData($insertData); 
                $app_id = $appDetail->id;

                $allAppSection = $appDetail = $this->AppRepository->getAllAppSection();


                // add css 

                $result['menuicon_css'] = DB::table('app_css')
                                                ->where('css_component','menuicon_css')
                                                ->pluck('css_properties')
                                                ->toArray();

                $result['header_css'] = DB::table('app_css')
                                                ->where('css_component','header_css')
                                                ->pluck('css_properties')
                                                ->toArray();

                

                $result['statusbar_css'] = DB::table('app_css')
                                                ->where('css_component','statusbar_css')
                                                ->pluck('css_properties')
                                                ->toArray();


                $cssMenuIcon[] =  $result['menuicon_css'][0];
                $cssMenuHeader[] =  $result['header_css'][0];
                $cssMenuStatusbar[] =  $result['statusbar_css'][0];

                $mainMenuCss['menuIconCss'] = json_decode($cssMenuIcon[0]);
                $mainMenuCss['headerCss'] = json_decode($cssMenuHeader[0]);
                $mainMenuCss['statusBarCss'] = json_decode($cssMenuStatusbar[0]);
                
                $finalMenuJson = []; 
                $finalMenuJson[0]['menuIconCss'] = $mainMenuCss['menuIconCss'];
                $finalMenuJson[1]['headerCss'] = $mainMenuCss['headerCss'];
                $finalMenuJson[2]['statusBarCss'] = $mainMenuCss['statusBarCss'];
    
                $updateQry = DB::table('app_basic')
                                ->where('id', $app_id)
                                ->update(['app_general_css_json_data' => json_encode($finalMenuJson)]);
                                        
                $result['menu css'] = DB::table('app_css')
                                                ->where('css_component','menu_css')
                                                ->pluck('css_properties')
                                                ->toArray();

                $result['arrow css'] = DB::table('app_css')
                                                ->where('css_component','arrow_css')
                                                ->pluck('css_properties')
                                                ->toArray();

                $result['submenu css'] = DB::table('app_css')
                                                ->where('css_component','submenu_css')
                                                ->pluck('css_properties')
                                                ->toArray();

                $result['tab css'] = DB::table('app_css')
                                                ->where('css_component','tab_css')
                                                ->pluck('css_properties')
                                                ->toArray();       

                // print_r($result['menu css']);            
                $cssSideMenuCss[] =  $result['menu css'][0];
                $cssSideMenuArrowCss[] =  $result['arrow css'][0];
                $cssSideMenuSubmenuCss[] =  $result['submenu css'][0];
                $cssSideMenuTabCss[] =  $result['tab css'][0];

                
                $sideMenuCss = [];
                $sideMenuCss['mainMenu'] = json_decode($cssSideMenuCss[0]);
                $sideMenuCss['subMenu'] = json_decode($cssSideMenuSubmenuCss[0]);
                $sideMenuCss['arrow'] = json_decode($cssSideMenuArrowCss[0]);
                $sideMenuCss['tabMenu'] = json_decode($cssSideMenuTabCss[0]);
                
                $finalSideMenuJson = []; 
                $finalSideMenuJson[0]['mainMenu'] = $sideMenuCss['mainMenu'];
                $finalSideMenuJson[1]['subMenu'] = $sideMenuCss['subMenu'];
                $finalSideMenuJson[2]['arrow'] = $sideMenuCss['arrow'];
                $finalSideMenuJson[3]['tabMenu'] = $sideMenuCss['tabMenu']; 
                
                $finalSideData['sideMenuCss'] = $finalSideMenuJson; 
                
                $updateQry = DB::table('app_basic')
                                ->where('id', $app_id)
                                ->update(['app_side_menu_css_json_data' => json_encode($finalSideData)]);

                foreach($allAppSection as $key=>$val)
                {
                    $insertAppBasicData = array();
                    $insertAppBasicData['app_basic_id'] = $app_id;
                    $insertAppBasicData['app_section_slug'] = $val->app_section_slug;
                    $insertAppBasicData['app_section_id'] = $val->id;
                    $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertAppBasicData); 

                }

                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.app_create_msg');
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    



    }
    public function editApp(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user)
        {
            $user_id = $user->id;
            $app_name = $body['app_name'];
            $app_id = $body['id'];
            
            $updateData['app_name'] = $app_name;
            $updateData['id'] = $app_id;
            $appDetail = $this->AppRepository->saveAppData($updateData);                
            $outputArray['status'] = 1;
            $outputArray['message'] = trans('appmessages.app_edit_msg');
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }
    
    public function updateMenuLocationType(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {   
            $app_id = $body['app_basic_id'];
            $menu_location_type = (isset($body['menu_location_type']) && $body['menu_location_type'] != null && $body['menu_location_type'] != '') ? $body['menu_location_type'] : null;
           
            $parentMenuCount = $this->objAppMenu->checkParentMenuCount($app_id);
            $subMenuCountrep = $this->objAppMenu->checkListMenuShowChildOnCount($app_id);
            
//            if($subMenuCountrep == '2') && $parentMenuCount > 5
            
            if(($menu_location_type == '2' || $menu_location_type == 2))
            {
                if($parentMenuCount <= 5)
                {
                    if($subMenuCountrep == '1')
                    {
                        $updateData = [];
                        $updateData['id'] = $app_id;
                        $updateData['menu_location_type'] = $menu_location_type;
                        $appUpdateDetail = $this->AppRepository->saveAppData($updateData);
                        
                        if($appUpdateDetail)
                        {
                            $outputArray['status'] = 1;
                            $outputArray['message'] = trans('appmessages.menu_type_selected_successfully');
                        }
                        else
                        {
                            $outputArray['status'] = 0;
                            $outputArray['message'] = trans('appmessages.default_error_msg');
                        } 
                    }
                    else
                    {
                        $outputArray['status'] = 0;
                        $outputArray['message'] = trans('appmessages.list_menu_force_full_screen_check');
                    }
                    
                }
                else
                {
                    $outputArray['status'] = 0;
                    $outputArray['message'] = trans('appmessages.parent_menu_type_morethan_five');
                }               
            }
            else
            {   
                $updateData = [];
                $updateData['id'] = $app_id;
                $updateData['menu_location_type'] = $menu_location_type;
                $appUpdateDetail = $this->AppRepository->saveAppData($updateData);

                if($appUpdateDetail)
                {
                    $outputArray['status'] = 1;
                    $outputArray['message'] = trans('appmessages.menu_type_selected_successfully');
                }
                else
                {
                    $outputArray['status'] = 0;
                    $outputArray['message'] = trans('appmessages.default_error_msg');
                }                                           
            }                   
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function splashScreen(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        $is_bc_image = $body['is_bc_image'];

        if($user) 
        {
            $fileName = (isset($body['old_bc_image']) && $body['old_bc_image']!='')?$body['old_bc_image']:'';
            if (Input::file()) {
                $file = Input::file('bc_image');
                if (!empty($file)) {
                    $fileName = 'bcimage_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->bcOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->bcThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->bcThumbImageWidth, $this->bcThumbImageHeight)->save($pathThumb);
                    if(isset($body['old_bc_image']) && $body['old_bc_image'] !='')
                    {
                        if(File::exists(public_path($this->bcThumbImageUploadPath . $body['old_bc_image'])) && $body['old_bc_image'] != ''){
                            File::delete(public_path($this->bcThumbImageUploadPath . $body['old_bc_image']));      
                        }
                        if(File::exists(public_path($this->bcOriginalImageUploadPath . $body['old_bc_image'])) && $body['old_bc_image'] != '')
                        {
                            File::delete(public_path($this->bcOriginalImageUploadPath . $body['old_bc_image']));      
                        }           
                        
                    }
                }
            }
            $id = $body['id'];
            $jsonData['bc_image'] = $fileName;
            $jsonData['is_bc_image'] = $is_bc_image;

            $app_id = $body['app_id'];
            // check app publish counter
            $checkAppPublishCounter = $this->AppRepository->getSingleAppData($app_id);
            if( isset($checkAppPublishCounter) && $checkAppPublishCounter->app_publish_counter > 0){
                $outputArray['change'] = true;
            }
            else{
                $outputArray['change'] = false;
            }
            
            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($jsonData);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            $outputArray['data']['bc_image_thumb_url'] = url($this->bcThumbImageUploadPath.$fileName);
            $outputArray['data']['bc_image_original_url'] = url($this->bcOriginalImageUploadPath.$fileName);
            $outputArray['data']['section_json_data'] = json_encode($jsonData);
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.splash_screen_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function sponsorsplash(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        $no_sec_display = $body['no_sec_display'];
        if($user) 
        {
            $fileName = (isset($body['old_sponsorsplash_image']) && $body['old_sponsorsplash_image']!='')?$body['old_sponsorsplash_image']:'';
            if (Input::file()) {
                $file = Input::file('sponsorsplash_image');
                if (!empty($file)) {
                    $fileName = 'sponsorsplash_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->sponsorsplashOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->sponsorsplashThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->sponsorsplashThumbImageWidth, $this->sponsorsplashThumbImageHeight)->save($pathThumb);
                    if($body['old_sponsorsplash_image'] !='')
                    {
                        if(File::exists(public_path($this->sponsorsplashThumbImageUploadPath . $body['old_sponsorsplash_image'])) && $body['old_sponsorsplash_image'] != ''){
                            File::delete(public_path($this->sponsorsplashThumbImageUploadPath . $body['old_sponsorsplash_image']));      
                        }
                        if(File::exists(public_path($this->sponsorsplashOriginalImageUploadPath . $body['old_sponsorsplash_image'])) && $body['old_sponsorsplash_image'] != '')
                        {
                            File::delete(public_path($this->sponsorsplashOriginalImageUploadPath . $body['old_sponsorsplash_image']));      
                        }           
                        
                    }
                }
            }
            $id = $body['id'];
            $jsonData['sponsorsplash_image'] = $fileName;
            $jsonData['no_sec_display'] = $no_sec_display;

            
            
            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($jsonData);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            $outputArray['data']['sponsorsplash_image_thumb_url'] = url($this->sponsorsplashThumbImageUploadPath.$fileName);
            $outputArray['data']['sponsorsplash_image_original_url'] = url($this->sponsorsplashOriginalImageUploadPath.$fileName);
            $outputArray['data']['section_json_data'] = json_encode($jsonData);
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.sponser_splash_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function basicinformation(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user) 
        {   
            $app_name = $body['app_name'];
            $id = $body['id'];
            $app_id = $body['app_id'];

            //
            $fetchExist =  $this->AppRepository->getSingleAppData($app_id);
            
            $existAppname =  $fetchExist->app_name;
            //
            $updateData['app_name'] = $app_name;
            $updateData['id'] = $app_id;
            $appDetail = $this->AppRepository->saveAppData($updateData);  
            // check new app name detection
            // $existAppname != $app_name
            if(isset($fetchExist) && $fetchExist->app_publish_counter > 0) {
                $outputArray['change'] = true;
            } else {
                $outputArray['change'] = false;
            }

            unset($body['app_name']);
            unset($body['app_id']);
            unset($body['id']);
            unset($body['token']);
            

            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($body);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            $outputArray['data']['section_json_data'] = json_encode($body);
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.basic_information_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }
    
    public function appIcon(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        
        if($user) 
        {
            $fileName = (isset($body['old_app_icon']) && $body['old_app_icon']!='')?$body['old_app_icon']:'';
            if (Input::file()) 
            {
                $file = Input::file('app_icon');
                if (!empty($file)) 
                {   
                    $fileName = 'appicon_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->appIconOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->appIconThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->appIconThumbImageWidth, $this->appIconThumbImageHeight)->save($pathThumb);
                    
                    if($body['old_app_icon'] !='')
                    {
                        if(File::exists(public_path($this->appIconThumbImageUploadPath . $body['old_app_icon'])) && $body['old_app_icon'] != '')
                        {
                            File::delete(public_path($this->appIconThumbImageUploadPath . $body['old_app_icon']));      
                        }
                        if(File::exists(public_path($this->appIconOriginalImageUploadPath . $body['old_app_icon'])) && $body['old_app_icon'] != '')
                        {
                            File::delete(public_path($this->appIconOriginalImageUploadPath . $body['old_app_icon']));      
                        }           

                    }
                }
            }

            

            $id = $body['id'];            
            $jsonData['app_icon'] = $fileName;

            $app_id = $body['app_id'];
            // check app publish counter
            $checkAppPublishCounter = $this->AppRepository->getSingleAppData($app_id);
            if(isset($checkAppPublishCounter) && $checkAppPublishCounter->app_publish_counter > 0){
                $outputArray['change'] = true;
            }
            else{
                $outputArray['change'] = false;
            }


            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($jsonData);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            $outputArray['data']['app_icon_thumb_url'] = url($this->appIconThumbImageUploadPath.$fileName);
            $outputArray['data']['app_icon_original_url'] = url($this->appIconOriginalImageUploadPath.$fileName);
            $outputArray['data']['section_json_data'] = json_encode($jsonData);
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.app_icon_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function googleanalytic(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user) 
        {
            $id = $body['id'];
            // $appId = $body['appId'];
            // unset($body['id']);
            // unset($body['token']);
            $insertData['id'] = $id;
            // $insertData['appId'] = $appId;
            $insertData['section_json_data'] = json_encode($body);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            $outputArray['data']['section_json_data'] = json_encode($body);
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.google_analytic_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function addscreenshot(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user) 
        {
            if (Input::file()) {
                $file = Input::file('add_screenshot');
                if (!empty($file)) {
                    $fileName = 'appscreenshot_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->addscreenshotOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->addscreenshotThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->addscreenshotThumbImageWidth, $this->addscreenshotThumbImageHeight)->save($pathThumb);
                    
                }
            }

            $id = $body['id'];

            $appBasicDetail = $this->AppRepository->getAppBasicDetailData($id);
            $jsonSectionData =  json_decode($appBasicDetail->section_json_data);
            $last_order = 0;
            if(!empty($jsonSectionData))
            {
                foreach($jsonSectionData as $k=>$v)
                {
                    $value = array();
                    $order = $v->order;
                    $value['order'] = $order;
                    if($last_order < $order)
                            {
                                    $last_order = $order;
                            }
                    $value['add_screenshot'] = $v->add_screenshot;
                    $jsonData[] = $value;
                } 
            }
            $insertjsonData['order'] = $last_order + 1;
            $insertjsonData['add_screenshot'] = $fileName;
               

            $jsonData[] = $insertjsonData; 

            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($jsonData);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
           
            $app_id = $body['app_id'];
            // check app publish counter
            $checkAppPublishCounter = DB::table('app_basic')->where('id', $app_id)->first();
            if($checkAppPublishCounter->app_publish_counter > 0){
                $outputArray['change'] = true;
            }
            else{
                $outputArray['change'] = false;
            }
            
            $outputArray['data']['section_json_data'] = json_encode($jsonData);
            foreach($jsonData as $k1=>$v1)
        	{
        		$ass_data = array();
        		$ass_data['order'] = $v1['order'];
                if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1['add_screenshot'])) && $v1['add_screenshot'] != ''){
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1['add_screenshot']);
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1['add_screenshot']);
                }else{
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
                }  
                $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
                $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
                $ass_data['add_screenshot'] = $v1['add_screenshot'];
                $add_screenshot_data[] = $ass_data;
            }
            $outputArray['data']['add_screenshot_data'] = $add_screenshot_data;
            $outputArray['data']['order'] = $insertjsonData['order'];
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.add_screenshot_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function removescreenshot(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user) 
        {

            $id = $body['id'];
            $remove_screenshot = $body['add_screenshot'];
            $remove_order = $body['order'];
            $appBasicDetail = $this->AppRepository->getAppBasicDetailData($id);
            $jsonSectionData =  json_decode($appBasicDetail->section_json_data);
            $last_order = 0;
            if(!empty($jsonSectionData))
        	{
	            foreach($jsonSectionData as $k=>$v)
	            {
	            	$order = $v->order;
	            	if($remove_order < $v->order)
            		{
            			$order = $v->order - 1;
            		}
	            	if($v->add_screenshot != $remove_screenshot)
            		{
            			if($last_order < $order)
		        		{
		        			$last_order = $order;
		        		}
		            	$value = array();
		            	$value['order'] = $order;
		            	$value['add_screenshot'] = $v->add_screenshot;
		            	$jsonData[] = $value;
	            	}
	            	else
            		{
            			if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v->add_screenshot)) && $v->add_screenshot != ''){
		                    File::delete(public_path($this->addscreenshotThumbImageUploadPath . $v->add_screenshot));      
		                }
		                if(File::exists(public_path($this->addscreenshotOriginalImageUploadPath . $v->add_screenshot)) && $v->add_screenshot != '')
		                {
		                    File::delete(public_path($this->addscreenshotOriginalImageUploadPath . $v->add_screenshot));      
		                }  
            		}
	            } 
            }
             
            $insertData['id'] = $id;
            if(!empty($jsonData))
        	{
            	$insertData['section_json_data'] = json_encode($jsonData);
        	}
        	else
    		{
    			$insertData['section_json_data'] = null;
    		}
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            if(!empty($jsonData))
        	{
	            $outputArray['data']['section_json_data'] = json_encode($jsonData);
	            foreach($jsonData as $k1=>$v1)
	        	{
	        		$ass_data = array();
	        		$ass_data['order'] = $v1['order'];
	                if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1['add_screenshot'])) && $v1['add_screenshot'] != ''){
	                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1['add_screenshot']);
	                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1['add_screenshot']);
	                }else{
	                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
	                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
	                }  
	                $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
	                $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
	                $ass_data['add_screenshot'] = $v1['add_screenshot'];
	                $add_screenshot_data[] = $ass_data;
	            }
	            $outputArray['data']['add_screenshot_data'] = $add_screenshot_data;
	            $outputArray['data']['order'] = $last_order;
	            $outputArray['status'] = '1';
	            $outputArray['message'] = trans('appmessages.remove_screenshot_update_msg');
            }
            else
        	{
        		$outputArray['data']['section_json_data'] = null;
    			$outputArray['data']['add_screenshot_data'] = null;
	            $outputArray['data']['order'] = 0;
	            $outputArray['status'] = '1';
	            $outputArray['message'] = trans('appmessages.remove_screenshot_update_msg');
        	}
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }
    
    public function addIpadScreenShot(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user) 
        {
            if (Input::file()) 
            {
                $file = Input::file('add_screenshot');
                if (!empty($file)) {
                    $fileName = 'appipadscreenshot_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->addscreenshotOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->addscreenshotThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->addIpadScreenshotThumbImageWidth, $this->addIpadScreenshotThumbImageHeight)->save($pathThumb);                    
                }
            }

            $id = $body['id'];

            $appBasicDetail = $this->AppRepository->getAppBasicDetailData($id);
            $jsonSectionData =  json_decode($appBasicDetail->section_json_data);
            $last_order = 0;
            if(!empty($jsonSectionData))
            {
                foreach($jsonSectionData as $k=>$v)
                {
                    $value = array();
                    $order = $v->order;
                    $value['order'] = $order;
                    if($last_order < $order)
                    {
                        $last_order = $order;
                    }
                    $value['add_screenshot'] = $v->add_screenshot;
                    $jsonData[] = $value;
                } 
            }
            $insertjsonData['order'] = $last_order + 1;
            $insertjsonData['add_screenshot'] = $fileName;
               

            $jsonData[] = $insertjsonData; 

            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($jsonData);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
           
            $app_id = $body['app_id'];
            // check app publish counter
            $checkAppPublishCounter = DB::table('app_basic')->where('id', $app_id)->first();
            if($checkAppPublishCounter->app_publish_counter > 0)
            {
                $outputArray['change'] = true;
            }
            else
            {
                $outputArray['change'] = false;
            }
            
            $outputArray['data']['section_json_data'] = json_encode($jsonData);
            foreach($jsonData as $k1=>$v1)
            {
                $ass_data = array();
                $ass_data['order'] = $v1['order'];
                if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1['add_screenshot'])) && $v1['add_screenshot'] != '')
                {
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1['add_screenshot']);
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1['add_screenshot']);
                }else{
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
                }  
                $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
                $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
                $ass_data['add_screenshot'] = $v1['add_screenshot'];
                $add_screenshot_data[] = $ass_data;
            }
            $outputArray['data']['add_screenshot_data'] = $add_screenshot_data;
            $outputArray['data']['order'] = $insertjsonData['order'];
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.add_screenshot_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function removeIpadScreenShot(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user) 
        {

            $id = $body['id'];
            $remove_screenshot = $body['add_screenshot'];
            $remove_order = $body['order'];
            $appBasicDetail = $this->AppRepository->getAppBasicDetailData($id);
            $jsonSectionData =  json_decode($appBasicDetail->section_json_data);
            $last_order = 0;
            if(!empty($jsonSectionData))
            {
                foreach($jsonSectionData as $k=>$v)
                {
                    $order = $v->order;
                    if($remove_order < $v->order)
                    {
                        $order = $v->order - 1;
                    }
                    if($v->add_screenshot != $remove_screenshot)
                    {
                        if($last_order < $order)
                        {
                            $last_order = $order;
                        }
                        $value = array();
                        $value['order'] = $order;
                        $value['add_screenshot'] = $v->add_screenshot;
                        $jsonData[] = $value;
                    }
                    else
                    {
                        if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v->add_screenshot)) && $v->add_screenshot != ''){
                            File::delete(public_path($this->addscreenshotThumbImageUploadPath . $v->add_screenshot));      
                        }
                        if(File::exists(public_path($this->addscreenshotOriginalImageUploadPath . $v->add_screenshot)) && $v->add_screenshot != '')
                        {
                            File::delete(public_path($this->addscreenshotOriginalImageUploadPath . $v->add_screenshot));      
                        }  
                    }
                } 
            }
             
            $insertData['id'] = $id;
            if(!empty($jsonData))
            {
            	$insertData['section_json_data'] = json_encode($jsonData);
            }
            else
            {
                $insertData['section_json_data'] = null;
            }
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            if(!empty($jsonData))
            {
                $outputArray['data']['section_json_data'] = json_encode($jsonData);
                foreach($jsonData as $k1=>$v1)
                {
                    $ass_data = array();
                    $ass_data['order'] = $v1['order'];
                    if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1['add_screenshot'])) && $v1['add_screenshot'] != ''){
                        $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1['add_screenshot']);
                        $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1['add_screenshot']);
                    }else{
                        $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
                        $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
                    }  
                    $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
                    $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
                    $ass_data['add_screenshot'] = $v1['add_screenshot'];
                    $add_screenshot_data[] = $ass_data;
                }
                $outputArray['data']['add_screenshot_data'] = $add_screenshot_data;
                $outputArray['data']['order'] = $last_order;
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.remove_screenshot_update_msg');
            }
            else
            {
                $outputArray['data']['section_json_data'] = null;
                $outputArray['data']['add_screenshot_data'] = null;
                $outputArray['data']['order'] = 0;
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.remove_screenshot_update_msg');
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }    
    
    public function homescreen(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        //print_r($body);die;
        if($user)
        {
            $fileName = (isset($body['old_appLogo_image']) && $body['old_appLogo_image']!='')?$body['old_appLogo_image']:'';
            if (Input::file()) {
                $file = Input::file('appLogo');
                if (!empty($file)) {
                    $fileName = 'appLogo_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->appLogoOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->appLogoThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->appLogoThumbImageWidth, $this->appLogoThumbImageHeight)->save($pathThumb);
                    if($body['old_appLogo_image'] !='')
                    {
                        if(File::exists(public_path($this->appLogoThumbImageUploadPath . $body['old_appLogo_image'])) && $body['old_appLogo_image'] != ''){
                            File::delete(public_path($this->appLogoThumbImageUploadPath . $body['old_appLogo_image']));      
                        }
                        if(File::exists(public_path($this->appLogoOriginalImageUploadPath . $body['old_appLogo_image'])) && $body['old_appLogo_image'] != '')
                        {
                            File::delete(public_path($this->appLogoOriginalImageUploadPath . $body['old_appLogo_image']));      
                        }           
                        
                    }
                }
            }
            $homescreenbg = (isset($body['old_home_screen_bg']) && $body['old_home_screen_bg']!='')?$body['old_home_screen_bg']:'';
            if (Input::file()) {
                $file = Input::file('home_screen_bg');
                if (!empty($file)) {
                    $homescreenbg = 'homeScreenBg_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->homeScreenBgOriginalImageUploadPath . $homescreenbg);
                    $pathThumb = public_path($this->homeScreenBgThumbImageUploadPath . $homescreenbg);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->homeScreenBgThumbImageWidth, $this->homeScreenBgThumbImageHeight)->save($pathThumb);
                    if($body['old_home_screen_bg'] !='')
                    {
                        if(File::exists(public_path($this->homeScreenBgThumbImageUploadPath . $body['old_home_screen_bg'])) && $body['old_home_screen_bg'] != ''){
                            File::delete(public_path($this->homeScreenBgThumbImageUploadPath . $body['old_home_screen_bg']));      
                        }
                        if(File::exists(public_path($this->homeScreenBgOriginalImageUploadPath . $body['old_home_screen_bg'])) && $body['old_home_screen_bg'] != '')
                        {
                            File::delete(public_path($this->homeScreenBgOriginalImageUploadPath . $body['old_home_screen_bg']));      
                        }           
                        
                    }
                }
            }
            $bgImage = (isset($body['old_bg_image']) && $body['old_bg_image']!='')?$body['old_bg_image']:'';
            if (Input::file()) {
                $file = Input::file('bg_img');
                if (!empty($file)) {
                    $bgImage = 'bgImage_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->bgImageOriginalImageUploadPath . $bgImage);
                    $pathThumb = public_path($this->bgImageThumbImageUploadPath . $bgImage);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->bgImageThumbImageWidth, $this->bgImageThumbImageHeight)->save($pathThumb);
                    if($body['old_bg_image'] !='')
                    {
                        if(File::exists(public_path($this->bgImageThumbImageUploadPath . $body['old_bg_image'])) && $body['old_bg_image'] != ''){
                            File::delete(public_path($this->bgImageThumbImageUploadPath . $body['old_bg_image']));      
                        }
                        if(File::exists(public_path($this->bgImageOriginalImageUploadPath . $body['old_bg_image'])) && $body['old_bg_image'] != '')
                        {
                            File::delete(public_path($this->bgImageOriginalImageUploadPath . $body['old_bg_image']));      
                        }           
                        
                    }
                }
            }
            $id = $body['id'];
            unset($body['app_id']);
            unset($body['id']);
            unset($body['token']);
            unset($body['old_appLogo_image']);
            unset($body['old_home_screen_bg']);
            unset($body['old_bg_image']);
            $body['appLogo'] = $fileName;
            $body['home_screen_bg'] = $homescreenbg;
            $body['bg_img'] = $bgImage;
            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($body);
            $appBasicDetail = $this->AppRepository->saveHomeScreenData($insertData);
            $outputArray['data']['appLogo_thumb_url'] = url($this->appLogoThumbImageUploadPath.$fileName);
            $outputArray['data']['appLogo_original_url'] = url($this->appLogoOriginalImageUploadPath.$fileName);
            $outputArray['data']['home_screen_bg_thumb_url'] = url($this->homeScreenBgThumbImageUploadPath.$homescreenbg);
            $outputArray['data']['home_screen_bg_original_url'] = url($this->homeScreenBgOriginalImageUploadPath.$homescreenbg);
            $outputArray['data']['bg_image_thumb_url'] = url($this->bgImageThumbImageUploadPath.$bgImage);
            $outputArray['data']['bg_image_original_url'] = url($this->bgImageOriginalImageUploadPath.$bgImage);
            $outputArray['data']['section_json_data'] = json_encode($body);
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.homescreen_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);  
    }
    
    public function menuconfiguration(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $fileName = (isset($body['old_menuLogo_image']) && $body['old_menuLogo_image']!='')?$body['old_menuLogo_image']:'';
            if (Input::file()) 
            {
                $file = Input::file('menuLogo');
                if (!empty($file)) {
                    $fileName = 'menuLogo_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->menuLogoOriginalImageUploadPath . $fileName);
                    $pathThumb = public_path($this->menuLogoThumbImageUploadPath . $fileName);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->menuLogoThumbImageWidth, $this->menuLogoThumbImageHeight)->save($pathThumb);
                    if($body['old_menuLogo_image'] !='')
                    {
                        if(File::exists(public_path($this->menuLogoThumbImageUploadPath . $body['old_menuLogo_image'])) && $body['old_menuLogo_image'] != ''){
                            File::delete(public_path($this->menuLogoThumbImageUploadPath . $body['old_menuLogo_image']));      
                        }
                        if(File::exists(public_path($this->menuLogoOriginalImageUploadPath . $body['old_menuLogo_image'])) && $body['old_menuLogo_image'] != '')
                        {
                            File::delete(public_path($this->menuLogoOriginalImageUploadPath . $body['old_menuLogo_image']));      
                        }           
                        
                    }
                }
            }
            $appbg = (isset($body['old_app_bg']) && $body['old_app_bg']!='')?$body['old_app_bg']:'';
            if (Input::file()) 
            {
                $file = Input::file('app_bg');
                if (!empty($file)) {
                    $appbg = 'appBg_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->appBgOriginalImageUploadPath . $appbg);
                    $pathThumb = public_path($this->appBgThumbImageUploadPath . $appbg);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->appBgThumbImageWidth, $this->appBgThumbImageHeight)->save($pathThumb);
                    if($body['old_app_bg'] !='')
                    {
                        if(File::exists(public_path($this->appBgThumbImageUploadPath . $body['old_app_bg'])) && $body['old_app_bg'] != ''){
                            File::delete(public_path($this->appBgThumbImageUploadPath . $body['old_app_bg']));      
                        }
                        if(File::exists(public_path($this->appBgOriginalImageUploadPath . $body['old_app_bg'])) && $body['old_app_bg'] != '')
                        {
                            File::delete(public_path($this->appBgOriginalImageUploadPath . $body['old_app_bg']));      
                        }           
                        
                    }
                }
            }
            $image = (isset($body['old_image']) && $body['old_image']!='')?$body['old_image']:'';
            if (Input::file()) {
                $file = Input::file('image');
                if (!empty($file)) {
                    $image = 'image_' . time() . '.' . $file->getClientOriginalExtension();
                    $pathOriginal = public_path($this->imageOriginalImageUploadPath . $image);
                    $pathThumb = public_path($this->imageThumbImageUploadPath . $image);
                    Image::make($file->getRealPath())->save($pathOriginal);
                    Image::make($file->getRealPath())->resize($this->imageThumbImageWidth, $this->imageThumbImageHeight)->save($pathThumb);
                    if($body['old_image'] !='')
                    {
                        if(File::exists(public_path($this->imageThumbImageUploadPath . $body['old_image'])) && $body['old_image'] != ''){
                            File::delete(public_path($this->imageThumbImageUploadPath . $body['old_image']));      
                        }
                        if(File::exists(public_path($this->imageOriginalImageUploadPath . $body['old_image'])) && $body['old_image'] != '')
                        {
                            File::delete(public_path($this->imageOriginalImageUploadPath . $body['old_image']));      
                        }           
                        
                    }
                }
            }
            $id = $body['id'];
            unset($body['app_id']);
            unset($body['id']);
            unset($body['token']);
            unset($body['old_menuLogo_image']);
            unset($body['old_app_bg']);
            unset($body['old_image']);
            $body['menuLogo'] = $fileName;
            $body['app_bg'] = $appbg;
            $body['image'] = $image;
            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($body);
            $appBasicDetail = $this->AppRepository->saveMenuConfigurationData($insertData);
            $outputArray['data']['menuLogo_thumb_url'] = url($this->menuLogoThumbImageUploadPath.$fileName);
            $outputArray['data']['menuLogo_original_url'] = url($this->menuLogoOriginalImageUploadPath.$fileName);
            $outputArray['data']['appBg_thumb_url'] = url($this->appBgThumbImageUploadPath.$appbg);
            $outputArray['data']['appBg_original_url'] = url($this->appBgOriginalImageUploadPath.$appbg);
            $outputArray['data']['image_thumb_url'] = url($this->imageThumbImageUploadPath.$image);
            $outputArray['data']['image_original_url'] = url($this->imageOriginalImageUploadPath.$image);
            $outputArray['data']['section_json_data'] = json_encode($body);
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.menuconfiguration_update_msg');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);  
    }
    
    public function notificationpopupformsave(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();               
        $body = $request->all();
               
        if($user) 
        {
            $app_id = $body['app_id'];
            $id = $body['id'];
            
            $notificationJsonData = [];
            $notificationJsonData['title'] = $body['title'];
            $notificationJsonData['message'] = $body['messageNotification'];
            $notificationJsonData['button1'] = $body['button1'];
            $notificationJsonData['button2'] = $body['button2'];
            $notificationJsonData['isShow'] = $body['isShow'];

            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($notificationJsonData);
            
            $notificationDetail = $this->AppRepository->saveNotificationData($insertData);
            
            if($notificationDetail)
            {
                $outputArray['data']['section_json_data'] = json_encode($body);
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.notificationpopupformsave');
            }
            else
            {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }
            
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);        
    }
    
    public function autoupgradepopupformsave(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();               
        $body = $request->all();
                      
        if($user) 
        {
            $app_id = $body['app_id'];
            $id = $body['id'];
            
            $autoupgradeJsonData = [];         
            $autoupgradeJsonData['title'] = $body['title'];
            $autoupgradeJsonData['buttonName'] = $body['ok_button_text'];
            $autoupgradeJsonData['message'] = $body['messageAutoupgrade'];
            $autoupgradeJsonData['isShow'] = $body['isShow'];
            $autoupgradeJsonData['application'] = array(
                "ios" => array(
                    "version" => $body['ios_version'],
                    "id" => $body['ios_app_id']
                ),
                "android" => array(
                    "version" => $body['android_version'],
                    "id" => $body['andr_app_id']
                )
            );
            
            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($autoupgradeJsonData);
            
            $autoupgradeDetail = $this->AppRepository->saveAutoupgradeData($insertData);
            
            if($autoupgradeDetail)
            {
                $outputArray['data']['section_json_data'] = json_encode($body);
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.autoupgradepopupformsave');
            }
            else
            {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }
            
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
        
    }
        
    public function ratepopupformsave(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();               
        $body = $request->all();
               
        if($user) 
        {
            $app_id = $body['app_id'];
            $id = $body['id'];
            
            $ratepopupJsonData = [];         
            
            // $ratepopupJsonData['title'] = $body['title'];
            $ratepopupJsonData['isShow'] = $body['isShow'];
            $ratepopupJsonData['andr_app_id'] = $body['rate_andr_app_id'];
            $ratepopupJsonData['ios_app_id'] = $body['rate_ios_app_id'];
            $ratepopupJsonData['uses_until_prompt'] = $body['uses_until_prompt'];
            $ratepopupJsonData['title'] = $body['rateTitle'];
            $ratepopupJsonData['message'] = $body['messageRatepopUp'];
            $ratepopupJsonData['rateThisButton'] = $body['agree_label'];
            $ratepopupJsonData['cancelButton'] = $body['decline_text'];
            $ratepopupJsonData['remindLaterButton'] = $body['remind_label'];
            $ratepopupJsonData['rateTitle'] = $body['ratepopup_title'];            
            $ratepopupJsonData['application'] = array(
                "ios" => array(
                    "version" => $body['ios_version'],
                    "id" => $body['rate_ios_app_id']
                ),
                "android" => array(
                    "version" => $body['android_version'],
                    "id" => $body['rate_andr_app_id']
                )
            );            
            
            

            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($ratepopupJsonData);
            
            $ratepopupDetail = $this->AppRepository->saveRatepopupData($insertData);
            
            if($ratepopupDetail)
            {
                $outputArray['data']['section_json_data'] = json_encode($body);
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.ratepopupformsave');
            }
            else
            {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function changescreenshotorder(Request $request)
    {
    	$user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user) 
        {   
            $id = $body['id'];
            $post_order_data = $body['order_data'];

            $appBasicDetail = $this->AppRepository->getAppBasicDetailData($id);
            $jsonSectionData =  json_decode($appBasicDetail->section_json_data);
            if(!empty($jsonSectionData))
            {
                foreach($jsonSectionData as $k=>$v)
                {
                    $order = $v->order;

                    $value = array();
                    $value['order'] = $order;
                    $value['add_screenshot'] = $v->add_screenshot;
                    $jsonData[$order] = $value;
                } 
            }
            $updatedJsonData = array();
            
            if($post_order_data!='')
            {	
                $post_order_data_array = explode(',',$post_order_data);
        	$i = 1;
                
                foreach($post_order_data_array as $k=>$v)
                {
                    $value = array();
                    $value = $jsonData[$v];
                    $order = $value['order'];
                    if($i != $v)
                    {
                        $value['order'] = $order = $i;
                    }
                    $updatedJsonData[$order - 1] = $value;
                    $i++;
                }	
            }
            
            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($updatedJsonData);            
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            $outputArray['data']['section_json_data'] = json_encode($updatedJsonData);
            foreach($updatedJsonData as $k1=>$v1)
            {
                $ass_data = array();
                $ass_data['order'] = $v1['order'];
                if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1['add_screenshot'])) && $v1['add_screenshot'] != '')         {
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1['add_screenshot']);
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1['add_screenshot']);
                }else{
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
                }  
                $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
                $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
                $ass_data['add_screenshot'] = $v1['add_screenshot'];
                $add_screenshot_data[] = $ass_data;
            }
            
            $outputArray['data']['add_screenshot_data'] = $add_screenshot_data;
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.order_screenshot_update_msg');  
            
            $app_id = $body['app_id'];
            // check app publish counter
            $checkAppPublishCounter = $this->AppRepository->getSingleAppData($app_id);
            if( isset($checkAppPublishCounter) && $checkAppPublishCounter->app_publish_counter > 0)
            {
                $outputArray['change'] = true;
            }
            else{
                $outputArray['change'] = false;
            }
            
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
        
    }
    
    
    public function changeIpadScreenShotOrder(Request $request)
    {
    	$user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user) 
        {
            $id = $body['id'];
            $post_order_data = $body['order_data'];
          
            $appBasicDetail = $this->AppRepository->getAppBasicDetailData($id);
            $jsonSectionData =  json_decode($appBasicDetail->section_json_data);
            if(!empty($jsonSectionData))
            {
                foreach($jsonSectionData as $k=>$v)
                {                   
                    $order = $v->order;
                    $value = array();
                    $value['order'] = $order;
                    $value['add_screenshot'] = $v->add_screenshot;
                    $jsonData[$order] = $value;
                } 
            }
            $updatedJsonData = array();
            
            if($post_order_data!='')
            {	
                $post_order_data_array = explode(',',$post_order_data);
        	$i = 1;
                foreach($post_order_data_array as $k=>$v)
                {
                    $value = array();
                    $value = $jsonData[$v];
                    $order = $value['order'];
                    if($i != $v)
                    {
                        $value['order'] = $order = $i;
                    }
                    $updatedJsonData[$order - 1] = $value;
                    $i++;
                }	
            }
            $insertData['id'] = $id;
            $insertData['section_json_data'] = json_encode($updatedJsonData);
            $appBasicDetail = $this->AppRepository->saveAppBasicDetailData($insertData);  
            
            $outputArray['data']['section_json_data'] = json_encode($updatedJsonData);
            foreach($updatedJsonData as $k1=>$v1)
            {
                $ass_data = array();
                $ass_data['order'] = $v1['order'];
                if(File::exists(public_path($this->addscreenshotThumbImageUploadPath . $v1['add_screenshot'])) && $v1['add_screenshot'] != '')        {
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.$v1['add_screenshot']);
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.$v1['add_screenshot']);
                }else{
                    $add_screenshot_thumb_url = url($this->addscreenshotThumbImageUploadPath.'default.png');
                    $add_screenshot_original_url = url($this->addscreenshotOriginalImageUploadPath.'default.png');
                }  
                $ass_data['add_screenshot_thumb_url'] = $add_screenshot_thumb_url;
                $ass_data['add_screenshot_original_url'] = $add_screenshot_original_url;
                $ass_data['add_screenshot'] = $v1['add_screenshot'];
                $add_screenshot_data[] = $ass_data;
            }
            $outputArray['data']['add_screenshot_data'] = $add_screenshot_data;
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.order_screenshot_update_msg'); 
            
            $app_id = $body['app_id'];
            // check app publish counter
            $checkAppPublishCounter = $this->AppRepository->getSingleAppData($app_id);
            if( isset($checkAppPublishCounter) && $checkAppPublishCounter->app_publish_counter > 0)
            {
                $outputArray['change'] = true;
            }
            else{
                $outputArray['change'] = false;
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);        
    }
    

    public function updateappstatus(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user)
        {
            $user_id = $user->id;
            $app_id = $body['id'];
            $app_status = $body['status'];
            if($app_status == 'trash')
            {
                $status = 2;
            }
            else
            {
                $status = 1;
            }
            
            $updateData['status'] = $status;
            $updateData['id'] = $app_id;
            $appDetail = $this->AppRepository->saveAppData($updateData);                
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function deleteapp(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
               
        $body = $request->all();
        if($user)
        {
            $user_id = $user->id;
            $app_id = $body['id'];
            
            $updateData['status'] = 3;
            $updateData['id'] = $app_id;
            $appDetail = $this->AppRepository->saveAppData($updateData);                
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function gettrashappdata()
    {
        $user = JWTAuth::parseToken()->authenticate();
        
        if($user)
        {
            $userRole = $user->role_id;
            $appArray = array();

            if($userRole != 1)
            {
                $appAssignData = $this->AppAssignUserRepository->getAppByAssignUser($user->id);
                if($appAssignData)
                {
                    foreach($appAssignData as $k=>$v)
                    {
                        $appArray[] = $v->app_basic_id;
                    }
                }

            }

            $appData = $this->AppRepository->getAllAppData($appArray,$userRole,2);

            $data = array();
            foreach($appData as $key=>$val)
            {   
                $basicDetail = $val->getAllBasicDetailData->where('app_section_slug','app_icon');
                $basicDetailData = array();
                foreach($basicDetail as $k=>$v)
                {
                    $detailArray = array();
                    $detailArray['id'] = $v->id;
                    $detailArray['section_json_data'] = $v->section_json_data;
                    if($v->app_section_slug == 'app_icon')
                    {                        
                        $detailArray['app_icon_thumb_url'] = url($this->appIconThumbImageUploadPath.'default.png');
                        $detailArray['app_icon_original_url'] = url($this->appIconOriginalImageUploadPath.'default.png');                       
                        if(isset($v->section_json_data) && $v->section_json_data!='')
                        {
                            $appJsonData = json_decode($v->section_json_data);
                            if(File::exists(public_path($this->appIconThumbImageUploadPath . $appJsonData->app_icon)) && $appJsonData->app_icon != ''){
                                $app_icon_thumb_url = url($this->appIconThumbImageUploadPath.$appJsonData->app_icon);
                                $app_icon_original_url = url($this->appIconOriginalImageUploadPath.$appJsonData->app_icon);
                            }else{
                                $app_icon_thumb_url = url($this->appIconThumbImageUploadPath.'default.png');
                                $app_icon_original_url = url($this->appIconOriginalImageUploadPath.'default.png');
                            }  
                            $detailArray['app_icon_thumb_url'] = $app_icon_thumb_url; 
                            $detailArray['app_icon_original_url'] = $app_icon_original_url; 
                        }   
                    }
                    $basicDetailData[$v->app_section_slug] = $detailArray;
                }
                
                $value = $val->toArray();
                unset($value['get_all_basic_detail_data']);   
                unset($value['app_json_data']);        
                $data[$key] = $value; 
                $data[$key]['basicDetail'] = $basicDetailData;                
            }                           
            $outputArray['data'] = $data;
            $outputArray['status'] = '1';
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function getAllAppCss(Request $request){
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $appMenuData =$this->AppRepository->getAllAppCssData();
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($appMenuData);
    }

    public function saveAppCss(Request $request)
    {

        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {   
            $app_id = $body['appId'];

            $menu_location_type = (isset($body['selMenuType']) && $body['selMenuType'] != null && $body['selMenuType'] != '') ? $body['selMenuType'] : 1;
                   

            $parentMenuCount = $this->objAppMenu->checkParentMenuCount($app_id);
            if($menu_location_type == 2 && $parentMenuCount > 5)
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.parent_menu_type_morethan_five');
            }
            else
            {

                $pathOriginal = "";
                $headerMainIcon = "";
                if (Input::file()) 
                {                        
                    
                    $file = Input::file('headerImg');
                    if (!empty($file)) 
                    {
                        $fileName = 'sideMenuHeaderImg_' . time() .'.' . $file->getClientOriginalExtension();
                        $pathOriginal = public_path($this->headerSideMenuImgPath . $fileName);
                        $pathThumb = public_path($this->headerSideMenuImgPath . $fileName);
                        Image::make($file->getRealPath())->save($pathOriginal);
                        $pathOriginal = url($this->headerSideMenuImgPath.$fileName);
                        $outputArray['sideMenuHeaderLogo'] = $pathOriginal;
                    }

                    if(isset($body['oldHeaderImg']) && $body['oldHeaderImg'] !='')
                    {
                        if(File::exists(public_path($this->headerSideMenuImgPath . $body['oldHeaderImg'])) && $body['oldHeaderImg'] != ''){
                            File::delete(public_path($this->headerSideMenuImgPath . $body['oldHeaderImg']));      
                        }
                    }

                    if(isset($body['oldMainImg']) && $body['oldMainImg'] !='')
                    {
                        if(File::exists(public_path($this->headerSideMenuImgPath . $body['oldMainImg'])) && $body['oldMainImg'] != ''){
                            File::delete(public_path($this->headerSideMenuImgPath . $body['oldMainImg']));      
                        }
                    }                        

                    $fileMainHeader = Input::file('headerMainImg');
                    if (!empty($fileMainHeader)) 
                    {

                        $fileNameMain = 'mainMenuHeaderImg_' . time() .'.' . $fileMainHeader->getClientOriginalExtension();
                        $pathOriginalMain = public_path($this->headerSideMenuImgPath . $fileNameMain);
                        $pathThumbMain = public_path($this->headerSideMenuImgPath . $fileNameMain);
                        Image::make($fileMainHeader->getRealPath())->save($pathOriginalMain);
                        $headerMainIcon = url($this->headerSideMenuImgPath.$fileNameMain);
                        $outputArray['mainMenuHeaderLogo'] = $headerMainIcon;    
                    }
                }

                $updateData = [];
                $updateData['id'] = $app_id;
                $updateData['menu_location_type'] = $menu_location_type;
                $appUpdateDetail = $this->AppRepository->saveAppData($updateData);                
                $appCssData = $this->AppRepository->saveCssData($body);              
                
                $outputArray['status'] = 1;
                
                
                
                if($body['dbColumn'] == 'app_side_menu_css_json_data')
                {
                    $outputArray['message'] = trans('appmessages.css_save_menu_successfully');    
                }
                else
                {
                    $outputArray['message'] = trans('appmessages.css_save_general_successfully');    
                }
            }

        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);    
    }

    public function isCssData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();        
        if($user)
        {
            $appCssData = $this->AppRepository->getCssData($body);
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response($appCssData);   

    }
    
    public function isSubMenuCssData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
      
        if($user && isset($body['cssComponent']) && $body['cssComponent'] != null && !empty($body['cssComponent']))
        {
            $appSubMenuCssData = $this->AppRepository->getSubMenuCssData($body);
            if($appSubMenuCssData)
            {
                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.subMenuCssGetSuccessfully');
                $outputArray['data'] = $appSubMenuCssData->css_properties;                
            }
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }            
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function generateJsonData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            // $allAppData = $body['appData']; 
            $createdJson = $this->AppRepository->createJsonData($body);
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json();
    }

    public function fetchMenuData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $menuData = $this->AppRepository->getMenuData($body);
            if($menuData){
                 $outputArray['status'] = 1;
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($menuData);
    }

    public function getBasicAppData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $basicAppData = $this->AppRepository->getBasicData();
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($basicAppData);
    }

    public function getFontFamilyData(Request $request)
    {
    
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $basicAppData = $this->AppRepository->getFontData();
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($basicAppData);
    }

    public function getLangData(Request $request)
    {
    
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $basicAppData = $this->AppRepository->getLangData();
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($basicAppData);
    }

    public function saveAdminData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $settingData = $this->AppRepository->saveDataAdmin($body);   
            $outputArray['status'] = 1;
            $outputArray['message'] = trans('appmessages.setting_save_success');

        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);    
    }

    public function getSettingData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $getData = $this->AppRepository->getDataAdmin($body);   
            if($getData){
                 $outputArray['status'] = 1;
                 $outputArray['message'] = trans('appmessages.setting_save_success');
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($getData);   
    }

    public function saveSuperAdminData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        if($user)
        {
            $getData = $this->AppRepository->saveSuperAdminData($body);   
            
            if($getData)
            {
                $outputArray['status'] = 1;
                $outputArray['message'] = trans('appmessages.setting_save_success');
            } 
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.default_error_msg');
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function getSuperAdminData()
    {
        $user = JWTAuth::parseToken()->authenticate();
        if($user)
        {
            $getData = $this->AppRepository->getSuperAdminSettingData();   
            if($getData){
                 $outputArray['status'] = 1;
                 $outputArray['message'] = trans('appmessages.setting_save_success');
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($getData);
    }

    public function getMenuIconData()
    {
        $user = JWTAuth::parseToken()->authenticate();
        if($user)
        {
            $getData = $this->AppRepository->getMenuIconDataFun();   
            if($getData){
                 $outputArray['status'] = 1;
                 $outputArray['message'] = trans('appmessages.setting_save_success');
            }
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($getData);   
    }

    public function getTransactionData()
    {
        $user = JWTAuth::parseToken()->authenticate();
        if($user)
        {
            $getData = $this->AppRepository->getTraData();

            foreach ($getData as $key => $value) {
                # code...
               // $carbon = Carbon::createFromFormat('Y-m-d H:i:s', 'UTC', $value->st_created);   // specify UTC otherwise defaults to locale time zone as per ini setting
               // $carbon->tz = 'America/Los_Angeles';   // ... set to the current users timezone
                $value->timestamp = $value->st_created;
                $date = Carbon::createFromFormat('Y-m-d H:i:s',$value->st_created);
                 //$date = Carbon::createFromFormat('m-d-Y H:i A', $value->st_created);
                // $date->tz = "America/Los_Angeles";
                
                $value->st_created = $date->format('m-d-Y H:i A');
                
            }
            $outputArray['status'] = 1;
            $outputArray['data'] = $getData;
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);   
    }
    public function getSubscriptionData()
    {
        # code...
        $order_num = 0;
        $invoice_limit= 100;
        $user = JWTAuth::parseToken()->authenticate();
        if($user)
        {
            $getData = $this->AppRepository->getSubscriptionData();

             foreach ($getData as $key => $value) {
            //     # code...
                 \Stripe\Stripe::setApiKey(Config::get('services.stripe.secret'));
                 $params = array("limit" => $invoice_limit, "customer" => $value->stripe_id);
                 $value->invoice= \Stripe\Invoice::all($params);
            //     $value->sub_data = \Stripe\Subscription::retrieve($value->subscription_id);
                foreach ($value->invoice->data as $k => $v) {
                    # code...
                    $v->timestamp = $v->date;
                    $s = Carbon::createFromTimestamp($v->date)->toDateTimeString();  
                    $date = Carbon::createFromFormat('Y-m-d H:i:s',$s);
                    // $date->tz = "America/Los_Angeles";
                    $v->date = $date->format('m-d-Y H:i A');
                    // count order num
                    $order_num += 1;
                    $v->order_num = $order_num;
                }
                $value->timestamp = $value->created_at;
                $date = Carbon::createFromFormat('Y-m-d H:i:s',$value->created_at);
                $date->tz = "America/Los_Angeles";
            
                $value->created_at = $date->format('m-d-Y H:i A');
                
             }
            $outputArray['status'] = 1;
            $outputArray['data'] = $getData;
        } else {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }
}
