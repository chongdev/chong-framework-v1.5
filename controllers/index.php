<?php

class Index extends Controller {

    public function __construct() {
        parent::__construct();
    }

    private function init() {
    }
    

    // home
    public function index() {
        
        $this->view->render("home/display");
    }

    public function search($param=null) {
        $this->error();
    }
}
