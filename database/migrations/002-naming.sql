-- User

RENAME TABLE `User` TO `user`;
ALTER TABLE `user` RENAME COLUMN `Id` TO `id`;
ALTER TABLE `user` RENAME COLUMN `Email` TO `email`;
ALTER TABLE `user` RENAME COLUMN `PasswordHash` TO `password_hash`;
ALTER TABLE `user` RENAME COLUMN `PasswordSalt` TO `password_salt`;

-- Student

RENAME TABLE `Student` TO `student`;
ALTER TABLE `student` RENAME COLUMN `Id` TO `id`;
ALTER TABLE `student` RENAME COLUMN `FirstName` TO `first_name`;
ALTER TABLE `student` RENAME COLUMN `LastName` TO `last_name`;
ALTER TABLE `student` RENAME COLUMN `Owner` TO `owner`;
ALTER TABLE `student` RENAME COLUMN `Note` TO `note`;
ALTER TABLE `student` RENAME INDEX `iOwner_Student` TO `idx_student_owner`;
ALTER TABLE `student` DROP FOREIGN KEY `FK_Student_Owner`;
ALTER TABLE `student` ADD CONSTRAINT `fk_student_owner` FOREIGN KEY (`owner`) REFERENCES `user` (`id`);

-- Quiz

RENAME TABLE `Quiz` TO `quiz`;
ALTER TABLE `quiz` RENAME COLUMN `Id` TO `id`;
ALTER TABLE `quiz` RENAME COLUMN `Title` TO `title`;
ALTER TABLE `quiz` RENAME COLUMN `Description` TO `description`;
ALTER TABLE `quiz` RENAME COLUMN `Owner` TO `owner`;
ALTER TABLE `quiz` RENAME INDEX `iOwner_Quiz` TO `idx_quiz_owner`;
ALTER TABLE `quiz` DROP FOREIGN KEY `FK_Quiz_Owner`;
ALTER TABLE `quiz` ADD CONSTRAINT `fk_quiz_owner` FOREIGN KEY (`owner`) REFERENCES `user` (`id`);

-- QuizQuestion

RENAME TABLE `QuizQuestion` TO `quiz_question`;
ALTER TABLE `quiz_question` RENAME COLUMN `Id` TO `id`;
ALTER TABLE `quiz_question` RENAME COLUMN `Text` TO `text`;
ALTER TABLE `quiz_question` RENAME COLUMN `Quiz` TO `quiz`;
ALTER TABLE `quiz_question` RENAME COLUMN `Type` TO `type`;
ALTER TABLE `quiz_question` RENAME COLUMN `OrdinalNumber` TO `ordinal_number`;
ALTER TABLE `quiz_question` RENAME INDEX `iQuiz_QuizQuestion` TO `idx_quiz_question_quiz`;
ALTER TABLE `quiz_question` DROP FOREIGN KEY `FK_QuizQuestion_Quiz`;
ALTER TABLE `quiz_question` ADD CONSTRAINT `fk_quiz_question_quiz` FOREIGN KEY (`quiz`) REFERENCES `quiz` (`id`);

-- QuizAnswerVariant

RENAME TABLE `QuizAnswerVariant` TO `quiz_answer_variant`;
ALTER TABLE `quiz_answer_variant` RENAME COLUMN `Id` TO `id`;
ALTER TABLE `quiz_answer_variant` RENAME COLUMN `Question` TO `question`;
ALTER TABLE `quiz_answer_variant` RENAME COLUMN `Text` TO `text`;
ALTER TABLE `quiz_answer_variant` ADD COLUMN `is_correct` tinyint(1) DEFAULT 0;
UPDATE `quiz_answer_variant` SET `is_correct` = (`IsRight` = 1);
ALTER TABLE `quiz_answer_variant` DROP COLUMN `IsRight`;
ALTER TABLE `quiz_answer_variant` RENAME INDEX `iQuestion_QuizAnswerVariant` TO `idx_quiz_question_variant_question`;
ALTER TABLE `quiz_answer_variant` DROP FOREIGN KEY `FK_QuizAnswerVariant_Question`;
ALTER TABLE `quiz_answer_variant` ADD CONSTRAINT `fk_quiz_question_variant_quiz` FOREIGN KEY (`question`) REFERENCES `quiz_question` (`id`);

-- Run

RENAME TABLE `Run` TO `run`;
ALTER TABLE `run` RENAME COLUMN `Id` TO `id`;
ALTER TABLE `run` RENAME COLUMN `Student` TO `student`;
ALTER TABLE `run` RENAME COLUMN `Quiz` TO `quiz`;
ALTER TABLE `run` RENAME COLUMN `CreationDate` TO `creation_date`;
ALTER TABLE `run` RENAME COLUMN `StartDate` TO `start_date`;
ALTER TABLE `run` RENAME COLUMN `FinishDate` TO `finish_date`;
ALTER TABLE `run` RENAME INDEX `iQuiz_Run` TO `idx-run_quiz`;
ALTER TABLE `run` RENAME INDEX `iStudent_Run` TO `idx_run_student`;
ALTER TABLE `run` DROP FOREIGN KEY `FK_Run_Quiz`;
ALTER TABLE `run` ADD CONSTRAINT `fk_run_quiz` FOREIGN KEY (`quiz`) REFERENCES `quiz` (`id`);
ALTER TABLE `run` DROP FOREIGN KEY `FK_Run_Student`;
ALTER TABLE `run` ADD CONSTRAINT `fk_run_student` FOREIGN KEY (`student`) REFERENCES `student` (`id`);

-- RunAnswer

RENAME TABLE `RunAnswer` TO `run_answer`;
ALTER TABLE `run_answer` RENAME COLUMN `Id` TO `id`;
ALTER TABLE `run_answer` RENAME COLUMN `Run` TO `run`;
ALTER TABLE `run_answer` RENAME COLUMN `Question` TO `question`;
ALTER TABLE `run_answer` RENAME COLUMN `Variant` TO `variant`;
ALTER TABLE `run_answer` RENAME COLUMN `Text` TO `text`;
ALTER TABLE `run_answer` RENAME INDEX `iRun_RunAnswer` TO `idx_run_answer_run`;
ALTER TABLE `run_answer` RENAME INDEX `iQuestion_RunAnswer` TO `idx_run_answer_question`;
ALTER TABLE `run_answer` RENAME INDEX `iVariant_RunAnswer` TO `idx_run_answer_variant`;
ALTER TABLE `run_answer` DROP FOREIGN KEY `FK_RunAnswer_Question`;
ALTER TABLE `run_answer` ADD CONSTRAINT `fk_run_answer_question` FOREIGN KEY (`question`) REFERENCES `quiz_question` (`id`);
ALTER TABLE `run_answer` DROP FOREIGN KEY `FK_RunAnswer_Run`;
ALTER TABLE `run_answer` ADD CONSTRAINT `fk_run_answer_run` FOREIGN KEY (`run`) REFERENCES `run` (`id`);
ALTER TABLE `run_answer` DROP FOREIGN KEY `FK_RunAnswer_Variant`;
ALTER TABLE `run_answer` ADD CONSTRAINT `fk_run_answer_variant` FOREIGN KEY (`variant`) REFERENCES `quiz_answer_variant` (`id`);


