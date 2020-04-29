<?php


if (!defined('DB_PASSWORD') ) {
    // Make sure that the password is loaded once per request
    define('DB_PASSWORD',file_get_contents(getenv('DB_PASSWORD_FILE')));
}

return array(
    'dbhost' => getenv('DB_HOST'),
    'dbport' => '',
    'dbname' => getenv('DB_NAME'),
    'dbuser' => getenv('DB_USERNAME'),
    'dbpass' => DB_PASSWORD,

    // Authorization config
    'key_issuer'             => getenv('AUTH_ISSUER'),
    'auth_public'            => base64_decode(getenv('AUTH_PUBLIC')),
    'auth_private'           => base64_decode(getenv('AUTH_PRIVATE')),
    'token_lifetime'         => 1800, // In seconds
    'refresh_token_lifetime' => 18000,// In seconds
    'max_refresh_tokens'     => 1,
    'algorithm'              => 'RS256',
    'user_roles'             => array('admin','player','official')
);