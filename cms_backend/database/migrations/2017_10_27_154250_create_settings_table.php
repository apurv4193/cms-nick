<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('settings'))
        {
            Schema::create('settings', function (Blueprint $table)
            {
                $table->increments('id')->comment('Primary Key');
                $table->longText('app_unique_id')->nullable();
                $table->string('plystore_url', 255)->nullable();
                $table->string('version', 255)->nullable();
                $table->string('bundle_id', 255)->nullable();
                $table->string('firebase_channel_id', 255)->nullable();
                $table->longText('android_app_id')->nullable();
                $table->longText('android_version')->nullable();
                $table->longText('ios_app_id')->nullable();
                $table->longText('ios_version')->nullable();
                $table->longText('rate_android_app_id')->nullable();
                $table->longText('rate_ios_app_id')->nullable();
                $table->longText('force_update_message')->nullable();
                $table->enum('status',['1','2','3'])->default('1')->comment('1=>active, 2=>inactive, 3=>deleted');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
