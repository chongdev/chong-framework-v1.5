<?php

class Bootstrap {

    private $_url = null;
    private $_controller = null;
    
    private $_controllerPath = 'controllers/'; // Always include trailing slash
    private $_modelPath = 'models/'; // Always include trailing slash
    private $_errorFile = 'error.php';
    private $_defaultFile = 'index.php';
    private $_itemsPath = array('media');
    
    /**
     * Starts the Bootstrap
     * 
     * @return boolean
     */
    public function init() {
        // Sets the protected $_url
        $this->_getUrl();

        // Load the default controller if no URL is set
        // eg: Visit http://localhost it loads Default Controller
        if (empty($this->_url[0])) {
            $this->_loadDefaultController();
            return false;
        }

        $this->_loadExistingController();
        $this->_callControllerMethod();
    }
    
    /**
     * (Optional) Set a custom path to controllers
     * @param string $path
     */
    public function setControllerPath($path) 
    {
        $this->_controllerPath = trim($path, '/') . '/';
    }
    
    /**
     * (Optional) Set a custom path to models
     * @param string $path
     */
    public function setModelPath($path)
    {
        $this->_modelPath = trim($path, '/') . '/';
    }
    
    /**
     * (Optional) Set a custom path to the error file
     * @param string $path Use the file name of your controller, eg: error.php
     */
    public function setErrorFile($path)
    {
        $this->_errorFile = trim($path, '/');
    }
    
    /**
     * (Optional) Set a custom path to the error file
     * @param string $path Use the file name of your controller, eg: index.php
     */
    public function setDefaultFile($path)
    {
        $this->_defaultFile = trim($path, '/');
    }
    
    /**
     * Fetches the $_GET from 'url'
     */
    private function _getUrl()
    {
        $url = isset($_GET['url']) ? $_GET['url'] : null;
        $url = rtrim($url, '/');

        // $this->_validateUrl( $url );
        // $url = filter_var($url, FILTER_SANITIZE_URL);
        $this->_url = explode('/', $url);
    }
    private  function _validateUrl($url) {
        $path = parse_url($url, PHP_URL_PATH);
        $encoded_path = array_map('urlencode', explode('/', $path));
        $url = str_replace($path, implode('/', $encoded_path), $url);

        return filter_var($url, FILTER_VALIDATE_URL) ? true : false;
    }
    
    /**
     * This loads if there is no GET parameter passed
     */
    private function _loadDefaultController()
    {
        $url = isset($_GET['url']) ? $_GET['url']: null;

        if( !empty($url) ){
            $this->_search();
        }
        else{
            require $this->_controllerPath . $this->_defaultFile;
            $this->_controller = new Index();
            $this->_controller->loadModel('index', $this->_modelPath);
            $this->_controller->index();
        }
    }
    
    /**
     * Load an existing controller if there IS a GET parameter passed
     * 
     * @return boolean|string
     */
    private function _loadExistingController()
    {
        $file = $this->_controllerPath . $this->_url[0] . '.php';
        
        if (file_exists($file)) {
            require $file;

            $page = str_replace('-', '', $this->_url[0]);
            $this->_controller = new $page;
            $this->_controller->loadModel($page, $this->_modelPath);
        } else {

            $this->_search();
            
            // $this->_error( $this->_url[0] );
            return false;
        }
    }

    public function _search() {

        require $this->_controllerPath . $this->_defaultFile;
        $this->_controller = new Index();
        $this->_controller->loadModel('index', $this->_modelPath);
        $this->_controller->search( $this->_url );
        exit;
    }
    
    /**
     * If a method is passed in the GET url paremter
     * 
     *  http://localhost/controller/method/(param)/(param)/(param)
     *  url[0] = Controller
     *  url[1] = Method
     *  url[2] = Param
     *  url[3] = Param
     *  url[4] = Param
     */
    private function _callControllerMethod()
    {
        $length = count($this->_url);
        
        // Make sure the method we are calling exists
        if ($length > 1) {
            if (!method_exists($this->_controller, $this->_url[1])) {

                if( $this->_url[0]=='media' || $this->_url[0]=='photos' ){

                    $this->_controller->index( $this->_url );
                    exit;
                }

                if( $length >= 2 && $length <= 3 && in_array($this->_url[0], $this->_itemsPath ) ){

                    if( is_numeric($this->_url[1]) ){

                        switch ($length) {
                            case 3:
                                $this->_controller->index($this->_url[1], $this->_url[2]);
                                break;
                            
                            default:
                                $this->_controller->index($this->_url[1]);
                                break;
                        }
                        
                        exit;
                    }
                }

                $this->_search();
            }
        }

        // Determine what to load
        switch ($length) {
            case 5:
                //Controller->Method(Param1, Param2, Param3)
                $this->_controller->{$this->_url[1]}($this->_url[2], $this->_url[3], $this->_url[4]);
                break;
            
            case 4:
                //Controller->Method(Param1, Param2)
                $this->_controller->{$this->_url[1]}($this->_url[2], $this->_url[3]);
                break;
            
            case 3:
                //Controller->Method(Param1, Param2)
                $this->_controller->{$this->_url[1]}($this->_url[2]);
                break;
            
            case 2:
                //Controller->Method(Param1, Param2)
                $this->_controller->{$this->_url[1]}();
                break;
            
            default:
                $this->_controller->index();
                break;
        }
    }
    
    /**
     * Display an error page if nothing exists
     * 
     * @return boolean
     */
    private function _error($path=null) {

        require $this->_controllerPath . $this->_errorFile;
        $this->_controller = new Error();
        $this->_controller->index($path);
        exit;
    }

}