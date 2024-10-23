from dependency_injector.wiring import Provide, inject
from flask import jsonify, make_response, request
from flask.blueprints import Blueprint
from flask_login import login_required, current_user
from di import DI
from dtos import \
    QuizQuestionEditDtoSchema, \
    QuizQuestionPositionDtoSchema, \
    QuizDtoSchema, \
    QuizDetailedDtoSchema, \
    QuizEditDtoSchema, \
    QuizQuestionDtoSchema
from facades import QuizFacade, QuizQuestionFacade

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
    schema = QuizDtoSchema()
    quizzes = quiz_facade.get_quizzes(current_user.id)
    return jsonify(schema.dump(quizzes, many=True))


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
    quiz = quiz_facade.get_quiz(current_user.id, quiz_id)
    if quiz is None:
        return make_response('', 404)
    schema = QuizDetailedDtoSchema()
    return jsonify(schema.dump(quiz))


@quiz_blueprint.route('/details', methods=['POST'])
@login_required
@inject
def quiz_save(quiz_facade: QuizFacade = Provide[DI.quiz_facade]):
    """
    ---
    post:
      operationId: quiz_save
      tags: [Quiz]
      description: Edits or creates a quiz
      requestBody:
        content:
          application/json:
            schema: QuizEditDto
      responses:
        200:
          description: Quiz saved successfully
          content:
            application/json:
              schema: QuizDto
        404:
          description: Quiz with specified ID not found
    """
    request_schema = QuizEditDtoSchema()
    dto = request_schema.loads(request.get_data(as_text=True))
    quiz = quiz_facade.create_quiz(current_user.id, dto) if dto.id is None else \
        quiz_facade.edit_quiz(current_user.id, dto)
    if quiz is None:
        return make_response('', 404)
    response_schema = QuizDtoSchema()
    return jsonify(response_schema.dump(quiz))


@quiz_blueprint.route('/<quiz_id>', methods=['DELETE'])
@login_required
@inject
def quiz_delete(quiz_id: str, quiz_facade: QuizFacade = Provide[DI.quiz_facade]):
    """
    ---
    delete:
      operationId: quiz_delete
      tags: [Quiz]
      description: Deletes a quiz
      parameters:
      - in: path
        name: quiz_id
        schema:
          type: string
          format: uuid
          description: Quiz ID to delete
      responses:
        200:
          description: Quiz deleted successful
        404:
          description: Quiz with specified ID not found
    """
    return make_response('', 200 if quiz_facade.delete_quiz(current_user.id, quiz_id) else 404)


@quiz_blueprint.route('/question', methods=['POST'])
@login_required
@inject
def quiz_question_save(quiz_question_facade: QuizQuestionFacade = Provide[DI.quiz_question_facade]):
    """
    ---
    post:
      operationId: quiz_question_save
      tags: [Quiz]
      description: Edits or creates a quiz question
      requestBody:
        content:
          application/json:
            schema: QuizQuestionEditDto
      responses:
        200:
          description: Question saved successfully
          content:
            application/json:
              schema: QuizQuestionDto
        404:
          description: Quiz with specified ID not found
    """
    request_schema = QuizQuestionEditDtoSchema()
    edit_dto = request_schema.loads(request.get_data(as_text=True))
    question = quiz_question_facade.create_question(current_user.id, edit_dto) if edit_dto.id is None \
        else quiz_question_facade.edit_question(current_user.id, edit_dto)
    if question is None:
        return make_response('', 404)
    response_schema = QuizQuestionDtoSchema()
    return jsonify(response_schema.dump(question))

@quiz_blueprint.route('/clone-question/<question_id>', methods=['POST'])
@login_required
@inject
def quiz_question_clone(question_id: str, quiz_question_facade: QuizQuestionFacade = Provide[DI.quiz_question_facade]):
    """
    ---
    post:
      operationId: quiz_question_clone
      tags: [Quiz]
      description: Clones a quiz question
      parameters:
      - in: path
        name: question_id
        schema:
          type: string
          format: uuid
          description: Question ID to clone
      responses:
        200:
          description: Question cloned successfully
          content:
            application/json:
              schema: QuizQuestionDto
        404:
          description: Question with specified ID not found
    """
    question = quiz_question_facade.clone_question(current_user.id, question_id)
    if question is None:
        return make_response('', 404)
    response_schema = QuizQuestionDtoSchema()
    return jsonify(response_schema.dump(question))

@quiz_blueprint.route('/question/<question_id>', methods=['DELETE'])
@login_required
@inject
def quiz_question_delete(question_id: str, quiz_question_facade: QuizQuestionFacade = Provide[DI.quiz_question_facade]):
    """
    ---
    delete:
      operationId: quiz_question_delete
      tags: [Quiz]
      description: Deletes a quiz question
      parameters:
      - in: path
        name: question_id
        schema:
          type: string
          format: uuid
          description: Question ID to delete
      responses:
        200:
          description: Question deleted successfully
        404:
          description: Question with specified ID not found
    """
    result = quiz_question_facade.delete_question(current_user.id, question_id)
    return make_response('', 200 if result else 404)


@quiz_blueprint.route('/reorder-questions/<quiz_id>', methods=['POST'])
@login_required
@inject
def quiz_reorder_questions(quiz_id: str, quiz_question_facade: QuizQuestionFacade = Provide[DI.quiz_question_facade]):
    """
    ---
    post:
      operationId: quiz_reorder_questions
      tags: [Quiz]
      description: Reorders questions in the quiz
      parameters:
      - in: path
        name: quiz_id
        schema:
          type: string
          format: uuid
          description: Quiz ID
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items: QuizQuestionPositionDto
      responses:
        200:
          description: Questions reordered successfully
          content:
            application/json:
              schema:
                type: array
                items: QuizQuestionDto
        404:
          description: Quiz or question with specified ID not found
    """
    request_schema = QuizQuestionPositionDtoSchema()
    questions = request_schema.loads(request.get_data(as_text=True), many=True)
    result = quiz_question_facade.reorder_questions(current_user.id, quiz_id, questions)
    if result is None:
        return make_response('', 404)
    response_schema = QuizQuestionDtoSchema()
    return jsonify(response_schema.dump(result, many=True))
