from datetime import datetime
from typing import override

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.mysql import MEDIUMBLOB
from sqlalchemy.orm import Mapped, backref, mapped_column, relationship

db = SQLAlchemy()


class UserTable(db.Model):
    __tablename__: str = 'user'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    email: Mapped[str] = mapped_column('email', String(250))
    password_hash: Mapped[str] = mapped_column('password_hash', String(128))
    password_salt: Mapped[str] = mapped_column('password_salt', String(32))

    @override
    def __repr__(self):
        return f'<User: {self.email}>'


class TagTable(db.Model):
    __tablename__: str = 'tag'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    name: Mapped[str] = mapped_column('name', String(150))
    owner_id: Mapped[str] = mapped_column('owner', ForeignKey('user.id'))
    owner: Mapped["UserTable"] = relationship('UserTable')
    color: Mapped[int | None] = mapped_column('color', Integer)
    is_applicable_for_students: Mapped[bool] = mapped_column('is_applicable_for_students', Boolean)
    is_applicable_for_quizzes: Mapped[bool] = mapped_column('is_applicable_for_quizzes', Boolean)

    @override
    def __repr__(self):
        return f'<Tag: {self.name}>'


class QuizTable(db.Model):
    __tablename__: str = 'quiz'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    title: Mapped[str] = mapped_column('title', String(250))
    description: Mapped[str | None] = mapped_column('description', String)
    owner_id: Mapped[str] = mapped_column('owner', ForeignKey('user.id'))
    owner: Mapped["UserTable"] = relationship('UserTable', backref=backref('user', uselist=False))
    questions: Mapped[list["QuizQuestionTable"]] = relationship(
        'QuizQuestionTable', back_populates='quiz', order_by="QuizQuestionTable.ordinal_number"
    )
    tags: Mapped[list["QuizTagTable"]] = relationship('QuizTagTable', back_populates='quiz')

    @override
    def __repr__(self):
        return f'<Quiz: {self.title}>'


class QuizTagTable(db.Model):
    __tablename__: str = 'quiz_tag'
    quiz_id: Mapped[str] = mapped_column('quiz', String(38), ForeignKey('quiz.id'), primary_key=True)
    quiz: Mapped["QuizTable"] = relationship('QuizTable')
    tag_id: Mapped[str] = mapped_column('tag', String(38), ForeignKey('tag.id'), primary_key=True)
    tag: Mapped["TagTable"] = relationship('TagTable')

    @override
    def __repr__(self):
        return f'<QuizTag: {self.quiz_id}_{self.tag_id}>'


class QuizQuestionTable(db.Model):
    __tablename__: str = 'quiz_question'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    text: Mapped[str] = mapped_column('text', String)
    type: Mapped[int] = mapped_column('type', Integer)
    ordinal_number: Mapped[int] = mapped_column('ordinal_number', Integer)
    quiz_id: Mapped[str] = mapped_column('quiz', ForeignKey('quiz.id'))
    quiz: Mapped["QuizTable"] = relationship('QuizTable', back_populates='questions')
    answers: Mapped[list["QuizAnswerVariantTable"]] = relationship(
        'QuizAnswerVariantTable', backref=backref('quiz_answer_variant', uselist=True)
    )
    word_answer: Mapped["QuizWordAnswerTable | None"] = relationship(
        'QuizWordAnswerTable',
        uselist=False,
        backref=backref('quiz_question', uselist=False),
        cascade='all, delete-orphan',
    )

    @override
    def __repr__(self):
        return f'<Quiz Question: {self.text[:20]}>'


class QuizAnswerVariantTable(db.Model):
    __tablename__: str = 'quiz_answer_variant'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    text: Mapped[str] = mapped_column('text', String(150))
    is_correct: Mapped[bool] = mapped_column('is_correct', Boolean)
    question_id: Mapped[str] = mapped_column('question', ForeignKey('quiz_question.id'))

    @override
    def __repr__(self):
        return f'<Quiz Answer Variant: {self.text[:20]}>'


class QuizWordAnswerTable(db.Model):
    __tablename__: str = 'quiz_word_answer'
    question_id: Mapped[str] = mapped_column(
        'question', String(38), ForeignKey('quiz_question.id'), primary_key=True
    )
    text: Mapped[str] = mapped_column('text', String(150))

    @override
    def __repr__(self):
        return f'<QuizWordAnswer: q={self.question_id} text={self.text}>'


class StudentTable(db.Model):
    __tablename__: str = 'student'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    first_name: Mapped[str] = mapped_column('first_name', String(100))
    last_name: Mapped[str | None] = mapped_column('last_name', String(100))
    note: Mapped[str] = mapped_column('note', String)
    owner_id: Mapped[str] = mapped_column('owner', ForeignKey('user.id'))
    owner: Mapped["UserTable"] = relationship('UserTable')
    runs: Mapped[list["RunTable"]] = relationship(
        'RunTable', back_populates='student', order_by="desc(RunTable.creation_date)"
    )
    tags: Mapped[list["StudentTagTable"]] = relationship('StudentTagTable', back_populates='student')

    @override
    def __repr__(self):
        return f'<Student: {self.first_name} {self.last_name}>'


class StudentTagTable(db.Model):
    __tablename__: str = 'student_tag'
    student_id: Mapped[str] = mapped_column('student', String(38), ForeignKey('student.id'), primary_key=True)
    student: Mapped["StudentTable"] = relationship('StudentTable')
    tag_id: Mapped[str] = mapped_column('tag', String(38), ForeignKey('tag.id'), primary_key=True)
    tag: Mapped["TagTable"] = relationship('TagTable')

    @override
    def __repr__(self):
        return f'<StudentTag: {self.student_id}_{self.tag_id}>'


class RunTable(db.Model):
    __tablename__: str = 'run'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    creation_date: Mapped[datetime] = mapped_column('creation_date', DateTime())
    start_date: Mapped[datetime | None] = mapped_column('start_date', DateTime())
    finish_date: Mapped[datetime | None] = mapped_column('finish_date', DateTime())
    quiz_id: Mapped[str] = mapped_column('quiz', ForeignKey('quiz.id'))
    quiz: Mapped["QuizTable"] = relationship('QuizTable')
    student_id: Mapped[str] = mapped_column('student', ForeignKey('student.id'))
    student: Mapped["StudentTable"] = relationship('StudentTable')
    answers: Mapped[list["RunAnswerTable"]] = relationship(
        'RunAnswerTable', backref=backref('run_answer', uselist=True)
    )

    @override
    def __repr__(self):
        return f'<Run: {self.id}>'


class RunAnswerTable(db.Model):
    __tablename__: str = 'run_answer'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    run_id: Mapped[str] = mapped_column('run', ForeignKey('run.id'))
    question_id: Mapped[str] = mapped_column('question', ForeignKey('quiz_question.id'))
    answer_variant_id: Mapped[str | None] = mapped_column('variant', ForeignKey('quiz_answer_variant.id'))
    text: Mapped[str | None] = mapped_column('text', String(150))

    @override
    def __repr__(self):
        return f'<RunAnswer: {self.id}>'


class ArtifactTable(db.Model):
    __tablename__: str = 'artifact'
    id: Mapped[str] = mapped_column('id', String(38), primary_key=True)
    owner_id: Mapped[str] = mapped_column('owner', ForeignKey('user.id'))
    mime: Mapped[str] = mapped_column('mime', String(150))
    name: Mapped[str] = mapped_column('name', String(250))
    upload_date: Mapped[datetime] = mapped_column('upload_date', Date())
    content: Mapped[bytes] = mapped_column('content', MEDIUMBLOB(), deferred=True)

    @override
    def __repr__(self):
        return f'<Artifact: {self.id}>'
