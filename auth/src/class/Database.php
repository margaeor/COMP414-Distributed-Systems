<?php

require_once("./config.php");

class DB {

	public $conn;
	
	function connect() {
		global $dbhost,$dbuser, $dbpass, $dbname;
		
		//echo "D".$dbhost;
		$this->conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
		
		//if(!$conn->connect_error) echo "SHIT ".$conn;
		
		return !$this->conn ? $this->conn : $this->conn->connect_error;
    }
    
    function countUserTokens($user_id) {
        if(!$this->conn) return -1;

        $stmt = $this->conn->prepare("SELECT COUNT(`id`) FROM `access_tokens` WHERE `user_id` = ?");
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
        $stmt = $this->conn->prepare("DELETE FROM access_tokens WHERE user_id = ? ORDER BY date_created ASC LIMIT ?;");
        $stmt->bind_param("ii", $user_id, $num_to_delete);
        
        if($stmt->execute()) {
            $stmt->close();
            return 0;
        } else {
            return -1;
        }
    }

    function fetchUser($username, $password) {

        $stmt = $this->conn->prepare("SELECT * FROM users WHERE username = ? or email = ?");
        $stmt->bind_param("ss", $username, $password);
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

    function insertToken($token, $user_id) {

        $stmt = $this->conn->prepare("INSERT INTO access_tokens VALUES (?,?,NOW(),NULL)");
        $stmt->bind_param("si", $token, $user_id);
        
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