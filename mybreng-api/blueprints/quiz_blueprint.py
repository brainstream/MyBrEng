from dependency_injector.wiring import Provide, inject
from flask import jsonify, make_response, request
from flask.blueprints import Blueprint
from flask_login import login_required, current_user

from di import DI
from dtos import QuizEditDto
from facades import QuizFacade

quiz_blueprint = Blueprint('quiz', __name__)


@quiz_blueprint.route('/list')
@login_required
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
    return jsonify(quiz_facade.get_quizzes(current_user.id))


@quiz_blueprint.route('/details/<quiz_id>', methods=['GET'])
@login_required
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
    quiz = quiz_facade.get_quiz(quiz_id, current_user.id)
    if quiz:
        return jsonify(quiz)
    else:
        return make_response('', 404)


@quiz_blueprint.route('/details/<quiz_id>', methods=['PUT'])
@login_required
@inject
def quiz_edit(quiz_id: str, quiz_facade: QuizFacade = Provide[DI.quiz_facade]):
    """
    ---
    put:
      operationId: quiz_edit
      tags: [Quiz]
      description: Edits a quiz main info
      requestBody:
        content:
          application/json:
            schema: QuizEditDto
      parameters:
      - in: path
        name: quiz_id
        schema:
          type: string
          format: uuid
          description: Quiz ID
      responses:
        200:
          description: Quiz edited successfully
        404:
          description: Quiz with specified ID not found
    """
    request_data = request.get_json()
    dto = QuizEditDto(request_data['title'], request_data['description'])
    status = 404 if quiz_facade.edit_quiz(quiz_id, current_user.id, dto) is None else 200
    return make_response('', status)
