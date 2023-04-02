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
    questions = db.relationship("QuizQuestionTable", backref=db.backref('QuizQuestion', uselist=False))

    def __repr__(self):
        return f'<Quiz: {self.title}>'


class QuizQuestionTable(db.Model):
    __tablename__ = 'QuizQuestion'
    id = db.Column('Id', db.String(38), primary_key=True)
    text = db.Column('Text', db.String)
    type = db.Column('Type', db.Integer)
    ordinal_number = db.Column('OrdinalNumber', db.Integer)
    quiz_id = db.Column('Quiz', db.ForeignKey('Quiz.Id'))

    def __repr__(self):
        return f'<Quiz Question: {self.description[:20]}>'
