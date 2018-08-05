<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::get('/', function () {
    return view('welcome');
});

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type' );
header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Origin, Authorization');

Route::post('login', 'UserController@login');
// Route::post('signup', 'UserController@signup');
// test url
Route::post('signup','StripPackagesController@testSignup');
// end
// move to middleware editprofile
// move to middleware changepassword
Route::any('forgotpassword', 'UserController@forgotpassword');
Route::any('otp', 'UserController@otp');
Route::any('newPasswordUpdated', 'UserController@newPasswordUpdated');

Route::post('addEmailTemplate', 'EmailTemplateController@addEmailTemplate');
Route::post('updateEmailTemplate', 'EmailTemplateController@updateEmailTemplate');
Route::any('fetchAllEmailTemplate', 'EmailTemplateController@fetchAllEmailTemplate');
Route::any('fetchEmailTemplateById', 'EmailTemplateController@fetchEmailTemplateById');
Route::post('deleteEmailTemplate', 'EmailTemplateController@delete');

Route::any('fetchAllFitnessChallenge','FitnessChallengeController@fetchAllFitnessChallenge');
Route::post('addFitnessChallenge','FitnessChallengeController@addFitnessChallenge');
Route::post('deleteFitnessChallenge','FitnessChallengeController@deleteFitnessChallenge');
Route::post('updateFitnessChallenge','FitnessChallengeController@updateFitnessChallenge');
Route::any('fetchFitnessChallengeById','FitnessChallengeController@fetchFitnessChallengeById');
Route::any('fetchAllFitnessChallengeDay','FitnessChallengeController@fetchAllFitnessChallengeDay');
Route::any('fetchAllActiveFitnessChallenge','FitnessChallengeController@fetchAllActiveFitnessChallenge');
Route::post('addFitnessChallengeDay','FitnessChallengeController@addFitnessChallengeDay');
Route::post('deleteFitnessChallengeDay','FitnessChallengeController@deleteFitnessChallengeDay');
Route::post('fetchFitnessChallengeDayById','FitnessChallengeController@fetchFitnessChallengeDayById');
Route::post('updateFitnessChallengeDay','FitnessChallengeController@updateFitnessChallengeDay');
Route::any('fetchAllFitnessChallengeloops','FitnessChallengeController@fetchAllFitnessChallengeloops');
Route::post('deleteFitnessChallengeLoop','FitnessChallengeController@deleteFitnessChallengeLoop');
Route::any('fetchAllActiveFitnessChallengeDay','FitnessChallengeController@fetchAllActiveFitnessChallengeDay');
Route::post('addFitnessChallengeLoop','FitnessChallengeController@addFitnessChallengeLoop');
Route::post('fetchFitnessChallengeLoopById','FitnessChallengeController@fetchFitnessChallengeLoopById');
Route::post('editFitnessChallengeLoop','FitnessChallengeController@updateFitnessChallengeLoop');

Route::post('createapp', 'AppController@createApp');
Route::post('editapp', 'AppController@editApp');
// move to middlware splashscreen
// move to middlware sponsorsplash
// move to middlware basicinformation
Route::post('googleanalytic', 'AppController@googleanalytic');
// move to middleware addscreenshot
// move to middleware addipadscreenshot
Route::post('removescreenshot', 'AppController@removescreenshot');
Route::post('removeipadscreenshot', 'AppController@removeIpadScreenShot');
// move to middleware changescreenshotorder
// move to middleware changeipadscreenshotorder
// app icon move to middleware
Route::post('updatemenulocationtype', 'AppController@updateMenuLocationType');

Route::post('homescreen', 'AppController@homescreen');

Route::post('menuconfiguration', 'AppController@menuconfiguration');
Route::post('getsingleappdata', 'AppController@getsingleappdata');

Route::get('getFontData', 'AppController@getFontFamilyData');
Route::get('getLangData', 'AppController@getLangData');
Route::get('getMenuIcon', 'AppController@getMenuIconData');

Route::get('getallappdata', 'AppController@index');
Route::get('gettrashappdata', 'AppController@gettrashappdata');
Route::post('updateappstatus', 'AppController@updateappstatus');
Route::post('deleteapp', 'AppController@deleteapp');

// move to middleware notificationpopupform
// move to  middleware autoupgradepopupform
// move to middleware ratepopupform
Route::get('getAppCss', 'AppController@getAllAppCss');
// move to middleware saveCssData
Route::post('isCssDataExsist', 'AppController@isCssData');
Route::post('getMenuData', 'AppController@fetchMenuData');
Route::post('isSubMenuCssDataExist', 'AppController@isSubMenuCssData');
Route::post('generateJson', 'JsonController@generateJsonData');

Route::any('fetchAllCMSUsersData', 'UserController@fetchAllCMSUsersData');
Route::post('fetchUserById', 'UserController@fetchUserDataById');
Route::post('addUser', 'UserController@addUserData');
Route::post('updateUser', 'UserController@updateUserData');
Route::post('deleteUser', 'UserController@deleteUserData');


Route::get('appassignuserdata', 'AppAssignUserController@index');
Route::post('saveassignuser', 'AppAssignUserController@saveAssignUser');
Route::post('deleteassignuser', 'AppAssignUserController@deleteAssignUser');
Route::get('getallapp', 'AppAssignUserController@getAllApp');
Route::get('getallusers', 'AppAssignUserController@getAllUsers');
Route::get('fetchAllAppUserData', 'AppAssignUserController@fetchAllAppUserData');


Route::post('appmenudata', 'AppMenuController@index');
Route::post('allmenutypedata', 'AppMenuController@getAllAppMenuTypeData');
// move to middleware updatemenutypedata
// move to middleware saveappmenu
Route::post('deleteappmenu', 'AppMenuController@deleteAppMenu');
// move to middleware storeOrderedMenuData
Route::post('getparentmenutypedata', 'AppMenuController@getParentMenuTypeData');

Route::post('getAppVersionData', 'JsonController@getAppVersionData');
Route::post('generateNewJSON', 'JsonController@generateNewJSON');
Route::post('publishVersion', 'JsonController@publishVersion');

Route::get('getBasicInfo', 'AppController@getBasicAppData');
Route::post('saveAdminSettingData', 'AppController@saveAdminData');
Route::post('getAdminSettingData', 'AppController@getSettingData');
Route::post('saveSuperAdminSettingData', 'AppController@saveSuperAdminData');
Route::get('getSuperAdminSettingData', 'AppController@getSuperAdminData');


Route::post('test_login', 'TestController@login');
Route::group(['middleware' => 'jwt.auth'], function () {
Route::post('getuser', 'TestController@getAuthUser');
});

// routes for get packages
Route::get('packages','StripPackagesController@allActivePackage');
Route::get('packages/{id}','StripPackagesController@allActivePackageByUniqueKey');




Route::post('uploadOnFTP', 'JsonController@uploadOnFTP');



// for general Dicussion

 // Route::get('/test/{id}','GeneralDiscussionController@getAppCreatorId');

Route::post('storeDicussion', 'GeneralDiscussionController@storeDicussion');
Route::post('getDicussionByAppID', 'GeneralDiscussionController@getDicussionByAppID');

// todo check exist email and appname

Route::post('/checkemailappexist','StripPackagesController@checkEmailAppExist');

// Route::post('/getDicussion','GeneralDiscussionController@getDicussionByAppID');

// Route for getting trasaction Data
Route::get('getTransactionData', 'AppController@getTransactionData');
// Route for getting trasaction Data
Route::get('getSubscriptionData', 'AppController@getSubscriptionData');

// Route for handle custom form submission
Route::post('sendCustomMail','StripPackagesController@sendCustomMail');

Route::post('/testmiddleware',function(){
    return redirect('/');
})->middleware(['jwt.auth','authorize']);

Route::group(['middleware'=>['jwt.auth','authorize']], function(){
    // API app icon
    Route::post('appicon', 'AppController@appIcon');
    // API splash screen
    Route::post('splashscreen', 'AppController@splashScreen');
    // API sponsor splash
    Route::post('sponsorsplash', 'AppController@sponsorsplash');
    // API basicinformation
    Route::post('basicinformation', 'AppController@basicinformation');
    // API addscreenshot
    Route::post('addscreenshot', 'AppController@addscreenshot');
    // API changescreenshotorder
    Route::post('changescreenshotorder', 'AppController@changescreenshotorder');
    // API addipadscreenshot
    Route::post('addipadscreenshot', 'AppController@addIpadScreenShot');
    // API changeipadscreenshotorder
    Route::post('changeipadscreenshotorder', 'AppController@changeIpadScreenShotOrder');
    // API notificationpopupform
    Route::post('notificationpopupform', 'AppController@notificationpopupformsave');
    // API autoupgradepopupform
    Route::post('autoupgradepopupform', 'AppController@autoupgradepopupformsave');
    // API ratepopupform
    Route::post('ratepopupform', 'AppController@ratepopupformsave');
    // API saveCssData
    Route::post('saveCssData', 'AppController@saveAppCss');
    // API updaremenutypedata
    Route::post('updatemenutypedata', 'AppMenuController@updateMenuTypeData');
    // API storeOrderedMenuData
    Route::post('storeOrderedMenuData', 'AppMenuController@orderedMenuData');
    // API saveappmenu
    Route::post('saveappmenu', 'AppMenuController@saveAppMenu');
    // API editprofile
    Route::post('editprofile', 'UserController@editprofile');
    // API changepassword
    Route::post('changepassword', 'UserController@changepassword');

    // API publishAppInit 
    Route::post('publishAppInit','JsonController@publishAppInit');
    // API changeAppPublishStatus
    Route::post('changeAppPublishStatus','JsonController@changeAppPublishStatus');
});