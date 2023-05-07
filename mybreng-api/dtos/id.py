from marshmallow.fields import UUID


class ID(UUID):
    def _deserialize(self, value, attr, data, **kwargs) -> str | None:
        result = super()._deserialize(value, attr, data, **kwargs)
        return None if result is None else str(result)
