<?php 

require('./class/Auth.php');


if(isset($_GET['auth']) && !empty($_GET['auth']) ) {
    $auth = new Auth();
    try {
        $info = $auth->getUserInfo($_GET['auth']);
        echo json_encode([
            'status' => 200,
            'username' => $info['username'],
            'email' => $info['email'],
            'role' => $info['role']
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'status' => 401,
            'error' => $e->getMessage()
        ]);
    }

} else {
    echo json_encode([
        'status' => 400,
        'error' => 'Wrong parameters'
    ]);
}
