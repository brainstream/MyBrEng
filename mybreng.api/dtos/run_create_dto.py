from dataclasses import dataclass
from marshmallow import Schema, post_load
from dtos import ID


@dataclass
class RunCreateDto:
    student_id: str
    quiz_id: str


class RunCreateDtoSchema(Schema):
    student_id = ID(data_key='studentId', required=True)
    quiz_id = ID(data_key='quizId', required=True)

    @post_load
    def make_dto(self, data, **kwargs):
        return RunCreateDto(**data)
