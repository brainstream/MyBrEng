from flask import Flask
from blueprints.quiz import quiz_blueprint


def create_app() -> Flask:
    flask = Flask(__name__)
    flask.register_blueprint(quiz_blueprint, url_prefix='/quiz')
    return flask


app = application = create_app()

if __name__ == '__main__':
    app.run()
