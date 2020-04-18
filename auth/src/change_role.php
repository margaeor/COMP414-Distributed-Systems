<?php 


require('./class/Auth.php');


if(isset($_GET['username'],$_GET['auth'],$_GET['new_role']) && 
   !empty($_GET['username']) && !empty($_GET['auth']) && !empty($_GET['new_role'])
) {
    $auth = new Auth();
    try {
        $login_response = $auth->changeRole($_GET['auth'],$_GET['username'],$_GET['new_role']);
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
