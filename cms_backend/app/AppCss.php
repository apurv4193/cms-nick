<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;
class AppCss extends Model 
{

    protected $table = 'app_css';
    protected $guarded = [];

    public function getAllCssData() 
    {
     $result =  DB::table('app_css')->get();
     return $result;
    }
    
    public function getAppCssBySlug($appCssSlug) 
    {
        $result =  AppCss::where('css_component', $appCssSlug)->first();
        return $result;
    }
}
