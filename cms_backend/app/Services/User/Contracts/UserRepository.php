<?php

namespace App\Services\User\Contracts;
use App\Services\Repositories\BaseRepository;
use App\Services\User\Entities\User;

interface UserRepository extends BaseRepository
{   
   public function checkEmail($email);
   public function checkEmailAllStatus($email);
   public function saveUserData($userData);
   public function checkOtp($otp);
   public function checkEmailExist($email,$user_id);
   public function getUsersDataById($editId);
   public function getAllUsersData();
   public function deletUserDetails($deleteId);
   
}
