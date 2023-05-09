from dependency_injector.wiring import Provide, inject
from flask import jsonify, make_response, request
from flask.blueprints import Blueprint
from flask_login import login_required, current_user
from di import DI
from dtos import StudentDtoSchema, StudentDetailedDtoSchema, StudentEditDtoSchema
from facades import StudentFacade

student_blueprint = Blueprint('student', __name__)


@student_blueprint.route('/list')
@login_required
@inject
def student_list(student_facade: StudentFacade = Provide[DI.student_facade]):
    """
    ---
    get:
      operationId: student_list
      tags: [Student]
      description: Returns a list of all user`s students
      responses:
        200:
          description: List of students
          content:
            application/json:
              schema:
                type: array
                items: StudentDto
    """
    students = student_facade.get_students(current_user.id)
    schema = StudentDtoSchema()
    return jsonify(schema.dump(students, many=True))


@student_blueprint.route('/details/<student_id>', methods=['GET'])
@login_required
@inject
def student_details(student_id: str, student_facade: StudentFacade = Provide[DI.student_facade]):
    """
    ---
    get:
      operationId: student_details
      tags: [Student]
      description: Returns a student by ID
      parameters:
      - in: path
        name: student_id
        schema:
          type: string
          format: uuid
          description: Student ID
      responses:
        200:
          description: Student
          content:
            application/json:
              schema: StudentDetailedDto
        404:
          description: Student with specified ID not found
    """
    student = student_facade.get_student(current_user.id, student_id)
    if student is None:
        return make_response('', 404)
    schema = StudentDetailedDtoSchema()
    return jsonify(schema.dump(student))


@student_blueprint.route('/details', methods=['POST'])
@login_required
@inject
def student_save(student_facade: StudentFacade = Provide[DI.student_facade]):
    """
    ---
    post:
      operationId: student_save
      tags: [Student]
      description: Edits or creates a student
      requestBody:
        content:
          application/json:
            schema: StudentEditDto
      responses:
        200:
          description: Student saved successfully
          content:
            application/json:
              schema: StudentDto
        404:
          description: Student with specified ID not found
    """
    request_schema = StudentEditDtoSchema()
    edit_dto = request_schema.loads(request.get_data(as_text=True))
    student = student_facade.create_student(current_user.id, edit_dto) if edit_dto.id is None else \
        student_facade.edit_student(current_user.id, edit_dto)
    if student is None:
        return make_response('', 404)
    response_schema = StudentDtoSchema()
    return jsonify(response_schema.dump(student))


@student_blueprint.route('/<student_id>', methods=['DELETE'])
@login_required
@inject
def student_delete(student_id: str, student_facade: StudentFacade = Provide[DI.student_facade]):
    """
    ---
    delete:
      operationId: student_delete
      tags: [Student]
      description: Deletes a student
      parameters:
      - in: path
        name: student_id
        schema:
          type: string
          format: uuid
          description: Student ID to delete
      responses:
        200:
          description: Student deleted successful
        404:
          description: Student with specified ID not found
    """
    return make_response('', 200 if student_facade.delete_student(current_user.id, student_id) else 404)
