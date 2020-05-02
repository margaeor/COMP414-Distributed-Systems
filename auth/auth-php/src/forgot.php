<?php


require('./class/Auth.php');


if(isset($_GET['username'], $_GET['password'], $_GET['secret']) && 
  !empty($_GET['username']) && !empty($_GET['password']) && !empty($_GET['secret'])
) {
    
    $auth = new Auth();
    try {
        $response = $auth->resetPassword($_GET['username'],$_GET['password'],$_GET['secret']);
        $response['status'] = 200;
        echo json_encode($response);

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