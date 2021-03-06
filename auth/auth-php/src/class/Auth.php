<?php
require_once("./class/Database.php");
require("./vendor/autoload.php");

use \Firebase\JWT\JWT;

class Auth {

    public $db;

    private $config;

    function __construct() {
        global $dbhost, $dbuser, $dbpass, $dbname;
        
        $this->db = new DB();

        $this->db->connect();

        $this->config = include('./config.php');

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

        if($this->db->insertUser($username, $hash, $email, $secret) != -1) {
            $user = $this->db->fetchUser($username);
            if($user && $this->db->setRoles($user,array('player')) != -1)
            return $this->createJWTToken($user);
        } else {
            throw new Exception("Error inserting user");
        }

    }

    function getUserInfo($access_token) {

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");
        
        try {
            
            $decoded = JWT::decode($access_token, $this->config['auth_public'], array($this->config['algorithm']));

            return (array)$decoded->data;

        } catch (Exception $e){

            throw new Exception("Access is denied.");

        } 

    }

    function refreshToken($token) {

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");
        
        if($user_token = $this->db->getUserFromToken($token)) {

            if($this->hasExpired($user_token)) throw new Exception("Access denied.");

            $result = $this->createJWTToken($user_token);

            $this->db->deleteToken($token);

            return $result;

        } else {
            throw new Exception("Access denied.");
        }
    }

    function resetPassword($username, $new_password, $secret) {

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");

        $hash = password_hash($new_password, PASSWORD_DEFAULT);

        if($this->db->updatePassword($username, $hash, $secret) == 0) {
            return $this->login($username,$new_password);
        } else {
            throw new Exception("Access is denied.");
        }

    }

    function setRoles($token, $username, $new_roles) {
        

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");

        $decoded = array();

        try {
            
            $decoded = JWT::decode($token, $this->config['auth_public'], array($this->config['algorithm']));

        } catch (Exception $e){

            throw new Exception("Access is denied.");

        } 
        
        $user = $this->db->fetchUser($decoded->data->username);
        if(!$user) throw new Exception("No such user exists");

        $roles = $this->db->fetchUserRoles($user['id']);

        if(is_array($new_roles)) array_push($new_roles,'player');

        if(is_array($roles) && in_array('admin', $roles)) {

            $target_user = $this->db->fetchUser($username);

            if(!$target_user) throw new Exception("User does not exist");

            if($this->db->setRoles($target_user, $new_roles) === 0) {
                return True;
            } else {
                throw new Exception("Cannot set permissions");
            }
        } else {
            throw new Exception("Operation not permitted!");
        }

    }

    function createJWTToken($user) {


        $secret_key = $this->config['auth_private'];
        $issuer_claim = $this->config['key_issuer']; 
        $issuedat_claim = time(); // issued at
        $expire_claim = $issuedat_claim + $this->config['token_lifetime']; // expire time in seconds
        $roles = $this->db->fetchUserRoles($user['id']);

        $data = array(
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email'],
            "roles" => $roles
        );
        $token = array(
            "iss" => $issuer_claim,
            "iat" => $issuedat_claim,
            "exp" => $expire_claim,
            "data" => $data);
        
        $jwt = JWT::encode($token, $secret_key, $this->config['algorithm']);
        

        $refresh_token = bin2hex(openssl_random_pseudo_bytes(32));

        // On collision retry (collision is almost impossible)
        $i = 0;
        while($this->db->insertToken($refresh_token, $user['id'], $this->config['refresh_token_lifetime']) != 0) {
            $refresh_token = bin2hex(random_bytes (32));
            $i++;
            if($i > 5) throw new Exception("Refresh token generation error!");
        }


        $this->db->updateLastLoginTime($user['username']);

        return array(
            'jwt' => $jwt,
            'username' => $data['username'],
            'roles' => $data['roles'],
            'refresh_token' => $refresh_token,
            'refresh_expiration' => $issuedat_claim + $this->config['refresh_token_lifetime'],
            'public_key' => base64_encode($this->config['auth_public'])
        );
    }

    function login($username, $password) {

        if(!$this->db || !$this->db->conn) throw new Exception("Database connection not established!");

        $error = "";

        $response = array(
            'jwt' => '',
            'refres'
        );

        if ($user = $this->db->fetchUser($username)) {
            $pass = $user['password'];
            $user_id = $user['id'];
            
            if (password_verify($password, $pass)) {

                
                // Count the number of access tokens this user has
                $token_count = $this->db->countUserTokens($user_id);
                
                // Delete some tokens if the user has many tokens
                if($token_count >= $this->config['max_refresh_tokens']) {
                    $tokens_to_delete = $token_count-$this->config['max_refresh_tokens']+1;
                    $this->db->deleteOldestTokens($user_id,max($tokens_to_delete,0));
                }
                
                return $this->createJWTToken($user);
                
            } else {
                throw new Exception("Wrong password!");
            }
        } else {
            throw new Exception("Such user does not exist!");
        }

    }

    function __destruct() {
        if($this->db) $this->db->disconnect();
    }

};