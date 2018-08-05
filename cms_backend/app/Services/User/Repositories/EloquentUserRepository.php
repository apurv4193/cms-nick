<?php

namespace App\Services\User\Repositories;

use DB;
use Config;
use App\Services\User\Contracts\UserRepository;
use App\User;
use App\Services\Repositories\Eloquent\EloquentBaseRepository;

class EloquentUserRepository extends EloquentBaseRepository implements UserRepository {

    public function __construct() 
    {
        $this->objUser = new User();
    }

    public function checkEmail($email) {
        return $this->objUser->checkEmail($email);
    }
    
    public function checkEmailAllStatus($email)
    {
        # code...
        return $this->objUser->checkEmailAllStatus($email);
    }
    

    public function saveUserData($userData)
    {
        return $this->objUser->saveData($userData);
    }

    public function checkOtp($otp)
    {
        return $this->objUser->checkOtp($otp);
    }

    public function checkEmailExist($email,$user_id)
    {
        return $this->objUser->checkEmailExist($email,$user_id);
    }
    
    public function getUsersDataById($editId)
    {
        $data = $this->objUser->getUserDetailsById($editId);
        return $data;
    }
    
    public function getAllUsersData()
    {
        return $this->objUser->getAllUsersDetails();
    }
    
    public function deletUserDetails($deleteId)
    {
        return $this->objUser->deletUser($deleteId);
    }
}
