import uuid
from database import db, QuizTable, RunTable, TagTable, QuizTagTable
from dtos import QuizDto, QuizEditDto, QuizDetailedDto
from mappers import map_quiz_to_detailed_dto, map_quiz_to_dto


# noinspection PyMethodMayBeStatic
class QuizFacade:
    def get_quizzes(self, user_id: str) -> list[QuizDto]:
        return [map_quiz_to_dto(quiz) for quiz in
                QuizTable.query.filter_by(owner_id=user_id).order_by(QuizTable.title).all()]

    def get_quiz(self, owner_id: str, quiz_id: str) -> QuizDetailedDto | None:
        quiz = QuizTable.query.filter_by(id=quiz_id, owner_id=owner_id).first()
        return None if quiz is None else map_quiz_to_detailed_dto(quiz)

    def edit_quiz(self, owner_id: str, dto: QuizEditDto) -> QuizDto | None:
        quiz = QuizTable.query.filter_by(id=dto.id, owner_id=owner_id).first()
        if quiz is None:
            return None
        quiz.title = dto.title
        quiz.description = dto.description
        tag_ids = [] if dto.tags is None else [t.id for t in self.__get_tags(owner_id, dto.tags)]
        for tag in quiz.tags:
            if not tag.tag_id in tag_ids:
                db.session.delete(tag)
        for tag_id in tag_ids:
            if not any(t.tag_id == tag_id for t in quiz.tags):
                rel = QuizTagTable()
                rel.student_id = quiz.id
                rel.tag_id = tag_id
                quiz.tags.append(rel)
                db.session.add(rel)
        db.session.commit()
        return map_quiz_to_dto(quiz)

    def __get_tags(self, owner_id: str, ids: list[str]):
        return TagTable.query \
            .where(
                TagTable.owner_id == owner_id,
                TagTable.is_applicable_for_quizzes,
                TagTable.id.in_(ids)
            ) \
            .all()

    def create_quiz(self, owner_id: str, dto: QuizEditDto) -> QuizDto:
        quiz = QuizTable()
        quiz.id = str(uuid.uuid4())
        quiz.title = dto.title
        quiz.description = dto.description
        quiz.owner_id = owner_id
        db.session.add(quiz)
        if dto.tags is not None and len(dto.tags) > 0:
            tags = self.__get_tags(owner_id, dto.tags)
            for tag in tags:
                rel = QuizTagTable()
                rel.student_id = quiz.id
                rel.tag_id = tag.id
                quiz.tags.append(rel)
                db.session.add(rel)
        db.session.commit()
        return map_quiz_to_dto(quiz)

    def delete_quiz(self, owner_id: str, quiz_id: str) -> bool:
        quiz = QuizTable.query.filter_by(id=quiz_id, owner_id=owner_id).first()
        if quiz is None:
            return False
        RunTable.query.filter_by(quiz_id=quiz.id).delete()
        db.session.delete(quiz)
        db.session.commit()
        return True
