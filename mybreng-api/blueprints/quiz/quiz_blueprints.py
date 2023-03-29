from flask import jsonify
from flask.blueprints import Blueprint
from dtos import QuizDto
from uuid import uuid4


quiz_blueprint = Blueprint('quiz', __name__)


_quizzes = [QuizDto(str(uuid4()), f'Quiz #{i}', f'Description of #{i}') for i in range(10)]


@quiz_blueprint.route('/list')
def quiz_list():
    """
    ---
    get:
      operationId: quiz_list
      tags: [Quiz]
      description: Returns a list of all user's quizzes
      responses:
        200:
          description: List of quizzes
          content:
            application/json:
              schema:
                type: array
                items: QuizDtoSchema
    """
    return jsonify(_quizzes)
