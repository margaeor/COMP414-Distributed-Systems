<?php
require_once("./config.php");
require_once("./class/Database.php");

class Auth {

    public $db;

    function __construct() {
        global $dbhost, $dbuser, $dbpass, $dbname;
        
        $this->db = new DB();

        $this->db->connect();


    }

    function login($username, $password) {
        global $max_user_tokens;

        if(!$this->db || !$this->db->conn) return -1;

        $error = "";

        $response = array(
            'access_token' => ''
        );

        if ($user = $this->db->fetchUser($username,$password)) {
            $pass = $user['password'];
            $user_id = $user['id'];
            
            if (password_verify($password, $pass)) {

                
                // Count the number of access tokens this user has
                $token_count = $this->db->countUserTokens($user_id);
                
                // Delete some tokens if the user has many tokens
                if($token_count >= $max_user_tokens) {
                    $tokens_to_delete = $token_count-$max_user_tokens+1;
                    $this->db->deleteOldestTokens($user_id,max($tokens_to_delete,0));
                }
                
                // Create and insert token
                $token = bin2hex(openssl_random_pseudo_bytes(32));
                
                if($this->db->insertToken($token, $user_id) == 0) {
                    $response['access_token'] = $token;
                } else {
                    throw new Exception("Access token generation error!");
                }
                
            } else {
                throw new Exception("Wrong password!");
            }
        } else {
            throw new Exception("Such user does not exist!");
        }

        return $response;
    }

    function __destruct() {
        if($this->db) $this->db->disconnect();
    }

};