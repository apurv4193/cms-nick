<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Config;
use DB;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';
    protected $guarded = [];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function checkEmail($email)
    {
        //print_r($email);die("soso");
        return User::where('email', $email)->where('status','1')->first();
    }

    public function checkEmailAllStatus($email){
        
        return User::where('email', $email)->where('status','!=','3')->first();
    }
    
    public function checkOtp($otp)
    {
        return User::where('otp', $otp)->first();
    }
    
    public function checkEmailExist($email,$user_id)
    {
        return User::where([['email', $email],['id','!=',$user_id]])->first();
    }

    public function saveData($data) 
    {
        if(isset($data['id']) && $data['id'] > 0)
        {
            $return = User::where('id', $data['id'])->update($data);
        }
        else
        {
            $return = User::create($data);
        }
        return $return;
    }
    
    public function getUserDetailsById($editId)
    {
        $getData = User::where('id', $editId)->first();
        return $getData;
    }
    
    public function getAllUsersDetails()
    {
//      $getData = User::where('role_id', 2)->whereRaw('status IN ('.$status.')')->with('getData')->get();
        $getData = User::where('role_id', 2)->whereRaw('status IN (1,2)')->with('getData')->get();
        return $getData;
    }
    
    public function deletUser($deleteId)
    {
        $result = User::where('role_id', 2)->where('id', $deleteId)->update(['status' => Config::get('constant.DELETED_FLAG')]);
        return $result;
    }

    public function getData()
    {
        $return = $this->hasMany('App\AppAssignUser','user_id');
        return $return;
    } 
    /**
     * Method to fetch record by stripe id
     * @return user object
     */
    public function getUserByStripeId($stripe_id)
    {
        # code...
        $return = DB::table('users as us')
                    ->join('stripe_subscriptions as ss','ss.user_id','=','us.id')
                    ->where('ss.stripe_id',$stripe_id)
                    ->select('us.*')
                    ->first();
        
        return $return;
    }
    /**
     * Method to set user status inactive
     * @return user object
     */
    public function setInactiveById($inactiveID)
    {
        $result = User::where('role_id', 2)->where('id', $inactiveID)->update(['status' => Config::get('constant.INACTIVE_FLAG')]);
       
        return $result;
    }
        /**
     * Method to fetch record by email id
     * @return user object
     */
    public function getUserByEmailId($email)
    {
        # code...
        $return = User::where('email', $email)->first();
       
        return $return;
    }
    public function getUserById($user_id)
    {
        #code...
        $return = User::where('id',$user_id)->first();

        return $return;
    }
}

