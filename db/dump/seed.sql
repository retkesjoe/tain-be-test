DROP DATABASE IF EXISTS tain;

CREATE DATABASE tain CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE tain.game_presenter (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR (255) NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tain.game_presenter (name)
VALUES ("Miguel Suarez");

CREATE TABLE tain.schedule (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  date DATE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tain.game_presenter_schedule (
  game_presenter_id INT NOT NULL,
  schedule_id INT NOT NULL,
  time TIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_presenter_id) REFERENCES tain.game_presenter (id),
  FOREIGN KEY (schedule_id) REFERENCES tain.schedule (id)
);