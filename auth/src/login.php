
<?php 


require('./class/Auth.php');


if(isset($_GET['username'],$_GET['password']) && !empty($_GET['username']) && !empty($_GET['password'])) {
    $auth = new Auth();
    try {
        $login_response = $auth->login($_GET['username'],$_GET['password']);
        $login_response['status'] = 200;
        echo json_encode($login_response);

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
