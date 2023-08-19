-- CREATE DATABASE `mybreng`
-- USE `mybreng`

CREATE TABLE `user` (
  `id` char(38) NOT NULL,
  `email` varchar(250) DEFAULT NULL,
  `password_hash` varchar(128) DEFAULT NULL,
  `password_salt` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `student` (
  `id` char(38) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `owner` char(38) DEFAULT NULL,
  `note` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_student_owner` (`owner`),
  CONSTRAINT `fk_student_owner` FOREIGN KEY (`owner`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `quiz` (
  `id` char(38) NOT NULL,
  `title` varchar(250) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `owner` char(38) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_owner` (`owner`),
  CONSTRAINT `fk_quiz_owner` FOREIGN KEY (`owner`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `quiz_question` (
  `id` char(38) NOT NULL,
  `text` longtext DEFAULT NULL,
  `quiz` char(38) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `ordinal_number` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_question_quiz` (`quiz`),
  CONSTRAINT `fk_quiz_question_quiz` FOREIGN KEY (`quiz`) REFERENCES `quiz` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `quiz_answer_variant` (
  `id` char(38) NOT NULL,
  `question` char(38) DEFAULT NULL,
  `text` varchar(150) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_question_variant_question` (`question`),
  CONSTRAINT `fk_quiz_question_variant_quiz` FOREIGN KEY (`question`) REFERENCES `quiz_question` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `run` (
  `id` char(38) NOT NULL,
  `student` char(38) DEFAULT NULL,
  `quiz` char(38) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `finish_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_run_student` (`student`),
  KEY `idx-run_quiz` (`quiz`),
  CONSTRAINT `fk_run_quiz` FOREIGN KEY (`quiz`) REFERENCES `quiz` (`id`),
  CONSTRAINT `fk_run_student` FOREIGN KEY (`student`) REFERENCES `student` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `run_answer` (
  `id` char(38) NOT NULL,
  `run` char(38) DEFAULT NULL,
  `question` char(38) DEFAULT NULL,
  `variant` char(38) DEFAULT NULL,
  `text` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_run_answer_run` (`run`),
  KEY `idx_run_answer_question` (`question`),
  KEY `idx_run_answer_variant` (`variant`),
  CONSTRAINT `fk_run_answer_question` FOREIGN KEY (`question`) REFERENCES `quiz_question` (`id`),
  CONSTRAINT `fk_run_answer_run` FOREIGN KEY (`run`) REFERENCES `run` (`id`),
  CONSTRAINT `fk_run_answer_variant` FOREIGN KEY (`variant`) REFERENCES `quiz_answer_variant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
