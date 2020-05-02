<?php 


require('./class/Auth.php');


if(isset($_GET['username'],$_GET['jwt'],$_GET['roles']) && 
   !empty($_GET['username']) && !empty($_GET['jwt']) && !empty($_GET['roles'] && is_array($_GET['roles']))
) {
    $auth = new Auth();
    try {
        $login_response = $auth->setRoles($_GET['jwt'],$_GET['username'],$_GET['roles']);
        echo json_encode([
            'status' => 200
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
