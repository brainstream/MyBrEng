from dependency_injector.wiring import Provide, inject
from flask import jsonify, make_response, request
from flask.blueprints import Blueprint
from flask_login import login_required, current_user
from di import DI
from dtos import StudentDtoSchema, StudentDetailedDtoSchema
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
    schema = StudentDtoSchema()
    response = schema.dump(student_facade.get_students(current_user.id), many=True)
    return jsonify(response)


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
    if student:
        schema = StudentDetailedDtoSchema()
        return jsonify(schema.dump(student))
    else:
        return make_response('', 404)