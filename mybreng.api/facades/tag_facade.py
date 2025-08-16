import uuid
from database import TagTable, db, StudentTagTable, QuizTagTable
from dtos import TagDto, TagEditDto
from mappers import map_tag_to_dto


# noinspection PyMethodMayBeStatic
class TagFacade:
    def get_tags(self, owner_id: str) -> list[TagDto]:
        tags = db.session \
            .query(TagTable) \
            .where(TagTable.owner_id == owner_id) \
            .all()
        return [map_tag_to_dto(t) for t in tags]

    def create_tag(self, owner_id: str, dto: TagEditDto) -> TagDto:
        tag = TagTable()
        tag.id = uuid.uuid4()
        TagFacade._map_edit_dto_to_entity(tag, owner_id, dto)
        db.session.add(tag)
        db.session.commit()
        return map_tag_to_dto(tag)

    @staticmethod
    def _map_edit_dto_to_entity(tag: TagTable, owner_id: str, dto: TagEditDto):
        tag.name = dto.name
        tag.owner_id = owner_id
        tag.color = dto.color
        tag.is_applicable_for_quizzes = \
            False if dto.is_applicable_for_quizzes is None \
                else dto.is_applicable_for_quizzes
        tag.is_applicable_for_students = \
            False if dto.is_applicable_for_students is None \
                else dto.is_applicable_for_students

    def edit_tag(self, owner_id: str, dto: TagEditDto) -> TagDto | None:
        tag = self._get_tag_by_id(owner_id, dto.id)
        if tag is None:
            return None
        if tag.is_applicable_for_quizzes and not dto.is_applicable_for_quizzes:
            QuizTagTable.query.filter_by(tag_id=tag.id).delete()
        if tag.is_applicable_for_students and not dto.is_applicable_for_students:
            StudentTagTable.query.filter_by(tag_id=tag.id).delete()
        TagFacade._map_edit_dto_to_entity(tag, owner_id, dto)
        db.session.commit()
        return map_tag_to_dto(tag)
    
    def _get_tag_by_id(self, owner_id: str, tag_id: str | None) -> TagTable | None:
        return None if tag_id is None else db.session \
            .query(TagTable) \
            .where(TagTable.id == tag_id and TagTable.owner_id == owner_id) \
            .first()

    def delete_tag(self, owner_id: str, tag_id: str) -> bool:
        tag = self._get_tag_by_id(owner_id, tag_id)
        if tag is None:
            return False
        db.session.query(StudentTagTable).where(StudentTagTable.tag_id == tag_id).delete()
        db.session.query(QuizTagTable).where(QuizTagTable.tag_id == tag_id).delete()
        db.session.delete(tag)
        db.session.commit()
        return True
