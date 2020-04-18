<?php

$dbhost = getenv('DB_HOST');
$dbport = '';
$dbname = getenv('DB_NAME');
$dbuser = getenv('DB_USERNAME');
$dbpass = getenv('DB_PASSWORD');

$max_user_tokens = 5;

$user_roles = array('admin','player','official');