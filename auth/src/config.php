<?php


return array(
    'dbhost' => getenv('DB_HOST'),
    'dbport' => '',
    'dbname' => getenv('DB_NAME'),
    'dbuser' => getenv('DB_USERNAME'),
    'dbpass' => getenv('DB_PASSWORD'),

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