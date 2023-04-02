from dependency_injector.wiring import Provide, inject
from flask import jsonify, make_response
from flask.blueprints import Blueprint
from di import DI
from facades import QuizFacade

quiz_blueprint = Blueprint('quiz', __name__)


@quiz_blueprint.route('/list')
@inject
def quiz_list(quiz_facade: QuizFacade = Provide[DI.quiz_facade]):
    """
    ---
    get:
      operationId: quiz_list
      tags: [Quiz]
      description: Returns a list of all user`s quizzes
      responses:
        200:
          description: List of quizzes
          content:
            application/json:
              schema:
                type: array
                items: QuizDto
    """
    return jsonify(quiz_facade.get_quizzes())


@quiz_blueprint.route('/details/<quiz_id>')
@inject
def quiz_details(quiz_id: str, quiz_facade: QuizFacade = Provide[DI.quiz_facade]):
    """
    ---
    get:
      operationId: quiz_details
      tags: [Quiz]
      description: Returns a quiz by ID
      parameters:
      - in: path
        name: quiz_id
        schema:
          type: string
          format: uuid
          description: Quiz ID
      responses:
        200:
          description: Quiz
          content:
            application/json:
              schema: QuizDetailedDto
        404:
          description: Quiz with specified ID not found
    """
    quiz = quiz_facade.get_quiz(quiz_id)
    if quiz:
        return jsonify(quiz)
    else:
        return make_response('', 404)
