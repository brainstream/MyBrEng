-- CREATE DATABASE `mybreng`
-- USE `mybreng`

CREATE TABLE `User` (
  `Id` char(38) NOT NULL,
  `Email` varchar(250) DEFAULT NULL,
  `PasswordHash` varchar(128) DEFAULT NULL,
  `PasswordSalt` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `Student` (
  `Id` char(38) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `Owner` char(38) DEFAULT NULL,
  `Note` longtext DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `iOwner_Student` (`Owner`),
  CONSTRAINT `FK_Student_Owner` FOREIGN KEY (`Owner`) REFERENCES `User` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `Quiz` (
  `Id` char(38) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Owner` char(38) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `iOwner_Quiz` (`Owner`),
  CONSTRAINT `FK_Quiz_Owner` FOREIGN KEY (`Owner`) REFERENCES `User` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `QuizTag` (
  `Id` char(38) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Owner` char(38) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `iOwner_QuizTag` (`Owner`),
  CONSTRAINT `FK_QuizTag_Owner` FOREIGN KEY (`Owner`) REFERENCES `User` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `QuizzesTags` (
  `Quizzes` char(38) DEFAULT NULL,
  `Tags` char(38) DEFAULT NULL,
  `OID` char(38) NOT NULL,
  `OptimisticLockField` int(11) DEFAULT NULL,
  PRIMARY KEY (`OID`),
  UNIQUE KEY `iQuizzesTags_QuizzesTags` (`Quizzes`,`Tags`),
  KEY `iQuizzes_QuizzesTags` (`Quizzes`),
  KEY `iTags_QuizzesTags` (`Tags`),
  CONSTRAINT `FK_QuizzesTags_Quizzes` FOREIGN KEY (`Quizzes`) REFERENCES `Quiz` (`Id`),
  CONSTRAINT `FK_QuizzesTags_Tags` FOREIGN KEY (`Tags`) REFERENCES `QuizTag` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `QuizQuestion` (
  `Id` char(38) NOT NULL,
  `Text` longtext DEFAULT NULL,
  `Quiz` char(38) DEFAULT NULL,
  `Type` int(11) DEFAULT NULL,
  `OrdinalNumber` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `iQuiz_QuizQuestion` (`Quiz`),
  CONSTRAINT `FK_QuizQuestion_Quiz` FOREIGN KEY (`Quiz`) REFERENCES `Quiz` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `QuizAnswerVariant` (
  `Id` char(38) NOT NULL,
  `Question` char(38) DEFAULT NULL,
  `Text` varchar(150) DEFAULT NULL,
  `IsRight` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `iQuestion_QuizAnswerVariant` (`Question`),
  CONSTRAINT `FK_QuizAnswerVariant_Question` FOREIGN KEY (`Question`) REFERENCES `QuizQuestion` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `Run` (
  `Id` char(38) NOT NULL,
  `Student` char(38) DEFAULT NULL,
  `Quiz` char(38) DEFAULT NULL,
  `CreationDate` datetime DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `FinishDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `iStudent_Run` (`Student`),
  KEY `iQuiz_Run` (`Quiz`),
  CONSTRAINT `FK_Run_Quiz` FOREIGN KEY (`Quiz`) REFERENCES `Quiz` (`Id`),
  CONSTRAINT `FK_Run_Student` FOREIGN KEY (`Student`) REFERENCES `Student` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `RunAnswer` (
  `Id` char(38) NOT NULL,
  `Run` char(38) DEFAULT NULL,
  `Question` char(38) DEFAULT NULL,
  `Variant` char(38) DEFAULT NULL,
  `Text` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `iRun_RunAnswer` (`Run`),
  KEY `iQuestion_RunAnswer` (`Question`),
  KEY `iVariant_RunAnswer` (`Variant`),
  CONSTRAINT `FK_RunAnswer_Question` FOREIGN KEY (`Question`) REFERENCES `QuizQuestion` (`Id`),
  CONSTRAINT `FK_RunAnswer_Run` FOREIGN KEY (`Run`) REFERENCES `Run` (`Id`),
  CONSTRAINT `FK_RunAnswer_Variant` FOREIGN KEY (`Variant`) REFERENCES `QuizAnswerVariant` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
