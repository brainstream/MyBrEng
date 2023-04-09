from marshmallow import Schema, fields


class LogInDtoSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
