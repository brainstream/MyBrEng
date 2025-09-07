from enum import Enum


class QuizQuestionType(str, Enum):
    SINGLE_CHOICE: str = 'SINGLE_CHOICE'
    MULTIPLE_CHOICE: str = 'MULTIPLE_CHOICE'
    FREE_TEXT: str = 'FREE_TEXT'
    MATCH: str = 'MATCH'
