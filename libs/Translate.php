<?php 

class Translate {

	public function Val($val='') {
		$lang = new Langs();
		return $lang->translate( $val );
	}
	public static function Menu($val='') {
		$lang = new Langs();
		return $lang->translate( 'menu', $val );
	}

}