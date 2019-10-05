<?php 

if( !empty($this->crumps) ){

	echo '<nav class="bread-crumps"><ul>';

		foreach ($this->crumps as $value) {
			$ico = !empty($value['icon']) ? '<i class="mrs icon-'.$value['icon'].'"></i>':'';

			if( !empty($value['url']) ){
				echo '<li><a href="'.$value['url'].'">'.$ico.'<span>'.$value['name'].'</span></a></li>';
			}
			else{
				echo '<li>'.$ico.'<span>'.$value['name'].'</span></li>';
			}
		}

	echo '</ul></nav>';

}