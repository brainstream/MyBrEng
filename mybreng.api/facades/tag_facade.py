import uuid
from database import TagTable, db, StudentTagTable, QuizTagTable
from dtos import TagDto, TagEditDto
from mappers import map_tag_to_dto


# noinspection PyMethodMayBeStatic
class TagFacade:
    def get_tags(self, owner_id: str) -> list[TagDto]:
        tags = TagTable.query.filter_by(owner_id=owner_id).all()
        return [map_tag_to_dto(t) for t in tags]

    def create_tag(self, owner_id: str, dto: TagEditDto) -> TagDto:
        tag = TagTable()
        tag.id = uuid.uuid4()
        tag.name = dto.name
        tag.owner_id = owner_id
        db.session.add(tag)
        db.session.commit()
        return map_tag_to_dto(tag)

    def edit_tag(self, owner_id: str, dto: TagEditDto) -> TagDto | None:
        tag = TagTable.query.filter_by(id=dto.id, owner_id=owner_id).first()
        if tag is None:
            return None
        tag.name = dto.name
        db.session.commit()
        return map_tag_to_dto(tag)

    def delete_tag(self, owner_id: str, tag_id: str) -> bool:
        tag = TagTable.query.filter_by(id=tag_id, owner_id=owner_id).first()
        if tag is None:
            return False
        StudentTagTable.query.filter_by(tag_id=tag.id).delete()
        QuizTagTable.query.filter_by(tag_id=tag.id).delete()
        db.session.delete(tag)
        db.session.commit()
        return True
