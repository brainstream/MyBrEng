-- Email:    user@test.test
-- Password: 123456
INSERT INTO `user` (`id`, `email`, `password_hash`, `password_salt`) 
VALUES (
    '5b96d797-3ed1-11ee-8891-c5d1c875f25d', 
    'user@test.test',
    'w+V8Qlj2Cqoi6+UHC46wXU2CsQKBUjBJatOQWQhOrQtQniapzHp2gCI/LKTD677v2anUfTDgPelQlb8Oc5zdEA==',
    'theiZ9eo4goraaqu7ahw7aiFoh0Eefop'
);

INSERT INTO `quiz` (`id`, `title`, `description`, `owner`)
VALUES (
	UUID(),
	'Fun with the Alphabet!',
	'How well do you know your ABC in English? Play the game and see!',
	'5b96d797-3ed1-11ee-8891-c5d1c875f25d'
), (
	UUID(),
	'Animals Picture Quiz',
	'Can you name these animals?',
	'5b96d797-3ed1-11ee-8891-c5d1c875f25d'
), (
	UUID(),
	'Synonyms Quiz',
	'Choose words from the list and match them with words that have similar meanings (synonyms).',
	'5b96d797-3ed1-11ee-8891-c5d1c875f25d'
);

INSERT INTO `student` (`id`, `first_name`, `last_name`, `owner`)
VALUES (
    'ee7eb7d0-6fe3-11f0-a918-76279bc8674e',
    'Holden',
    'Caulfield',
    '5b96d797-3ed1-11ee-8891-c5d1c875f25d'
)

INSERT INTO `tag` (`id`, `name`, `color`, `owner`)
VALUES (
    '89649a9c-6fe4-11f0-a918-76279bc8674e',
    'Tag #1',
    16008191,
    '5b96d797-3ed1-11ee-8891-c5d1c875f25d'
), (
    '89649cf1-6fe4-11f0-a918-76279bc8674e',
    'Tag #2',
    5025791,
    '5b96d797-3ed1-11ee-8891-c5d1c875f25d'
)

INSERT INTO `student_tag` (`student`, `tag`)
VALUES 
('ee7eb7d0-6fe3-11f0-a918-76279bc8674e', '89649a9c-6fe4-11f0-a918-76279bc8674e'),
('ee7eb7d0-6fe3-11f0-a918-76279bc8674e', '89649cf1-6fe4-11f0-a918-76279bc8674e')
