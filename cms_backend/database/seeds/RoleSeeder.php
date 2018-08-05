<?php

use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if(DB::table('role')->get()->count() == 0)
        {
            DB::table('role')->insert([
                'name' => 'Admin User',
            ]);
            DB::table('role')->insert([
                'name' => 'General User',
            ]);
        }
    }
}
