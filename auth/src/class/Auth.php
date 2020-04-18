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

    function hasExpired($token) {

        if(isset($token['date_created'], $token['valid_until'])) {

            if(is_null($token['valid_until'])) return True;

            $today = new DateTime('');
            $expireDate = new DateTime($token['valid_until']); //from database

            return $today->format("Y-m-d H:i:s") > $expireDate->format("Y-m-d H:i:s");

        }
        return False;
    }

    function createUser($username, $password, $email, $secret) {

        $hash = password_hash($password, PASSWORD_DEFAULT);

        if($this->db->insertUser($username, $hash, $email, 'player', $secret) != -1) {
            return True;
        } else {
            throw new Exception("Error inserting user");
        }

    }

    function getUserInfo($access_token) {

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");

        $info = $this->db->getUserFromToken($access_token);

        if($info && !$this->hasExpired($info) ) {

            return $info;

        } else throw new Exception("Access is denied.");
    }

    function resetPassword($username, $new_password, $secret) {

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");

        $hash = password_hash($new_password, PASSWORD_DEFAULT);

        if($this->db->updatePassword($username, $hash, $secret) == 0) {
            return True;
        } else {
            throw new Exception("Access is denied.");
        }

    }

    function changeRole($token, $username, $new_role) {
        
        global $user_roles;

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");

        $user_info = $this->getUserInfo($token);

        if($user_info['role'] === 'admin' && in_array($new_role,$user_roles)) {
            if($this->db->updateRole($username, $new_role) === 0) {
                return True;
            } else {
                throw new Exception("No such user exists");
            }
        } else {
            throw new Exception("Operation not permitted!");
        }

    }

    function login($username, $password) {
        global $max_user_tokens;

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");

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
                
                if($this->db->insertToken($token, $user_id) == 0 && $this->db->updateLastLoginTime($username) == 0) {
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