from flask import jsonify, make_response
from flask.blueprints import Blueprint
from dtos import QuizDto, QuizDetailedDto, QuizQuestionDto, QuizQuestionType
from uuid import uuid4


quiz_blueprint = Blueprint('quiz', __name__)


def _create_quiz_question(quiz_title: str, idx: int) -> QuizQuestionDto:
    return QuizQuestionDto(
        str(uuid4()),
        f'Question #{idx} of {quiz_title}',
        QuizQuestionType.SINGLE_CHOICE,
        idx
    )


def _create_quiz(idx: int) -> QuizDto:
    title = f'Quiz #{idx}'
    return QuizDetailedDto(
        str(uuid4()),
        title,
        f'Description of #{idx}',
        [_create_quiz_question(title, i) for i in range(5)]
    )


_quizzes = [_create_quiz(i) for i in range(10)]


@quiz_blueprint.route('/list')
def quiz_list():
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
    return jsonify(_quizzes)


@quiz_blueprint.route('/details/<quiz_id>')
def quiz_details(quiz_id: str):
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
    quiz = next(filter(lambda q: q.id == quiz_id, _quizzes), None)
    if quiz:
        return jsonify(quiz)
    else:
        return make_response('', 404)
