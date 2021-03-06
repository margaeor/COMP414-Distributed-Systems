<?php

require_once("./config.php");

class DB {

	public $conn;
    
    private $config;
    
	function connect() {

		$this->config = include('./config.php');
        
        $dbhost = $this->config['dbhost'];
        $dbname = $this->config['dbname'];
        $dbuser = $this->config['dbuser'];
        $dbpass = $this->config['dbpass'];
        
        // Initialize a persistent connection
		$this->conn = new mysqli("p:$dbhost", $dbuser, $dbpass, $dbname);
		
		return !$this->conn ? $this->conn : $this->conn->connect_error;
    }

    function getUserFromToken($token) {
        if(!$this->conn) return -1;

        $query = "SELECT * FROM refresh_tokens as at
        INNER JOIN users as u ON at.user_id=u.id
        WHERE at.id = ?
        LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $token);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1 && $row = $result->fetch_assoc()) {
            return $row;
        }
        else return array();
    }

    function insertUser($username, $hash, $email, $secret) {

        if(!$this->conn) return -1;

        $query = "INSERT INTO users (username,password,email,secret) 
        VALUES (?,?,?,?)";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssss", $username, $hash, $email, $secret);

        if($stmt->execute()) {
            $stmt->close();
            return 0;
        } else {
            return -1;
        }

    }

    function updateLastLoginTime($username) {

        if(!$this->conn) return -1;

        $stmt = $this->conn->prepare("UPDATE users SET last_login = NOW() WHERE username = ? LIMIT 1");
        $stmt->bind_param("s",$username);
        $stmt->execute();

        if ($stmt->affected_rows === 1) {
            $stmt->close();
            return 0;
        } else {
            return -1;
        }
    }
    
    function updateRole($username, $newrole) {

        if(!$this->conn) return -1;

        if(!$this->fetchUser($username)) return -1;

        $stmt = $this->conn->prepare("UPDATE users SET role = ? WHERE username = ? LIMIT 1");
        $stmt->bind_param("ss", $newrole, $username);
        $stmt->execute();
        
        return 0;

        // if ($stmt->affected_rows === 1) {
        //     $stmt->close();
        //     return 0;
        // } else {
        //     return -1;
        // }
    }

    function setRoles($user, $roles) {

        if(!is_array($roles)) return -1;

        if(!$user) return -1;

        $stmt = $this->conn->prepare("DELETE FROM roles WHERE user_id = ?;");
        $stmt->bind_param("i", $user['id']);
        if(!$stmt->execute()) return -1;
        
        foreach (array_unique($roles) as $role) {
            $stmt = $this->conn->prepare("INSERT INTO roles VALUES (?,?);");
            $stmt->bind_param("is", $user['id'],$role);
            if(!$stmt->execute()) return -1;
        }
        return 0;

    }

    function updatePassword($username,$hash, $secret) {

        if(!$this->conn) return -1;

        $stmt = $this->conn->prepare("UPDATE users SET password = ? WHERE username = ? and secret = ? LIMIT 1");
        $stmt->bind_param("sss", $hash, $username, $secret);
        $stmt->execute();

        if ($stmt->affected_rows === 1) {
            $stmt->close();
            return 0;
        } else {
            return -1;
        }

    }

    function countUserTokens($user_id) {
        if(!$this->conn) return -1;

        $stmt = $this->conn->prepare("SELECT COUNT(`id`) FROM `refresh_tokens` WHERE `user_id` = ?");
        $stmt->bind_param("i", $user_id);

        $stmt->execute();

        $result = $stmt->get_result();

        if($row = $result->fetch_row()) {
            $stmt->close();
            return $row[0];
        } else {
            return 0;
        }
    }

    function deleteOldestTokens($user_id, $num_to_delete) {
        $stmt = $this->conn->prepare("DELETE FROM refresh_tokens WHERE user_id = ? ORDER BY date_created ASC LIMIT ?;");
        $stmt->bind_param("ii", $user_id, $num_to_delete);
        
        if($stmt->execute()) {
            $stmt->close();
            return 0;
        } else {
            return -1;
        }
    }

    function deleteToken($token) {
        $stmt = $this->conn->prepare("DELETE FROM refresh_tokens WHERE id = ?;");
        $stmt->bind_param("s", $token);
        
        if($stmt->execute()) {
            $stmt->close();
            return 0;
        } else {
            return -1;
        }
    }

    function fetchUser($username) {

        $stmt = $this->conn->prepare("SELECT * FROM users WHERE username = ? or email = ?");
        $stmt->bind_param("ss", $username, $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return array();
        }

        if ($row = $result->fetch_assoc()) {
            $stmt->close();
            return $row;
        }
        return array();

    }
    function fetchUserRoles($user_id) {
        $stmt = $this->conn->prepare("SELECT role FROM roles WHERE user_id = ? ");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return array();
        }

        $roles = array();
        while($row = $result->fetch_array(MYSQLI_NUM)) {
            array_push($roles,$row[0]);
        }
        $stmt->close();

        return $roles;
    }

    function insertToken($token, $user_id, $token_lifetime) {

        $stmt = $this->conn->prepare("INSERT INTO refresh_tokens VALUES (?,?,NOW(),TIMESTAMPADD(SECOND,?,NOW()))");
        $stmt->bind_param("sii", $token, $user_id, $token_lifetime);
        
        if($stmt->execute()) {
            return 0;
        } else {
            return -1;
        }
    }



	function disconnect() {
		
		if($this->conn) $this->conn->close();
		
	}

}