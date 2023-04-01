import json
from flask import Flask, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from apispec import APISpec
from apispec_webframeworks.flask import FlaskPlugin
from apispec.ext.marshmallow import MarshmallowPlugin
from blueprints.quiz import quiz_blueprint, quiz_list, quiz_details
from dtos import QuizDtoSchema, QuizQuestionDtoSchema, QuizDetailedDtoSchema


def create_app() -> Flask:
    spec = APISpec(
        title="MyBrEng API",
        version="2.0.0",
        openapi_version="3.0.2",
        tags=[
            dict(
                name="User",
                description="Endpoints related to users"
            )
        ],
        servers=[
            dict(
                description="Development server",
                url="http://127.0.0.1:5000"
            )
        ],
        plugins=[
            FlaskPlugin(),
            MarshmallowPlugin()
        ],
    )

    spec.components\
        .schema("QuizDto", schema=QuizDtoSchema)\
        .schema("QuizQuestionDto", schema=QuizQuestionDtoSchema)\
        .schema("QuizDetailedDto", schema=QuizDetailedDtoSchema)

    # di = DI()
    flask = Flask(__name__)
    flask.config.from_file('configuration.json', load=json.load)
    flask.register_blueprint(quiz_blueprint, url_prefix='/api/v1/quiz')
    # di.init_resources()
    # db.init_app(flask)
    # login_manager = LoginManager()
    # login_manager.init_app(flask)
    #
    with flask.test_request_context():
        spec.path(view=quiz_list)
        spec.path(view=quiz_details)
    with open('./static/swagger.json', 'w') as f:
        json.dump(spec.to_dict(), f)

    flask.register_blueprint(get_swaggerui_blueprint(
        '/swagger',
        '/static/swagger.json',
        config={
            'app_name': "MyBrEng API"
        }
    ))

    # @login_manager.user_loader
    # def load_user(user_id):
    #     user_service = di.user_service()
    #     return user_service.find_user(user_id)

    @flask.errorhandler(401)
    def resource_not_found(_):
        return jsonify(error='401 Unauthorized'), 401

    CORS(flask, resources={r'/api/*': {'origins': 'http://localhost:4200'}})

    return flask


app = application = create_app()

if __name__ == '__main__':
    app.run()
