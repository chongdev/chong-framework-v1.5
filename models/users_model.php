<?php

class Users_Model extends Model{

    public function __construct() {
        parent::__construct();
    }

    private $_objType = "users";
    private $_table = "users u LEFT JOIN users_roles r ON u.user_role_id=r.role_id";
    private $_field = "
          u.user_id
        , user_login
        , user_email
        , user_name
        , user_updated
        , user_lang
        , user_mode

        , role_id
        , role_name
        , user_is_owner
        , user_lastvisit
        , user_enabled
    ";
    private $_firstFieldName = "user_";

    public function is_user($text){
        $c = $this->db->count('users', "(user_login=:txt AND user_login!='') OR (user_email=:txt AND user_email!='')", array(':txt'=>$text));
        
        return $c;
    }
    public function is_name($text) {
        return $this->db->count($this->_objType, "name='{$text}'");
    }
    public function insert(&$data) {
        
        $data["{$this->_firstFieldName}created"] = date('c');
        $data["{$this->_firstFieldName}updated"] = date('c');
        $data["{$this->_firstFieldName}enabled"] = 1;

        if( isset($data["{$this->_firstFieldName}pass"]) ){
            $data["{$this->_firstFieldName}pass"] = Hash::create('sha256', $data["{$this->_firstFieldName}pass"], HASH_PASSWORD_KEY);
        }

        $this->db->insert($this->_objType, $data);
        $data['id'] = $this->db->lastInsertId();

        $data = $this->_cutFirstFieldName($this->_firstFieldName, $data);
    }
    public function update($id, $data) {
        $data["{$this->_firstFieldName}updated"] = date('c');
        $this->db->update($this->_table, $data, "{$this->_firstFieldName}id={$id}");
    }
    public function delete($id) {
        $this->db->delete($this->_objType, "{$this->_firstFieldName}id={$id}");
    }

    public function lists( $options=array() ) {

        $options = array_merge(array(
            'pager' => isset($_REQUEST['pager'])? $_REQUEST['pager']:1,
            'limit' => isset($_REQUEST['limit'])? $_REQUEST['limit']:50,
            'more' => true,

            'sort' => isset($_REQUEST['sort'])? $_REQUEST['sort']: 'lastvisit',
            'dir' => isset($_REQUEST['dir'])? $_REQUEST['dir']: 'DESC',
            
            'time'=> isset($_REQUEST['time'])? $_REQUEST['time']:time(),
            
            // 'q' => isset($_REQUEST['q'])? $_REQUEST['q']:null,

            'enabled' => isset($_REQUEST['enabled'])? $_REQUEST['enabled']:1,

        ), $options);

        $date = date('Y-m-d H:i:s', $options['time']);

        
        $condition = '';
        $params = array();

        $condition .= !empty( $condition ) ? " AND ":'';
        $condition .= "user_enabled=:enabled";
        $params[':enabled'] = $options['enabled'];

        

        $arr['total'] = $this->db->count($this->_table, $condition, $params);

        $limit = $this->limited( $options['limit'], $options['pager'] );
        $orderby = $this->orderby( $this->_firstFieldName.$options['sort'], $options['dir'] );
        $where = !empty($condition) ? "WHERE {$condition}":'';
        $arr['lists'] = $this->buildFrag( $this->db->select("SELECT {$this->_field} FROM {$this->_table} {$where} {$orderby} {$limit}", $params ) );

        if( ($options['pager']*$options['limit']) >= $arr['total'] ) $options['more'] = false;
        $arr['options'] = $options;

        return $arr;
    }
    public function buildFrag($results) {
        $data = array();
        foreach ($results as $key => $value) {
            if( empty($value) ) continue;
            $data[] = $this->convert( $value );
        }

        return $data;
    }
    public function get($id){
        
        $sth = $this->db->prepare("SELECT {$this->_field} FROM {$this->_table} WHERE {$this->_firstFieldName}id=:id LIMIT 1");
        $sth->execute( array(
            ':id' => $id
        ) );

        if( $sth->rowCount()==1 ){
            return $this->convert( $sth->fetch( PDO::FETCH_ASSOC ) );
        } return array();
    }
    public function convert($data){

        $data = $this->_cutFirstFieldName($this->_firstFieldName, $data);
        $data['access'] = $this->setAccess($data['role_id']);        

        $data['initials'] = $this->fn->q('text')->initials( $data['name'] );
        $data['permit']['del'] = !empty($data['is_owner']) ? false: true;

        return $data;
    }

    public function setAccess($id) 
    {
        $access = array();
        if( $id == 1 ){
            $access = array(1);
        }
        elseif($id == 2){
            $access = array(2);
        }

        return $access;
    }

    public function login($user, $pess){

        $sth = $this->db->prepare("SELECT user_id as id FROM {$this->_objType} WHERE (user_login=:login AND user_pass=:pass) OR (user_email=:login AND user_pass=:pass)");

        $sth->execute( array(
            ':login' => $user,
            ':pass' => Hash::create('sha256', $pess, HASH_PASSWORD_KEY)
        ) );

        $fdata = $sth->fetch( PDO::FETCH_ASSOC );
        return $sth->rowCount()==1 ? $fdata['id']: false;
    }

    /**/
    /* roles */
    /**/
    public function roles($type='') {
        return $this->db->select("SELECT role_id as id, role_name as name FROM users_roles");
    }

}
