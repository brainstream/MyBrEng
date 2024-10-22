import json
from flask import Flask, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from flask_login import LoginManager
from apispec import APISpec
from apispec_webframeworks.flask import FlaskPlugin
from apispec.ext.marshmallow import MarshmallowPlugin
from blueprints import \
    account_blueprint, \
    account_login, \
    account_logout, \
    quiz_blueprint, \
    quiz_list, \
    quiz_details, \
    quiz_save, \
    quiz_delete, \
    quiz_question_save, \
    quiz_question_clone, \
    quiz_question_delete, \
    quiz_reorder_questions, \
    student_blueprint, \
    student_list, \
    student_details, \
    student_save, \
    student_delete, \
    student_set_note, \
    run_get, \
    run_blueprint, \
    run_create, \
    run_delete, \
    run_finish
from dtos import \
    QuizDtoSchema, \
    QuizQuestionDtoSchema, \
    QuizDetailedDtoSchema, \
    UserDtoSchema, \
    LogInDtoSchema, \
    QuizEditDtoSchema, \
    QuizQuestionEditDtoSchema, \
    QuizQuestionPositionDtoSchema, \
    StudentDtoSchema, \
    StudentDetailedDtoSchema, \
    StudentEditDtoSchema, \
    StudentNoteEditDtoSchema, \
    RunSummaryDtoSchema, \
    RunCreateDtoSchema, \
    RunQuestionDtoSchema, \
    RunDtoSchema, \
    RunAnswerDtoSchema, \
    RunAnswerVariantDtoSchema, \
    RunFinishDtoSchema, \
    RunFinishQuestionDtoSchema, \
    RunReportAnswerDtoSchema
from di import DI
from database import db


def create_app() -> Flask:
    spec = APISpec(
        title="MyBrEng API",
        version="1.0.0",
        openapi_version="3.0.2",
        tags=[
            "Account",
            "Quiz",
            "Student",
            "Run"
        ],
        servers=[
            dict(
                description="Development server",
                url="http://localhost:5000"
            )
        ],
        plugins=[
            FlaskPlugin(),
            MarshmallowPlugin()
        ],
    )

    spec.components \
        .schema('UserDto', schema=UserDtoSchema) \
        .schema('LogInDto', schema=LogInDtoSchema) \
        .schema('QuizDto', schema=QuizDtoSchema) \
        .schema('QuizQuestionDto', schema=QuizQuestionDtoSchema) \
        .schema('QuizDetailedDto', schema=QuizDetailedDtoSchema) \
        .schema('QuizEditDto', schema=QuizEditDtoSchema) \
        .schema('QuizQuestionEditDto', schema=QuizQuestionEditDtoSchema) \
        .schema('QuizQuestionPositionDto', schema=QuizQuestionPositionDtoSchema) \
        .schema('RunSummaryDto', schema=RunSummaryDtoSchema) \
        .schema('RunCreateDto', schema=RunCreateDtoSchema) \
        .schema('RunReportAnswerDto', schema=RunReportAnswerDtoSchema) \
        .schema('RunAnswerVariantDto', schema=RunAnswerVariantDtoSchema) \
        .schema('RunAnswerDto', schema=RunAnswerDtoSchema) \
        .schema('RunQuestionDto', schema=RunQuestionDtoSchema) \
        .schema('RunDto', schema=RunDtoSchema) \
        .schema('StudentDto', schema=StudentDtoSchema) \
        .schema('StudentDetailedDto', schema=StudentDetailedDtoSchema) \
        .schema('StudentEditDto', schema=StudentEditDtoSchema) \
        .schema('StudentNoteEditDto', schema=StudentNoteEditDtoSchema) \
        .schema('RunFinishQuestionDto', schema=RunFinishQuestionDtoSchema) \
        .schema('RunFinishDto', schema=RunFinishDtoSchema)

    di = DI()
    flask = Flask(__name__)
    flask.config.from_file('configuration.json', load=json.load)
    flask.register_blueprint(account_blueprint, url_prefix='/api/account')
    flask.register_blueprint(quiz_blueprint, url_prefix='/api/quiz')
    flask.register_blueprint(student_blueprint, url_prefix='/api/student')
    flask.register_blueprint(run_blueprint, url_prefix='/api/run')
    di.init_resources()
    db.init_app(flask)
    login_manager = LoginManager()
    login_manager.init_app(flask)

    with flask.test_request_context():
        spec.path(view=account_login)
        spec.path(view=account_logout)
        spec.path(view=quiz_list)
        spec.path(view=quiz_details)
        spec.path(view=quiz_save)
        spec.path(view=quiz_delete)
        spec.path(view=quiz_question_save)
        spec.path(view=quiz_question_clone)
        spec.path(view=quiz_question_delete)
        spec.path(view=quiz_reorder_questions)
        spec.path(view=student_list)
        spec.path(view=student_details)
        spec.path(view=student_save)
        spec.path(view=student_set_note)
        spec.path(view=student_delete)
        spec.path(view=run_get)
        spec.path(view=run_create)
        spec.path(view=run_delete)
        spec.path(view=run_finish)
    with open('./static/swagger.json', 'w') as f:
        json.dump(spec.to_dict(), f)

    flask.register_blueprint(get_swaggerui_blueprint(
        '/swagger',
        '/static/swagger.json',
        config={
            'app_name': "MyBrEng API"
        }
    ))

    @login_manager.user_loader
    def load_user(user_id):
        user_facade = di.user_facade()
        return user_facade.get_user_by_id(user_id)

    @flask.errorhandler(401)
    def resource_not_found(_):
        return jsonify(error='401 Unauthorized'), 401

    CORS(flask, resources={r'/api/*': {
        'origins': flask.config['CORS'],
        'supports_credentials': True
    }})

    return flask


app = application = create_app()

if __name__ == '__main__':
    # import logging
    # logging.basicConfig()
    # logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
    app.run()
