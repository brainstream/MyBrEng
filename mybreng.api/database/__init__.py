from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class UserTable(db.Model):
    __tablename__ = 'User'
    id = db.Column('Id', db.String(38), primary_key=True)
    email = db.Column('Email', db.String(250))
    password_hash = db.Column('PasswordHash', db.String(128))
    password_salt = db.Column('PasswordSalt', db.String(32))

    def __repr__(self):
        return f'<User: {self.email}>'


class QuizTable(db.Model):
    __tablename__ = 'Quiz'
    id = db.Column('Id', db.String(38), primary_key=True)
    title = db.Column('Title', db.String(250))
    description = db.Column('Description', db.String)
    owner_id = db.Column('Owner', db.ForeignKey('User.Id'))
    owner = db.relationship('UserTable', backref=db.backref('User', uselist=False))
    questions = db.relationship('QuizQuestionTable', back_populates='quiz', order_by="QuizQuestionTable.ordinal_number")

    def __repr__(self):
        return f'<Quiz: {self.title}>'


class QuizQuestionTable(db.Model):
    __tablename__ = 'QuizQuestion'
    id = db.Column('Id', db.String(38), primary_key=True)
    text = db.Column('Text', db.String)
    type = db.Column('Type', db.Integer)
    ordinal_number = db.Column('OrdinalNumber', db.Integer)
    quiz_id = db.Column('Quiz', db.ForeignKey('Quiz.Id'))
    quiz = db.relationship('QuizTable', back_populates='questions')
    answers = db.relationship('QuizAnswerVariantTable', backref=db.backref('QuizAnswerVariant', uselist=True))

    def __repr__(self):
        return f'<Quiz Question: {self.text[:20]}>'


class QuizAnswerVariantTable(db.Model):
    __tablename__ = 'QuizAnswerVariant'
    id = db.Column('Id', db.String(38), primary_key=True)
    text = db.Column('Text', db.String(150))
    is_correct = db.Column('IsRight', db.Boolean)
    question_id = db.Column('Question', db.ForeignKey('QuizQuestion.Id'))

    def __repr__(self):
        return f'<Quiz Answer Variant: {self.text[:20]}>'


class StudentTable(db.Model):
    __tablename__ = 'Student'
    id = db.Column('Id', db.String(38), primary_key=True)
    first_name = db.Column('FirstName', db.String(100))
    last_name = db.Column('LastName', db.String(100))
    note = db.Column('note', db.String)
    owner_id = db.Column('Owner', db.ForeignKey('User.Id'))
    owner = db.relationship('UserTable')
    runs = db.relationship('RunTable', back_populates='student', order_by="desc(RunTable.creation_date)")

    def __repr__(self):
        return f'<Student: {self.first_name} {self.last_name}>'


class RunTable(db.Model):
    __tablename__ = 'Run'
    id = db.Column('Id', db.String(38), primary_key=True)
    creation_date = db.Column('CreationDate', db.Date())
    start_date = db.Column('StartDate', db.Date())
    finish_date = db.Column('FinishDate', db.Date())
    quiz_id = db.Column('Quiz', db.ForeignKey('Quiz.Id'))
    quiz = db.relationship('QuizTable')
    student_id = db.Column('Student', db.ForeignKey('Student.Id'))
    student = db.relationship('StudentTable')
    answers = db.relationship('RunAnswerTable', backref=db.backref('RunAnswer', uselist=True))

    def __repr__(self):
        return f'<Run: {self.id}>'


class RunAnswerTable(db.Model):
    __tablename__ = 'RunAnswer'
    id = db.Column('Id', db.String(38), primary_key=True)
    run_id = db.Column('Run', db.ForeignKey('Run.Id'))
    question_id = db.Column('Question', db.ForeignKey('QuizQuestion.Id'))
    answer_variant_id = db.Column('Variant', db.ForeignKey('QuizAnswerVariant.Id'))
    text = db.Column('Text', db.String(150))

    def __repr__(self):
        return f'<RunAnswer: {self.id}>'
