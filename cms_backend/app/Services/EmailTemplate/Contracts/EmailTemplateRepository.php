<?php

namespace App\Services\EmailTemplate\Contracts;
use App\Services\Repositories\BaseRepository;
use App\Services\EmailTemplate\Entities\EmailTemplate;

interface EmailTemplateRepository extends BaseRepository
{   
   public function addEmailTamplate($emailData);
   
   public function updateEmailTemplateData($updatedId, $emailData);
   
   public function getAllEmailTemplates();
   
   public function getEmailTemplateDataByName($pseudoName);
   
   public function deletEmailTemplate($id);
   
   public function fetchEmailTempById($id);

   public function getEmailContent($str , $arr);
   
}
