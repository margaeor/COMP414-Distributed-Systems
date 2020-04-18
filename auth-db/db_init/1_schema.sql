CREATE TABLE IF NOT EXISTS `users` (
    `id` int(11) NOT NULL auto_increment,
    `username` varchar(32) NOT NULL UNIQUE,
    `password` varchar(64) NOT NULL ,
    `email` varchar(64) NOT NULL UNIQUE,
    `role` varchar(16) NOT NULL,
    `secret` varchar(40),
    `last_login` DATETIME,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `access_tokens` (
	`id` varchar(64) NOT NULL,
    `user_id` int(11) NOT NULL,
    `date_created` DATETIME NOT NULL,
    `valid_until` DATETIME,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;