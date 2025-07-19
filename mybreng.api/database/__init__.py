from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class UserTable(db.Model):
    __tablename__ = 'user'
    id = db.Column('id', db.String(38), primary_key=True)
    email = db.Column('email', db.String(250))
    password_hash = db.Column('password_hash', db.String(128))
    password_salt = db.Column('password_salt', db.String(32))

    def __repr__(self):
        return f'<User: {self.email}>'

class TagTable(db.Model):
    __tablename__ = 'tag'
    id = db.Column('id', db.String(38), primary_key=True)
    name = db.Column('name', db.String(150))
    owner_id = db.Column('owner', db.ForeignKey('user.id'))
    owner = db.relationship('UserTable')

    def __repr__(self):
        return f'<Tag: {self.name}>'

class QuizTable(db.Model):
    __tablename__ = 'quiz'
    id = db.Column('id', db.String(38), primary_key=True)
    title = db.Column('title', db.String(250))
    description = db.Column('description', db.String)
    owner_id = db.Column('owner', db.ForeignKey('user.id'))
    owner = db.relationship('UserTable', backref=db.backref('user', uselist=False))
    questions = db.relationship('QuizQuestionTable', back_populates='quiz', order_by="QuizQuestionTable.ordinal_number")

    def __repr__(self):
        return f'<Quiz: {self.title}>'

class QuizTagTable(db.Model):
    __tablename__ = 'quiz_tag'
    quiz_id = db.Column('quiz', db.String(38), db.ForeignKey('quiz.id'), primary_key=True)
    quiz = db.relationship('QuizTable')
    tag_id = db.Column('tag', db.String(38), db.ForeignKey('tag.id'), primary_key=True)
    tag = db.relationship('TagTable')

    def __repr__(self):
        return f'<QuizTag: {self.student_id}_{self.tag_id}>'

class QuizQuestionTable(db.Model):
    __tablename__ = 'quiz_question'
    id = db.Column('id', db.String(38), primary_key=True)
    text = db.Column('text', db.String)
    type = db.Column('type', db.Integer)
    ordinal_number = db.Column('ordinal_number', db.Integer)
    quiz_id = db.Column('quiz', db.ForeignKey('quiz.id'))
    quiz = db.relationship('QuizTable', back_populates='questions')
    answers = db.relationship('QuizAnswerVariantTable', backref=db.backref('quiz_answer_variant', uselist=True))

    def __repr__(self):
        return f'<Quiz Question: {self.text[:20]}>'

class QuizAnswerVariantTable(db.Model):
    __tablename__ = 'quiz_answer_variant'
    id = db.Column('id', db.String(38), primary_key=True)
    text = db.Column('text', db.String(150))
    is_correct = db.Column('is_correct', db.Boolean)
    question_id = db.Column('question', db.ForeignKey('quiz_question.id'))

    def __repr__(self):
        return f'<Quiz Answer Variant: {self.text[:20]}>'

class StudentTable(db.Model):
    __tablename__ = 'student'
    id = db.Column('id', db.String(38), primary_key=True)
    first_name = db.Column('first_name', db.String(100))
    last_name = db.Column('last_name', db.String(100))
    note = db.Column('note', db.String)
    owner_id = db.Column('owner', db.ForeignKey('user.id'))
    owner = db.relationship('UserTable')
    runs = db.relationship('RunTable', back_populates='student', order_by="desc(RunTable.creation_date)")

    def __repr__(self):
        return f'<Student: {self.first_name} {self.last_name}>'

class StudentTagTable(db.Model):
    __tablename__ = 'student_tag'
    student_id = db.Column('student', db.String(38), db.ForeignKey('student.id'), primary_key=True)
    student = db.relationship('StudentTable')
    tag_id = db.Column('tag', db.String(38), db.ForeignKey('tag.id'), primary_key=True)
    tag = db.relationship('TagTable')

    def __repr__(self):
        return f'<StudentTag: {self.student_id}_{self.tag_id}>'

class RunTable(db.Model):
    __tablename__ = 'run'
    id = db.Column('id', db.String(38), primary_key=True)
    creation_date = db.Column('creation_date', db.Date())
    start_date = db.Column('start_date', db.Date())
    finish_date = db.Column('finish_date', db.Date())
    quiz_id = db.Column('quiz', db.ForeignKey('quiz.id'))
    quiz = db.relationship('QuizTable')
    student_id = db.Column('student', db.ForeignKey('student.id'))
    student = db.relationship('StudentTable')
    answers = db.relationship('RunAnswerTable', backref=db.backref('run_answer', uselist=True))

    def __repr__(self):
        return f'<Run: {self.id}>'


class RunAnswerTable(db.Model):
    __tablename__ = 'run_answer'
    id = db.Column('id', db.String(38), primary_key=True)
    run_id = db.Column('run', db.ForeignKey('run.id'))
    question_id = db.Column('question', db.ForeignKey('quiz_question.id'))
    answer_variant_id = db.Column('variant', db.ForeignKey('quiz_answer_variant.id'))
    text = db.Column('text', db.String(150))

    def __repr__(self):
        return f'<RunAnswer: {self.id}>'
