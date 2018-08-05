<?php

namespace App;
use DB;
use Illuminate\Database\Eloquent\Model;

class SettingData extends Model
{

    protected $table = 'industry_type';
    protected $guarded = [];

    public function saveSettingDataFun($body)
    {   
        $updateData['app_unique_id'] = (isset($body['app_unique_id']) && !empty($body['app_unique_id'])) ? $body['app_unique_id'] : null;
        $updateData['plystore_url'] = (isset($body['playstore_url']) && !empty($body['playstore_url'])) ? $body['playstore_url'] : null;
        $updateData['version'] = (isset($body['version']) && !empty($body['version'])) ? $body['version'] : null;
        $updateData['bundle_id'] = (isset($body['bundle_id']) && !empty($body['bundle_id'])) ? $body['bundle_id'] : null;
        $updateData['firebase_channel_id'] = (isset($body['firebase_id']) && !empty($body['firebase_id'])) ? $body['firebase_id'] : null;
        $updateData['android_app_id'] = (isset($body['andr_app_id']) && !empty($body['andr_app_id'])) ? $body['andr_app_id'] : null;
        $updateData['android_version'] = (isset($body['android_version']) && !empty($body['android_version'])) ? $body['android_version'] : null;
        $updateData['ios_app_id'] = (isset($body['ios_app_id']) && !empty($body['ios_app_id'])) ? $body['ios_app_id'] : null;
        $updateData['ios_version'] = (isset($body['ios_version']) && !empty($body['ios_version'])) ? $body['ios_version'] : null;
        $updateData['rate_android_app_id'] = (isset($body['rate_andr_app_id']) && !empty($body['rate_andr_app_id'])) ? $body['rate_andr_app_id'] : null;
        $updateData['rate_ios_app_id'] = (isset($body['rate_ios_app_id']) && !empty($body['rate_ios_app_id'])) ? $body['rate_ios_app_id'] : null;
        
        $data = DB::table('settings')->where('app_unique_id', '=', $body['app_unique_id'])->get()->toArray();
        
        if(sizeof($data) != 0)
        {
              $result = DB::table('settings')
                             ->where('app_unique_id', $body['app_unique_id'])
                             ->update($updateData);
        } else {
            $result = DB::table('settings')->insert($updateData);
            
        }
        return $result;
    }

    public function getSettingDataFun($body)
    {

        $data = DB::table('settings')->where('app_unique_id', '=', $body['id'])->get()->toArray();
    	return $data;

    }
}
