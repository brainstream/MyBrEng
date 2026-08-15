import json

from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin
from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from flask_swagger_ui import get_swaggerui_blueprint

from blueprints import (
    account_blueprint,
    account_login,
    account_logout,
    artifact_blueprint,
    artifact_content,
    artifact_delete,
    artifact_list,
    artifact_upload,
    quiz_blueprint,
    quiz_delete,
    quiz_details,
    quiz_list,
    quiz_question_clone,
    quiz_question_delete,
    quiz_question_save,
    quiz_reorder_questions,
    quiz_save,
    run_blueprint,
    run_create,
    run_delete,
    run_finish,
    run_get,
    student_blueprint,
    student_delete,
    student_details,
    student_list,
    student_save,
    student_set_note,
    tag_blueprint,
    tag_delete,
    tag_list,
    tag_save,
)
from database import db
from di import DI
from dtos import (
    ArtifactDtoSchema,
    ArtifactListDtoSchema,
    LogInDtoSchema,
    QuizDetailedDtoSchema,
    QuizDtoSchema,
    QuizEditDtoSchema,
    QuizQuestionDtoSchema,
    QuizQuestionEditDtoSchema,
    QuizQuestionPositionDtoSchema,
    RunAnswerDtoSchema,
    RunAnswerVariantDtoSchema,
    RunCreateDtoSchema,
    RunDtoSchema,
    RunFinishDtoSchema,
    RunFinishQuestionDtoSchema,
    RunQuestionDtoSchema,
    RunReportAnswerDtoSchema,
    RunSummaryDtoSchema,
    StudentDetailedDtoSchema,
    StudentDtoSchema,
    StudentEditDtoSchema,
    StudentNoteEditDtoSchema,
    TagDtoSchema,
    TagEditDtoSchema,
    UserDtoSchema,
)


def create_app() -> Flask:
    spec = APISpec(
        title="MyBrEng API",
        version="1.0.0",
        openapi_version="3.0.2",
        tags=[
            "Account",
            "Quiz",
            "Student",
            "Run",
            "Artifacts"
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
        .schema('TagDto', schema=TagDtoSchema) \
        .schema('TagEditDto', schema=TagEditDtoSchema) \
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
        .schema('RunFinishDto', schema=RunFinishDtoSchema) \
        .schema('ArtifactDto', schema=ArtifactDtoSchema) \
        .schema('ArtifactListDto', schema=ArtifactListDtoSchema)

    di = DI()
    flask = Flask(__name__)
    flask.config.from_file('configuration.json', load=json.load)
    flask.register_blueprint(account_blueprint, url_prefix='/api/account')
    flask.register_blueprint(quiz_blueprint, url_prefix='/api/quiz')
    flask.register_blueprint(student_blueprint, url_prefix='/api/student')
    flask.register_blueprint(run_blueprint, url_prefix='/api/run')
    flask.register_blueprint(tag_blueprint, url_prefix='/api/tag')
    flask.register_blueprint(artifact_blueprint, url_prefix='/api/artifact')
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
        spec.path(view=tag_list)
        spec.path(view=tag_save)
        spec.path(view=tag_delete)
        spec.path(view=artifact_upload)
        spec.path(view=artifact_content)
        spec.path(view=artifact_list)
        spec.path(view=artifact_delete)
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
