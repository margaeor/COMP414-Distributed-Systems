
<?php 


require('./class/Auth.php');

if(isset($_GET['username'],$_GET['password']) && !empty($_GET['username']) && !empty($_GET['password'])) {
    $auth = new Auth();
    try {
        $login_response = $auth->login($_GET['username'],$_GET['password']);
        echo json_encode([
            'status' => 200,
            'token' => $login_response['access_token']
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
