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
	uuid(),
	'Fun with the Alphabet!',
	'How well do you know your ABC in English? Play the game and see!',
	'5b96d797-3ed1-11ee-8891-c5d1c875f25d'
), (
	uuid(),
	'Animals Picture Quiz',
	'Can you name these animals?',
	'5b96d797-3ed1-11ee-8891-c5d1c875f25d'
), (
	uuid(),
	'Synonyms Quiz',
	'Choose words from the list and match them with words that have similar meanings (synonyms).',
	'5b96d797-3ed1-11ee-8891-c5d1c875f25d'
);

