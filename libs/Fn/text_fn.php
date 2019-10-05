<?php

class Text_Fn extends _function {
    
    public function example($text){
        return "example:".$text;
    }

    public function _config(){
        return $this;
    }
    // อักขระ
    public function characters($str){
        if(eregi("[\~\!\`\#\%\^\$\&\*\+-,\;\/\@\{\}\\\'\"\:\<\>\(\)\?]|\]|\[|\||฿", $str) )
        return false;
        
        else
        return true;
    }

    public function strip_tags_html($str){

        if(empty($str)) return "";
        $newstr = "";
        $str = nl2br(trim($str));
        $str = strip_tags($str, "<p><strong><b><br><ul><ol><li><u><blockquote>"); // <em>
        //$str = mysql_real_escape_string(htmlspecialchars($str));

        $order = array('\&quot;', '"');
        $replace = '"'; //&quot;
        $newstr = str_replace($order, $replace, $str);

        $order = array('\&apos;', "'");
        $replace = "'";
        $newstr = str_replace($order, $replace, $newstr);

        
        $order = array("\r\n", "\n", "\r");
        $replace = '<br />';
        $newstr = str_replace($order, $replace, $newstr);
        for ($j = 0; $j < 5; $j++) {
            $str_replace = "<br />";
            for ($i = 0; $i < 10; $i++) {
                $str_replace .= "<br />";
                $newstr = str_replace($str_replace, '<br />', $newstr);
            }
        }

        $url = '~(?:(https?)://([^\s<]+)|(www\.[^\s<]+?\.[^\s<]+))(?<![\.,:])~i';
        // $url = '/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/';

        // $newstr = preg_replace($url, '<a href="$0" target="_blank" title="$0">$0</a>', $newstr);
        /*if( $url ){

            // $newstr = 'https://www.facebook.com/';

            $http = preg_replace('/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/', '', $newstr);

            if( !empty($http) ) {

                $newstr = preg_replace('~(?:(https?)://([^\s<]+)|(www\.[^\s<]+?\.[^\s<]+))(?<![\.,:])~i', '<a href="$0" target="_blank" title="$0">$0</a>', $newstr);
            }
            else{
                $newstr = preg_replace('~(?:(https?)://([^\s<]+)|(www\.[^\s<]+?\.[^\s<]+))(?<![\.,:])~i', '<a href="//$0" target="_blank" title="$0">$0</a>', $newstr);
                
            }
        }*/

        return trim($newstr);
    }
    
    public function strip_tags_br($text) { 

        $order = "<p>&nbsp;</p>";
        $replace = '<br>';

        // $str = "Is your name O\'reilly?";

        $text = stripslashes($text);
        $text = str_replace($order, $replace, $text);

        $order = array("\r\n", "\n", "\r");
        $replace = '';
        $text = str_replace($order, $replace, $text);

        for ($j = 0; $j < 5; $j++) {
            $str_replace = "<br>";
            for ($i = 0; $i < 10; $i++) {
                $str_replace .= "<br>";
                $text = str_replace($str_replace, '<br>', $text);
            }
        }
        return $text;
    }

    // '<a><ul><li><b><i><sup><sub><em><strong><u><br><br/><br /><p><h2><h3><h4><h5><h6>' ;
    public function strip_tags_editor($text, $allowed_tags="<a><p><strong><b><ul><ol><li><u><blockquote><img><h1><h2><h3>"){

        mb_regex_encoding('UTF-8');
        
        $text = nl2br(trim($text));
        $text = strip_tags($text, $allowed_tags);
        
        //replace MS special characters first
        $search = array('/&lsquo;/u', '/&rsquo;/u', '/&ldquo;/u', '/&rdquo;/u', '/&mdash;/u');
        $replace = array('\'', '\'', '"', '"', '-');
        $text = preg_replace($search, $replace, $text);
        
        $attribute = array('style','onclick','onload');
        foreach($attribute as $attr){
            $text = preg_replace("/(<[^>]+) {$attr}=\".*?\"/i", '$1', $text);
        }
        
        // $text = preg_replace('/<img src="(.+?)">(.+?)<\/p>/i', "$2", $text);
        // $text = preg_replace('/<img', '$2', $text);
        // $text = stripArgumentFromTags($text);

        return $this->strip_tags_br($text); 
    }

    public function mb_ucfirst($str, $enc = 'utf-8') { 
        return mb_strtoupper(mb_substr($str, 0, 1, $enc), $enc).mb_substr($str, 1, mb_strlen($str, $enc), $enc);
    }

    public function textarea($str) {
        $str = str_replace('<br />', "\n", $str);
        return strip_tags($str);
    }

    public function input($str){
        // htmlentities(string)
        return htmlentities($str);
    }

    public function more($str, $limit=150){

        $str = str_replace("", '<br>', $str);

        return (strlen( strip_tags($str) ) > $limit)
            ? mb_substr($str, 0, $limit, 'utf-8')."..."
            : $str;
    }

    public function address($data) {
        $str = '';

        // บ้านเลขที่
        $str.= $data['number'];

        // หมู่ที่
        $str.= " ม.{$data['mu']}";

        // หมู่บ้าน
        $str.= " บ้าน{$data['village']}";

        // ซอย
        if( !empty($data['alley']) ){
            $str.= " ซ.{$data['alley']}";
        }

        // ถนน
        if( !empty($data['street']) ){

            if($data['street']!='-'){
                $str.= " ถ.{$data['street']}";
            }
            
        }
        

        // ตำบล
        $str.= " ต.{$data['district']}";

        // อำเภอ
        $str.= " อ.{$data['amphur']}";

        // จังหวัด
        $str.= " จ.{$data['province']}";

        // รหัสไปรษณีย์
        $str.= " {$data['zip']}";

        return $str;
    }

    public function hashtag($string){
        $htag = "#";
        $arr = explode(' ', $string);
        $arrc = count($arr);

        $i = 0;
        while ($i < $arrc) {
            
            if(substr($arr[$i], 0, 1) === $htag){
                $arr[$i] = '<a href="/hashtag/">'.$arr[$i].'</a>';
            }
            $i++;
        }

       $string = implode(" ", $arr);
       return $string;
    }

    function isValidUrl($url){
        // first do some quick sanity checks:
        if(!$url || !is_string($url)){
            return false;
        }
        // quick check url is roughly a valid http request: ( http://blah/... ) 
        if( ! preg_match('/^http(s)?:\/\/[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(\/.*)?$/i', $url) ){
            return false;
        }
        // the next bit could be slow:
        if($this->getHttpResponseCode_using_curl($url) != 200){
//      if(getHttpResponseCode_using_getheaders($url) != 200){  // use this one if you cant use curl
            return false;
        }
        // all good!
        return true;
    }
    
    function getHttpResponseCode_using_curl($url, $followredirects = true){
        // returns int responsecode, or false (if url does not exist or connection timeout occurs)
        // NOTE: could potentially take up to 0-30 seconds , blocking further code execution (more or less depending on connection, target site, and local timeout settings))
        // if $followredirects == false: return the FIRST known httpcode (ignore redirects)
        // if $followredirects == true : return the LAST  known httpcode (when redirected)
        if(! $url || ! is_string($url)){
            return false;
        }
        $ch = @curl_init($url);
        if($ch === false){
            return false;
        }
        @curl_setopt($ch, CURLOPT_HEADER         ,true);    // we want headers
        @curl_setopt($ch, CURLOPT_NOBODY         ,true);    // dont need body
        @curl_setopt($ch, CURLOPT_RETURNTRANSFER ,true);    // catch output (do NOT print!)
        if($followredirects){
            @curl_setopt($ch, CURLOPT_FOLLOWLOCATION ,true);
            @curl_setopt($ch, CURLOPT_MAXREDIRS      ,10);  // fairly random number, but could prevent unwanted endless redirects with followlocation=true
        }else{
            @curl_setopt($ch, CURLOPT_FOLLOWLOCATION ,false);
        }
//      @curl_setopt($ch, CURLOPT_CONNECTTIMEOUT ,5);   // fairly random number (seconds)... but could prevent waiting forever to get a result
//      @curl_setopt($ch, CURLOPT_TIMEOUT        ,6);   // fairly random number (seconds)... but could prevent waiting forever to get a result
//      @curl_setopt($ch, CURLOPT_USERAGENT      ,"Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1");   // pretend we're a regular browser
        @curl_exec($ch);
        if(@curl_errno($ch)){   // should be 0
            @curl_close($ch);
            return false;
        }
        $code = @curl_getinfo($ch, CURLINFO_HTTP_CODE); // note: php.net documentation shows this returns a string, but really it returns an int
        @curl_close($ch);
        return $code;
    }

    function getHttpResponseCode_using_getheaders($url, $followredirects = true){
        // returns string responsecode, or false if no responsecode found in headers (or url does not exist)
        // NOTE: could potentially take up to 0-30 seconds , blocking further code execution (more or less depending on connection, target site, and local timeout settings))
        // if $followredirects == false: return the FIRST known httpcode (ignore redirects)
        // if $followredirects == true : return the LAST  known httpcode (when redirected)
        if(! $url || ! is_string($url)){
            return false;
        }
        $headers = @get_headers($url);
        if($headers && is_array($headers)){
            if($followredirects){
                // we want the the last errorcode, reverse array so we start at the end:
                $headers = array_reverse($headers);
            }
            foreach($headers as $hline){
                // search for things like "HTTP/1.1 200 OK" , "HTTP/1.0 200 OK" , "HTTP/1.1 301 PERMANENTLY MOVED" , "HTTP/1.1 400 Not Found" , etc.
                // note that the exact syntax/version/output differs, so there is some string magic involved here
                if(preg_match('/^HTTP\/\S+\s+([1-9][0-9][0-9])\s+.*/', $hline, $matches) ){// "HTTP/*** ### ***"
                    $code = $matches[1];
                    return $code;
                }
            }
            // no HTTP/xxx found in headers:
            return false;
        }
        // no headers :
        return false;
    }

    public function initials($text) {
        
        $initials = '';

        if( preg_match("/^[a-zA-Z0-9]+$/i", $text)){

            $res = explode(' ', $text);

            if( !empty($res[1]) ){
                $initials = mb_strtoupper($res[0][0], 'UTF-8').mb_strtoupper($res[1][0], 'UTF-8');
            }
            else{
                $initials = mb_strtoupper($res[0][0], 'UTF-8');

                if( !empty($res[0][1]) ){
                    $initials .= $res[0][1];
                }
            }
        }
        else{

            $text = preg_replace('/[^[:alnum:]]/ui', '', $text);
            $initials = mb_substr($text,0,2);
            
        }

        return  $initials;
    }
    public function getMBStrSplit($string, $split_length = 1){
        mb_internal_encoding('UTF-8');
        mb_regex_encoding('UTF-8'); 

        $split_length = ($split_length <= 0) ? 1 : $split_length;
        $mb_strlen = mb_strlen($string, 'utf-8');
        $array = array();
        $i = 0; 

        while($i < $mb_strlen)
        {
            $array[] = mb_substr($string, $i, $split_length);
            $i = $i+$split_length;
        }

        return $array;
    }   

    public function phone_number($text, $tag=' ', $haystack=array(3,6)) {
        $c = 0;
        $val = '';
        for ($i = 0; $i < strlen($text); $i++) {
            $c++;

            if( in_array($i, $haystack) ){
                $val .= $tag;
            }
            $val .= $text[$i];

            if( $c==10 ) break;
        };
        return $val;
    }


    function createPrimarylink( $title, $raw_title = '', $context = 'display' ) {
        $title = strip_tags($title);
        // Preserve escaped octets.
        $title = preg_replace('|%([a-fA-F0-9][a-fA-F0-9])|', '---$1---', $title);
        // Remove percent signs that are not part of an octet.
        $title = str_replace('%', '', $title);
        // Restore octets.
        $title = preg_replace('|---([a-fA-F0-9][a-fA-F0-9])---|', '%$1', $title);

        // echo urlencode($title); die;

        if ($this->seems_utf8($title)) {
            if (function_exists('mb_strtolower')) {
                $title = mb_strtolower($title, 'UTF-8');
            }
            $title = $this->utf8_uri_encode($title, 500);
        }

        $title = strtolower($title);
        


        if ( 'save' == $context ) {
            // Convert nbsp, ndash and mdash to hyphens
            $title = str_replace( array( '%c2%a0', '%e2%80%93', '%e2%80%94' ), '-', $title );
            // Convert nbsp, ndash and mdash HTML entities to hyphens
            $title = str_replace( array( '&nbsp;', '&#160;', '&ndash;', '&#8211;', '&mdash;', '&#8212;' ), '-', $title );
            // Convert forward slash to hyphen
            $title = str_replace( '/', '-', $title );

            // Strip these characters entirely
            $title = str_replace( array(
                // iexcl and iquest
                '%c2%a1', '%c2%bf',
                // angle quotes
                '%c2%ab', '%c2%bb', '%e2%80%b9', '%e2%80%ba',
                // curly quotes
                '%e2%80%98', '%e2%80%99', '%e2%80%9c', '%e2%80%9d',
                '%e2%80%9a', '%e2%80%9b', '%e2%80%9e', '%e2%80%9f',
                // copy, reg, deg, hellip and trade
                '%c2%a9', '%c2%ae', '%c2%b0', '%e2%80%a6', '%e2%84%a2',
                // acute accents
                '%c2%b4', '%cb%8a', '%cc%81', '%cd%81',
                // grave accent, macron, caron
                '%cc%80', '%cc%84', '%cc%8c',
            ), '', $title );

            // Convert times to x
            $title = str_replace( '%c3%97', 'x', $title );
        }

        // 
        $title = preg_replace('/&.+?;/', '', $title); // kill entities
        $title = str_replace('.', '-', $title);

        $title = preg_replace('/[^%a-z0-9 _-]/', '', $title);
        $title = preg_replace('/\s+/', '-', $title);
        $title = preg_replace('|-+|', '-', $title);
        $title = trim($title, '-');

        $title = urldecode($title);
        $title = preg_replace('/“|”/', '', $title);

        return $title;
    }

    function seems_utf8( $str ) {
        // mbstring_binary_safe_encoding();
        $length = strlen($str);
        // reset_mbstring_encoding();
        for ($i=0; $i < $length; $i++) {
            $c = ord($str[$i]);
            if ($c < 0x80) $n = 0; // 0bbbbbbb
            elseif (($c & 0xE0) == 0xC0) $n=1; // 110bbbbb
            elseif (($c & 0xF0) == 0xE0) $n=2; // 1110bbbb
            elseif (($c & 0xF8) == 0xF0) $n=3; // 11110bbb
            elseif (($c & 0xFC) == 0xF8) $n=4; // 111110bb
            elseif (($c & 0xFE) == 0xFC) $n=5; // 1111110b
            else return false; // Does not match any model
            for ($j=0; $j<$n; $j++) { // n bytes matching 10bbbbbb follow ?
                if ((++$i == $length) || ((ord($str[$i]) & 0xC0) != 0x80))
                    return false;
            }
        }
        return true;
    }


    /**
     * Encode the Unicode values to be used in the URI.
     *
     * @since 1.5.0
     *
     * @param string $utf8_string
     * @param int    $length Max  length of the string
     * @return string String with Unicode encoded for URI.
     */
    function utf8_uri_encode( $utf8_string, $length = 0 ) {
        $unicode = '';
        $values = array();
        $num_octets = 1;
        $unicode_length = 0;

        // mbstring_binary_safe_encoding();
        $string_length = strlen( $utf8_string );
        // reset_mbstring_encoding();

        for ($i = 0; $i < $string_length; $i++ ) {

            $value = ord( $utf8_string[ $i ] );

            if ( $value < 128 ) {
                if ( $length && ( $unicode_length >= $length ) )
                    break;
                $unicode .= chr($value);
                $unicode_length++;
            } else {
                if ( count( $values ) == 0 ) {
                    if ( $value < 224 ) {
                        $num_octets = 2;
                    } elseif ( $value < 240 ) {
                        $num_octets = 3;
                    } else {
                        $num_octets = 4;
                    }
                }

                $values[] = $value;

                if ( $length && ( $unicode_length + ($num_octets * 3) ) > $length )
                    break;
                if ( count( $values ) == $num_octets ) {
                    for ( $j = 0; $j < $num_octets; $j++ ) {
                        $unicode .= '%' . dechex( $values[ $j ] );
                    }

                    $unicode_length += $num_octets * 3;

                    $values = array();
                    $num_octets = 1;
                }
            }
        }

        return $unicode;
    }
}