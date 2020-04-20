
<?php 


require('./class/Auth.php');


if(isset($_GET['refresh_token']) && !empty($_GET['refresh_token'])) {
    $auth = new Auth();
    try {
        $login_response = $auth->refreshToken($_GET['refresh_token']);
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
