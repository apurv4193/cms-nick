<?php

use Illuminate\Database\Seeder;

class AppFontFamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('fontfamily_type')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('fontfamily_type')->insert([
            ['name' => 'Arial', 'value' => 'Arial'],
            ['name' => 'Helvetica', 'value' => 'Helvetica'],
            ['name' => 'Times New Roman', 'value' => 'Times New Roman'],
            ['name' => 'Times', 'value' => 'Times'],
            ['name' => 'Courier New', 'value' => 'Courier New'],
            ['name' => 'Courier', 'value' => 'Courier'],
            ['name' => 'Verdana', 'value' => 'Verdana'],
            ['name' => 'Georgia', 'value' => 'Georgia'],
            ['name' => 'Palatino', 'value' => 'Palatino'],
            ['name' =>  'Garamond', 'value' => 'Garamond'],
            ['name' =>  'Bookman', 'value' => 'Bookman'],
            ['name' =>  'Comic Sans MS', 'value' => 'Comic Sans MS'],
            ['name' =>  'Trebuchet MS', 'value' => 'Trebuchet MS'],
            ['name' =>  'Arial Black', 'value' => 'Arial Black'],
            ['name' =>  'Impact', 'value' => 'Impact'],
            ['name' =>  'Arial Black Regular', 'value' => 'arial_blackregular'],
            ['name' =>  'Arial Bold Italic', 'value' => 'arialbold_italic'],
            ['name' =>  'Arial Bold', 'value' => 'arialbold'],
            ['name' =>  'Arial Italic', 'value' => 'arialitalic'],
            ['name' =>  'Arial Regular', 'value' => 'arialregular'],
            ['name' =>  'Bookman Regular', 'value' => 'bookmanregular'],
            ['name' =>  'Courier New Bold Italic', 'value' => 'courier_newbold_italic'],
            ['name' =>  'Courier New Bold', 'value' => 'courier_newbold'],
            ['name' =>  'Courier New Italic', 'value' => 'courier_newitalic'],
            ['name' =>  'Courier New Regular', 'value' => 'courier_newregular'],
            ['name' =>  'Impact Regular', 'value' => 'impactregular'],
            ['name' =>  'Times New Roman Bold Italic', 'value' => 'times_new_romanbold_italic'],
            ['name' =>  'Times New Roman Bold', 'value' => 'times_new_romanbold'],
            ['name' =>  'Times New Roman Italic', 'value' => 'times_new_romanitalic'],
            ['name' =>  'Times New Roman Regular', 'value' => 'times_new_romanregular'],
            ['name' =>  'Bebas Neue Regular', 'value' => 'bebas_neueregular'],

            ['name' =>  'Lato Black', 'value' => 'latoblack'],
            ['name' =>  'Lato BlackItalic', 'value' => 'latoblack_italic'],
            ['name' =>  'Lato Bold', 'value' => 'latobold'],
            ['name' =>  'Lato BoldItalic', 'value' => 'latobold_italic'],
            ['name' =>  'Lato Hairline', 'value' => 'latohairline'],
            ['name' =>  'Lato HairlineItalic', 'value' => 'latohairline_italic'],
            ['name' =>  'Lato Heavy', 'value' => 'latoheavy'],
            ['name' =>  'Lato HeavyItalic', 'value' => 'latoheavy_italic'],
            ['name' =>  'Lato Italic', 'value' => 'latoitalic'],
            ['name' =>  'Lato Light', 'value' => 'latolight'],
            ['name' =>  'Lato LightItalic', 'value' => 'latolight_italic'],
            ['name' =>  'Lato Medium', 'value' => 'latomedium'],
            ['name' =>  'Lato MediumItalic', 'value' => 'latomedium_italic'],
            ['name' =>  'Lato Regular', 'value' => 'latoregular'],
            ['name' =>  'Lato Semibold', 'value' => 'latosemibold'],
            ['name' =>  'Lato SemiboldItalic', 'value' => 'latosemibold_italic'],
            ['name' =>  'Lato Thin', 'value' => 'latothin'],
            ['name' =>  'Lato ThinItalic', 'value' => 'latothin_italic']
        ]);

    }
}
