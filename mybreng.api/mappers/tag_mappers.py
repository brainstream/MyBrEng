from database import TagTable
from dtos import TagDto, StudentDetailedDto


def map_tag_to_dto(tag: TagTable) -> TagDto:
    return TagDto(
        tag.id,
        tag.name,
        tag.color
    )
