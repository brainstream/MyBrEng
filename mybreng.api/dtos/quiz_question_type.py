from enum import Enum


class QuizQuestionType(str, Enum):
    SINGLE_CHOICE = 'SINGLE_CHOICE'
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
    FREE_TEXT = 'FREE_TEXT'
    MATCH = 'MATCH'
