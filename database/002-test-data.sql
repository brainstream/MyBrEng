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
	'0ef43d9d-7a81-4d4d-bf16-a7d0aeade076',
	'Synonyms Quiz',
	'Choose words from the list and match them with words that have similar meanings (synonyms).',
	'5b96d797-3ed1-11ee-8891-c5d1c875f25d'
);

INSERT INTO `quiz_question` (`id`, `quiz`, `type`, `text`, `ordinal_number`)
VALUES (
    'c6ca0754-aa44-474d-b183-474f6a3e0d9a',
    '0ef43d9d-7a81-4d4d-bf16-a7d0aeade076',
    0,
    'Find a synonym for the word "Malice"',
    0
), (
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '0ef43d9d-7a81-4d4d-bf16-a7d0aeade076',
    3,
    'Match synonyms',
    1
), (
    'ce8d02f8-e9cb-4b16-ba63-48e66447fd85',
    '0ef43d9d-7a81-4d4d-bf16-a7d0aeade076',
    1,
    'Select all synonyms for the word "Competence"',
    2
), (
    '84be8e31-9c53-411e-bacb-be50d6a0785d',
    '0ef43d9d-7a81-4d4d-bf16-a7d0aeade076',
    2,
    'Enter synonym for the word "Get"',
    3
);

INSERT INTO `quiz_answer_variant` (`id`, `question`, `text`, `is_correct`)
VALUES (
    UUID(),
    'c6ca0754-aa44-474d-b183-474f6a3e0d9a',
    'Bitterness',
    1
), (
    UUID(),
    'c6ca0754-aa44-474d-b183-474f6a3e0d9a',
    'Sincere',
    0
), (
    UUID(),
    'c6ca0754-aa44-474d-b183-474f6a3e0d9a',
    'Delicate',
    0
), (
    UUID(),
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '{ "slot": "Abundant", "answer": "Plentiful" }', -- TODO: varchar(150)
    1
), (
    UUID(),
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '{ "slot": "Delicate", "answer": "Sensitive" }', -- TODO: varchar(150)
    1
), (
    UUID(),
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '{ "slot": "Eager", "answer": "Keen" }', -- TODO: varchar(150)
    1
), (
    UUID(),
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '{ "slot": "Generous", "answer": "Charitable" }', -- TODO: varchar(150)
    1
), (
    UUID(),
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '{ "slot": "Reliable", "answer": "Dependable" }', -- TODO: varchar(150)
    1
), (
    UUID(),
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '{ "slot": null, "answer": "Perfect" }', -- TODO: varchar(150)
    0
), (
    UUID(),
    '0d146c43-c51e-46a4-8f8c-d32657971afb',
    '{ "slot": null, "answer": "Bitterness" }', -- TODO: varchar(150)
    0
), (
    UUID(),
    'ce8d02f8-e9cb-4b16-ba63-48e66447fd85',
    'Skill',
    1
), (
    UUID(),
    'ce8d02f8-e9cb-4b16-ba63-48e66447fd85',
    'Ability',
    1
), (
    UUID(),
    'ce8d02f8-e9cb-4b16-ba63-48e66447fd85',
    'Collaboration',
    0
), (
    UUID(),
    'ce8d02f8-e9cb-4b16-ba63-48e66447fd85',
    'Capability',
    1
), (
    UUID(),
    'ce8d02f8-e9cb-4b16-ba63-48e66447fd85',
    'Motivate',
    0
), (
    UUID(),
    'ce8d02f8-e9cb-4b16-ba63-48e66447fd85',
    'Proficiency',
    1
), (
    UUID(),
    '84be8e31-9c53-411e-bacb-be50d6a0785d',
    'Acquire',
    1
), (
    UUID(),
    '84be8e31-9c53-411e-bacb-be50d6a0785d',
    'Obtain',
    1
), (
    UUID(),
    '84be8e31-9c53-411e-bacb-be50d6a0785d',
    'Secure',
    1
), (
    UUID(),
    '84be8e31-9c53-411e-bacb-be50d6a0785d',
    'Procure',
    1
);

INSERT INTO `student` (`id`, `first_name`, `last_name`, `owner`)
VALUES (
    'ee7eb7d0-6fe3-11f0-a918-76279bc8674e',
    'Holden',
    'Caulfield',
    '5b96d797-3ed1-11ee-8891-c5d1c875f25d'
);

INSERT INTO `run` (`id`, `student`, `quiz`, `creation_date`)
VALUES (
    UUID(),
    'ee7eb7d0-6fe3-11f0-a918-76279bc8674e',
    '0ef43d9d-7a81-4d4d-bf16-a7d0aeade076',
    NOW()
);

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
);

INSERT INTO `student_tag` (`student`, `tag`)
VALUES (
    'ee7eb7d0-6fe3-11f0-a918-76279bc8674e', 
    '89649a9c-6fe4-11f0-a918-76279bc8674e'
), (
    'ee7eb7d0-6fe3-11f0-a918-76279bc8674e',
    '89649cf1-6fe4-11f0-a918-76279bc8674e'
);
