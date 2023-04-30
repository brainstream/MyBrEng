from dependency_injector.wiring import Provide, inject
from flask import jsonify, make_response, request
from flask.blueprints import Blueprint
from flask_login import login_required, current_user
from di import DI
from dtos import StudentDtoSchema
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
