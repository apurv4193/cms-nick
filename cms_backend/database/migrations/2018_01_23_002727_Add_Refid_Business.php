<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRefidBusiness extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add Refer ID of busineess lead
        Schema::table('strip_transaction', function (Blueprint $table) {
            $table->string('is_refer_id')->nullable()->default(null)->after('is_refer')->comment('ID of referer businesses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('strip_transaction', function (Blueprint $table) {
            
        });
    }
}
