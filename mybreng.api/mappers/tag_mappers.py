from database import TagTable
from dtos import TagDto


def map_tag_to_dto(tag: TagTable) -> TagDto:
    return TagDto(
        tag.id,
        tag.name,
        tag.color,
        tag.is_applicable_for_students,
        tag.is_applicable_for_quizzes
    )
