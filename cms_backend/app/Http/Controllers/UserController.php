<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTAuthException;
use Config;
use Mail;
use Auth;
use Helpers;
use App\User;
use App\Services\User\Contracts\UserRepository;
use App\EmailTemplate;
use App\StripeSubscription;
use App\Services\EmailTemplate\Contracts\EmailTemplateRepository;
use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use Illuminate\Validation\Rule;
use App\Services\App\Contracts\AppRepository;

class UserController extends Controller {

    public function __construct(UserRepository $UserRepository,AppAssignUserRepository $AppAssignUserRepository, EmailTemplateRepository $EmailTemplateRepository,AppRepository $AppRepository) 
    {
        $this->middleware('jwt.auth', ['except' => ['signup','login','forgotpassword','otp','newPasswordUpdated']]);
        $this->objUser = new User();
        $this->objStripeSub = new StripeSubscription();
        $this->AppRepository = $AppRepository;
        $this->UserRepository = $UserRepository;
        $this->AppAssignUserRepository = $AppAssignUserRepository;
        $this->objEmailTemplateModel = new EmailTemplate();
        $this->EmailTemplateRepository = $EmailTemplateRepository;
    }
    
    public function editprofile(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();               
        $body = $request->all();

        if($user)
        {
            $user_id = $user->id;
            $first_name = $body['first_name'];
            $last_name = $body['last_name'];
            $email = $body['email'];

            // $userExist = $this->UserRepository->checkEmailExist($email,$user_id);
            // if (!$userExist) {
                $updateData['first_name'] = $first_name;
                $updateData['last_name'] = $last_name;
                $updateData['email'] = $email;
                $updateData['id'] = $user_id;
                $userDetail = $this->UserRepository->saveUserData($updateData);
                if($userDetail)
                {
                   // $token =  JWTAuth::getToken(); 
                    $uData = array();
                    $uData['token'] = (string)JWTAuth::getToken();
                    $uData['role_id'] = $user->role_id;
                    $uData['first_name'] = $first_name;
                    $uData['last_name'] = $last_name;
                    $uData['email'] = $email;
                    $outputArray['data'] = $uData;
                    $outputArray['status'] = '1';
                    $outputArray['message'] = trans('appmessages.profile_success_update_msg');
                } else 
                {
                   
                    $outputArray['status'] = '0';
                    $outputArray['message'] = trans('appmessages.default_error_msg');
                }
            }
            else
            {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.tokennotmatched');
            }
        // }
        // else
        // {
        //     $outputArray['status'] = '0';
        //     $outputArray['message'] = trans('appmessages.default_error_msg');
        // }
        return response()->json($outputArray);
    }

    public function changepassword(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();

        if($user)
        {
            $user_id = $user->id;
            $o_password = $body['o_password'];
            $n_password = bcrypt($body['n_password']);
            $email = $body['email'];
            if (Auth::attempt(['email' => $email, 'password' => $o_password])) 
            {
                $updateData['password'] = $n_password;
                $updateData['id'] = $user_id;
                $userDetail = $this->UserRepository->saveUserData($updateData);
                if($userDetail)
                {
                    $outputArray['status'] = '1';
                    $outputArray['message'] = trans('appmessages.pwd_success_msg');
                }
            }
            else
            {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.pwd_not_match');
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($outputArray);
    }

    public function signup(Request $request) 
    {
        $body = $request->all();
        $first_name = $body['first_name'];
        $last_name = $body['last_name'];
        $email = $body['email'];
        $password = bcrypt($body['password']);
        $app_basic_id = bcrypt($body['app_basic_id']);

        $user = $this->UserRepository->checkEmail($email);

        if (!$user) {
            $insertData['first_name'] = $first_name;
            $insertData['last_name'] = $last_name;
            $insertData['email'] = $email;
            $insertData['password'] = $password;
            $insertData['role_id'] = 2;
            $insertData['status'] = 1;

            $userDetail = $this->UserRepository->saveUserData($insertData);
            if($userDetail)
            {
                
                $outputArray['data'] = $userDetail;
                $outputArray['status'] = '1';
                $outputArray['message'] = trans('appmessages.user_success_msg');
            }
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.userexistwithemail');
        }
        return response()->json($outputArray);
    }
    
    public function login(Request $request) 
    {
        $credentials = $request->only('email', 'password');
        
        $token = null;
        $outputArray = [];
        $outputArray['status'] = '0';
        $outputArray['message'] = trans('appmessages.default_error_msg');
        $email = trim($credentials['email']);
        $password = trim($credentials['password']);
        $user = $this->UserRepository->checkEmailAllStatus($email);
         // If user not exists then
        if (!$user) {
           
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.usernotexistwithemail');
            return response()->json($outputArray);
        } else {
            // else user exist
            if ($user->status == 2 || $user->status == '2') {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.your_account_has_deactivated');
                return response()->json($outputArray);
            }
            try {
                //old if condition !$token = JWTAuth::attempt($credentials)
                if (!$token = JWTAuth::attempt(['email'=>$email,'password'=>$password,'status'=>'1'])) 
                {
                    $outputArray['status'] = '0';
                    $outputArray['message'] = trans('appmessages.invalid_pwd_msg');
                    return response()->json($outputArray);
                }               
            } catch (JWTAuthException $e) {
                $outputArray['status'] = '0';
                $outputArray['message'] = trans('appmessages.please_contact_to_admin'); // 'Action failed to create token'
                return response()->json($outputArray, 200);
            }

            $uData['token'] = $token;
            $uData['role_id'] = $user->role_id;
            $uData['first_name'] = $user->first_name;
            $uData['last_name'] = $user->last_name;
            $uData['email'] = $user->email;
            $outputArray['data'] = $uData;
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.login_success_msg');          
            return response()->json($outputArray, 200);
        }
            
    }

    public function forgotpassword(Request $request)
    {
        $body = $request->all();
        $email = $body['email'];
        
        $user = $this->UserRepository->checkEmail($email);
        
        if($user)
        {
            $user_id = $user->id;
            $otp = Helpers::randomNumber();
            $updateData['id'] = $user_id;
            $updateData['otp'] = $otp;
            $userDetail = $this->UserRepository->saveUserData($updateData);
            
            
            $emailTemplateContent = $this->EmailTemplateRepository->getEmailTemplateDataByName('otp_mail');
            
            if($emailTemplateContent)
            {
                $data = array();
                $replaceArray = array();
                $replaceArray['toName'] = $user->first_name.' '.$user->last_name;
                $replaceArray['siteUrl'] = trans('appmessages.site_url');
                $replaceArray['otp'] = $otp;            
                $content = $this->EmailTemplateRepository->getEmailContent($emailTemplateContent->et_body, $replaceArray);

                $data['subject'] = $emailTemplateContent->et_subject;
                $data['toEmail'] = $user->email;
                $data['toName'] = $user->first_name.' '.$user->last_name;            
                $data['content'] = $content;

                if($userDetail)
                {
                    Mail::send(['html' => 'emails.Template'], $data, function($message) use ($data) {
                    $message->subject($data['subject']);
                    $message->to($data['toEmail'], $data['toName']);
                    });
                    $outputArray['status'] = 1;
                    $outputArray['message'] = trans('appmessages.otpsuccessfullysent');
                }
            }
            else
            {
                $outputArray['status'] = 0;
                $outputArray['message'] = trans('appmessages.usernotexistwithemail');
            }
            
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.usernotexistwithemail');
        }
        return response()->json($outputArray);
    }
    
    public function otp(Request $request)
    {
        $body = $request->all();
        $otp = $body['otp'];
        
        $userOtp = $this->UserRepository->checkOtp($otp);
        
        if($userOtp)
        {
            $outputArray['userId'] = $userOtp->id;
            $outputArray['status'] = 1;
            $outputArray['message'] = trans('appmessages.userotpmatch');
        }
        else
        {
            $outputArray['status'] = 0;
            $outputArray['message'] = trans('appmessages.userotpnotexist');
        }
        return response()->json($outputArray);
    }
    
    public function newPasswordUpdated(Request $request)
    {
        $body = $request->all();
        $userId = $body['userId'];
        $password = bcrypt($body['new_passowrd']);
        
        $updateData['id'] = $userId;
        $updateData['password'] = $password;
        $updateData['otp'] = null;
        $userDetail = $this->UserRepository->saveUserData($updateData);
        
        if($userDetail)
        {   
            $outputArray['status'] = '1';
            $outputArray['message'] = trans('appmessages.passwordsuccessfullyupdate');
        }
        else
        {
            $outputArray['status'] = '0';
            $outputArray['message'] = trans('appmessages.npwd_not_match');
        }
        return response()->json($outputArray);
    }
    
    public function fetchUserDataById(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $editId = $body['id'];
        if($user)
        {
            $getUserData = $this->UserRepository->getUsersDataById($editId);
//          $appData = $this->AppRepository->getAppForAssignUser();                                        
            $appData = $this->AppRepository->getAppForNotAssignedUser();                                        
  
            $app = [];
            foreach ($getUserData->getData as $key => $value) {                
                $app['myApp'][] = $value->getAppData;
            }
            
            $app['AllApp'] = $appData;
            $getUserData['app'] = $app;
            if($getUserData && count($getUserData) > 0)
            {
                $response['status'] = 1;
                $response['message'] = trans('appmessages.getuserbyidsuccessfully');                
                $response['id'] = $getUserData->id;
                $response['roleId'] = $getUserData->role_id;
                $response['first_name'] = $getUserData->first_name;            
                $response['last_name'] = $getUserData->last_name;
                $response['email'] = $getUserData->email;
                $response['status'] = $getUserData->status; 
                $response['app'] = $getUserData->app;              
            }
            else
            {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.default_error_msg');
            }
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.default_error_msg');
        }
        return response()->json($response);
    }
    
    public function fetchAllCMSUsersData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
         $finalvalue2 = [];
         $finalvalue1 = [];
         $final = [];
        if($user)
        {
//          $getAllUsers = $this->UserRepository->getAllUsersData('1,2');
            $getAllUsers = $this->UserRepository->getAllUsersData();
            $data = [];
            foreach ($getAllUsers as $key => $value) 
            {
                $assignAppDetails = $value->getData; 
                $app_name = []; 
                                
                if(isset($assignAppDetails))
                {
                    foreach ($assignAppDetails as $key => $value1) 
                    {   
                        if(isset($value1->getAppData->app_name) && !empty($value1->getAppData->app_name))
                        {
                            $app_name[] = $value1->getAppData->app_name;
                        }                    
                    }
                }                             
                $app = implode(",",$app_name);     
                $data[] = array('id'=>$value->id,'first_name'=>$value->first_name,'role_id'=>$value->role_id,'last_name'=>$value->last_name,'email'=>$value->email,'status'=>$value->status,'app'=>$app);
                
            }
            
            if($data)
            {
                $response = $this->getUsersResponse($data);               
            }
            else
            {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.default_error_msg');
            }   
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.default_error_msg');
        }
       
        return response()->json($response);
    }
    
    public function addUserData(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        $first_name = $body['first_name'];
        $last_name = $body['last_name'];
        $email = $body['email'];
        $password = bcrypt($body['password']);
        $status = $body['status'];
        
        if($user)
        {
            $userEmailCheck = $this->UserRepository->checkEmail($email);
            if (!$userEmailCheck)
            {
                $insertData['role_id'] = 2;
                $insertData['first_name'] = $first_name;
                $insertData['last_name'] = $last_name;
                $insertData['email'] = $email;
                $insertData['password'] = $password;                
                $insertData['status'] = $status;

                $userDetail = $this->UserRepository->saveUserData($insertData);
                if(isset($userDetail) && !empty($body['app_basic_id']) && count($body['app_basic_id']) > 0)
                {
                 
                    $app_basic_id = $body['app_basic_id'];
                    $user_id = $userDetail->id;
                    $insertData['app_basic_id'] = explode(",", $app_basic_id);
                    $insertData['user_id'] = $user_id;

                    foreach ($insertData['app_basic_id'] as $key => $value) {
                         $insertAppData['app_basic_id'] = $value;
                         $insertAppData['user_id'] = $user_id;
                         $Detail = $this->AppAssignUserRepository->saveAppAssignUserData($insertAppData);
                    }
                    
                }
                $response['status'] = '1';
                $response['message'] = trans('appmessages.user_success_msg');
                $response['data'] = $userDetail;    
            }
            else
            {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.userexistwithemail');
            }            
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        return response()->json($response);
    }
    
    public function updateUserData(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();

        // check change_id is present
        if(isset($body['change_id']) && !empty($body['change_id']))
        {
            $pass = $body['password'];
            $record_id = $body['change_id'];
            // prepare update data 
            $updateData['id'] = $record_id;
            $updateData['password'] = bcrypt($pass);
        } 
        else 
        {
            $editId = $body['id'];
            $first_name = $body['first_name'];
            $last_name = $body['last_name'];
            $email = $body['email'];
            $status = $body['status'];
        }
        
       // if password is null dont update
        // if(!empty($pass) && $pass != 'null')
        // {   
        //     $password = bcrypt($pass);
        // }      
        // if token is valid
        if($user)
        {
            // for update password
            if(isset($body['change_id']) && !empty($body['change_id']))
            {
                // update data
                $userDetail = $this->UserRepository->saveUserData($updateData);
                if(isset($userDetail)) 
                {
                    $response['status'] = '1';
                    $response['message'] = trans('appmessages.passwordsuccessfullyupdate');
                    $response['data'] = $userDetail;                    
                    return response()->json($response);
                }
            } else {
               
                // $userExist = $this->UserRepository->checkEmailExist($email,$editId);
                
                // if (!$userExist) 
                // {
                    $insertData['id'] = $editId;
                    $insertData['role_id'] = 2;
                    $insertData['first_name'] = $first_name;
                    $insertData['last_name'] = $last_name;
                    $insertData['email'] = $email;
                    // if(!empty($pass) && isset($password) && $pass != 'null')
                    // {
                    //     $insertData['password'] = $password;
                    // }                
                    $insertData['status'] = $status; 
                    // save basic information of user
                    $userDetail = $this->UserRepository->saveUserData($insertData);
                    
                    if($body['id'])
                    {
                        $Detail = $this->AppAssignUserRepository->deleteAppAssignUserByUserId($body['id']); 
                    }
                    
                    
                    if(isset($userDetail) && !empty($body['app_basic_id']) && count($body['app_basic_id']) > 0)
                    {       
                        $app_basic_id = $body['app_basic_id'];
                        $user_id = $body['id'];
                        $insertData['app_basic_id'] = explode(",", $app_basic_id);
                        $insertData['user_id'] = $user_id;

                        foreach ($insertData['app_basic_id'] as $key => $value) 
                        {
                            $insertAppData['app_basic_id'] = $value;
                            $insertAppData['user_id'] = $user_id;
                            $Detail = $this->AppAssignUserRepository->saveAppAssignUserData($insertAppData);
                        }

                    }  
                    $response['status'] = '1';
                    $response['message'] = trans('appmessages.userdatasuccessfullyupdate');
                    $response['data'] = $userDetail;
                // }
                // else
                // {
                //     $response['status'] = '0';
                //     $response['message'] = trans('appmessages.userexistwithemail');
                // }
            }         
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.default_error_msg');
        }
        
        return response()->json($response);
        
    }
    
    public function deleteUserData(Request $request) 
    {
        $user = JWTAuth::parseToken()->authenticate();
        $body = $request->all();
        
        $deleteId = $body['id'];
        
        if($user)
        {      
            // cancel subscription
            // $sub_details = $this->objStripeSub->fetchStripedetailsByUser($deleteId);
            // \Stripe\Stripe::setApiKey(Config::get('services.stripe.secret'));
            
            // $subscription = \Stripe\Subscription::retrieve("sub_3R3PlB2YlJe84a");
            // $subscription->cancel(array('at_period_end' => true));
            $return = $this->UserRepository->deletUserDetails($deleteId);
            $Detail = $this->AppAssignUserRepository->deleteAppAssignUserByUserId($deleteId);          
            if ($return) 
            {
                $getAllUsers =$this->UserRepository->getAllUsersData('1,2');
                $data = [];
                foreach ($getAllUsers as $key => $value) {
                $assignAppDetails = $value->getData; 
                $app_name = []; 
                foreach ($assignAppDetails as $key => $value1) 
                { 
                 $app_name[] = $value1->getAppData->app_name;
                }             
                $app = implode(",",$app_name);     
                $data[] = array('id'=>$value->id,'first_name'=>$value->first_name,'role_id'=>$value->role_id,'last_name'=>$value->last_name,'email'=>$value->email,'status'=>$value->status,'app'=>$app);
            }

                if($data)
                {
                  $response = $this->getUsersResponse($data);        
                }
                $response['status'] = '1';
                $response['message'] = trans('appmessages.deleteusersuccessfully');
            } else {
                $response['status'] = '0';
                $response['message'] = trans('appmessages.norecordfound');
            }
        }
        else
        {
            $response['status'] = '0';
            $response['message'] = trans('appmessages.tokennotmatched');
        }
        
        return response()->json($response);
        
    }
    
    public function getUsersResponse($getAllUsers) 
    {
          
        $response['status'] = 1;
        $response['message'] = trans('appmessages.allusersdatasuccessfullyget');
        $response['data'] = array();
        $i = 0;
        foreach ($getAllUsers as $key => $data)
        {                
           $response['data'][$i]['id'] = $data['id'];
           $response['data'][$i]['roleId'] = $data['role_id'];
           $response['data'][$i]['firstName'] = $data['first_name'];
           $response['data'][$i]['lastName'] = $data['last_name'];
           $response['data'][$i]['email'] = $data['email'];
           $response['data'][$i]['status'] = $data['status'];
           $response['data'][$i]['app'] = $data['app'];         
           $i++;
        }
        //print_r($response);die;
        return $response;
    }
    
}
