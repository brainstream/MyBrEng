from dataclasses import dataclass

from marshmallow import Schema, fields, post_load


@dataclass()
class StudentEditDto:
    id: str | None
    first_name: str
    last_name: str | None


class StudentEditDtoSchema(Schema):
    id = fields.UUID(required=False)
    first_name = fields.String(data_key='firstName', required=True)
    last_name = fields.String(data_key='lastName', required=False)

    @post_load
    def make_dto(self, data, **kwargs):
        args = data
        student_id = None
        if 'id' in data:
            student_id = str(args['id'])
            args = {**args}
            del args['id']
        return StudentEditDto(student_id, **args)
