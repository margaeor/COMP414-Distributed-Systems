CREATE TABLE `dbtest`.`games` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `player1` VARCHAR(32) NOT NULL , 
    `player2` VARCHAR(32) NOT NULL ,
    `score` INT,
    `game_type` ENUM('tournament','practice') NOT NULL , 
    `game_genre` VARCHAR(20) NOT NULL , 
    `date_created` DATETIME NOT NULL , 
    `date_modified` DATETIME NOT NULL , 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;